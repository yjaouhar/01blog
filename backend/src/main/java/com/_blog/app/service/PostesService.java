package com._blog.app.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com._blog.app.dtos.CommentEditRequest;
import com._blog.app.dtos.CommentPosteRequest;
import com._blog.app.dtos.PosteCreationRequest;
import com._blog.app.dtos.PosteUpdateRequest;
import com._blog.app.entities.Comment;
import com._blog.app.entities.Liks;
import com._blog.app.entities.Postes;
import com._blog.app.entities.Subscribers;
import com._blog.app.entities.UserAccount;
import com._blog.app.repository.CommentRepo;
import com._blog.app.repository.LikeRepo;
import com._blog.app.repository.PosteRepo;
import com._blog.app.repository.SubscriberRepo;
import com._blog.app.shared.CustomResponseException;
import com._blog.app.shared.GlobalDataResponse;
import com._blog.app.utils.PosteUtils;

@Service
public class PostesService {

    @Autowired
    private PosteRepo posteRepo;
    @Autowired
    private LikeRepo likeRepo;
    @Autowired
    private CommentRepo commentRepo;
    @Autowired
    private SubscriberRepo subscriberRepo;
    @Autowired
    private PosteUtils posteUtils;
    @Autowired
    private NotificationService notificationService;

    private static final Logger logger = LoggerFactory.getLogger(PostesService.class);

    public GlobalDataResponse<List<GlobalDataResponse.PostResponse>> homePostes(UserAccount user, int page, int size) {
        List<Subscribers> following = subscriberRepo.findByUser(user);
        List<UserAccount> followedUser = new ArrayList<>(following.stream().map(Subscribers::getTarget).toList());
        followedUser.add(user);
        Page<Postes> postPage = posteRepo.findByUserIn(followedUser, PageRequest.of(page, size,
                Sort.by(Sort.Direction.DESC, "create_at")));
        List<GlobalDataResponse.PostResponse> posts = postPage.getContent().stream().map(post -> {
            boolean liked = likeRepo.existsByUserIdAndPostId(user.getId(), post.getId());
            long totaLike = likeRepo.countByPostId(post.getId());
          
            long totalComment = commentRepo.countByPostId(post.getId());
            GlobalDataResponse.PostResponse respo = new GlobalDataResponse.PostResponse();
            respo.setId(post.getId());
            respo.setTitle(post.getTitle());
            respo.setDescreption(post.getDescription());
            respo.setMediaType(post.getMedia_type());
            respo.setMediaUrl(post.getMedia_url());
            respo.setTotalComment(totalComment);
            respo.setTotalLike(totaLike);

            respo.setLiked(liked);
            return respo;
        }).toList();
        return new GlobalDataResponse<>(posts, postPage.getNumber(),
                postPage.getTotalPages(), postPage.hasNext());

    }

    public void creatPoste(PosteCreationRequest postRequest, UserAccount currentUser, MultipartFile file) {
        Postes post = new Postes();

        post.setTitle(postRequest.title());
        post.setDescription(postRequest.description());
        post.setMedia_type("text");
        if (file != null && !file.isEmpty()) {
            PosteUtils.MediaData mediaData = posteUtils.saveMedia(file);
            post.setMedia_url(mediaData.getFilePath());
            post.setMedia_type(mediaData.getType());
        }
        post.setUser(currentUser);
        subscriberRepo.findByTarget(currentUser)
                .ifPresent(followers -> followers.forEach(follower -> {
                    String content = currentUser.getUsername() + " shared a new post";
                    notificationService.insertNotification(follower.getUser(), content);
                }));
        posteRepo.save(post);

    }

    public void deletPost(UUID postId, UserAccount currentUser) {
        Postes post = posteUtils.findPostById(postId);

        if (!posteUtils.haveAccess(post, currentUser)) {
            throw CustomResponseException.CustomException(403,
                    "can't have access for delete post");
        }
        posteRepo.deleteById(post.getId());

    }

    public void updatePost(PosteUpdateRequest updateRequest, MultipartFile file, UserAccount currentUser) {
        Postes post = posteUtils.findPostById(updateRequest.postId());

        if (!posteUtils.haveAccess(post, currentUser)) {
            throw CustomResponseException.CustomException(403, "You can't update this post");
        }
        boolean isUpdate = false;
        if (updateRequest.title() != null && !updateRequest.title().isBlank()) {
            post.setTitle(updateRequest.title());
            isUpdate = true;
        }

        if (updateRequest.description() != null && !updateRequest.description().isBlank()) {
            post.setDescription(updateRequest.description());
            isUpdate = true;
        }

        if (file != null && !file.isEmpty()) {

            if (post.getMedia_url() != null) {
                Path oldFilePath = Paths.get(post.getMedia_url().substring(1));
                try {
                    Files.deleteIfExists(oldFilePath);
                } catch (IOException e) {
                    logger.warn("Failed to delete old media file: {}", oldFilePath, e);
                }
            }
            PosteUtils.MediaData mediaData = posteUtils.saveMedia(file);
            post.setMedia_url(mediaData.getFilePath());
            post.setMedia_type(mediaData.getType());
            isUpdate = true;

        }
        if (isUpdate) {
            post.setUpdate_at(LocalDateTime.now());
        }
        posteRepo.save(post);
    }

    public String likePost(UUID postId, UserAccount currentUser) {
        Postes post = posteUtils.findPostById(postId);
        if (likeRepo.existsByUserIdAndPostId(currentUser.getId(), post.getId())) {
            likeRepo.deleteByUserIdAndPostId(currentUser.getId(), post.getId());
            return "Like removed!";
        } else {
            Liks like = new Liks();
            like.setUser(currentUser);
            like.setPost(post);
            likeRepo.save(like);
            String content = currentUser.getUsername() + " Liked your post titled '" + "'" + post.getTitle();
            notificationService.insertNotification(post.getUser(), content);
        }
        return "Like added!";
    }

    public void commentPost(CommentPosteRequest commentPosteRequest, UserAccount currentUser) {
        Postes post = posteUtils.findPostById(commentPosteRequest.postId());
        Comment comment = new Comment();
        comment.setContente(commentPosteRequest.description());
        comment.setPost(post);
        comment.setUser(currentUser);
        commentRepo.save(comment);
        String content = currentUser.getUsername() + " comment your post titled '" + "'" + post.getTitle();
        notificationService.insertNotification(post.getUser(), content);
    }

    public void editComment(CommentEditRequest commentEditRequest, UserAccount currentUser) {

        Comment comment = posteUtils.findComentById(commentEditRequest.commentId());
        if (!posteUtils.haveAccess(comment, currentUser)) {
            throw CustomResponseException.CustomException(403, "You can't edit this comment");
        }

        if (!commentEditRequest.description().isEmpty()) {
            comment.setContente(commentEditRequest.description());
            comment.setEdit_at(LocalTime.now());
        }

        commentRepo.save(comment);
    }

    public void deletComment(UUID commentId, UserAccount currentUser) {
        Comment comment = posteUtils.findComentById(commentId);

        if (!posteUtils.haveAccess(comment, currentUser)) {
            throw CustomResponseException.CustomException(403, "You can't delet this comment");
        }

        commentRepo.deleteById(comment.getId());
    }

}
