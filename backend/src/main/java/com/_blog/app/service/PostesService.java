package com._blog.app.service;

import java.io.File;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

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

import jakarta.transaction.Transactional;

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

    // private static final Logger logger = LoggerFactory.getLogger(PostesService.class);
    public GlobalDataResponse<List<GlobalDataResponse.PostResponse>> homePostes(UserAccount user, int page, int size) {
        List<GlobalDataResponse.PostResponse> posts = new ArrayList<>();
        Page<Postes> postsPage = Page.empty();
        try {
            // all user following from me
            List<Subscribers> followinTarget = subscriberRepo.findByUser(user);
            // njib target mn row li ana dyr lihom follow 
            // useres li ghnjib lihomm postat
            List<UserAccount> postUserTarget = new ArrayList<>(followinTarget.stream().map(Subscribers::getTarget).toList());
            // kanzid rasi bax njib postat dyali
            postUserTarget.add(user);
            postsPage = posteRepo.findByUserIn(postUserTarget, PageRequest.of(page, size,
                    Sort.by(Sort.Direction.DESC, "createdAt")));

            System.out.println("jaw postat mn db ");

            posts = postsPage.getContent().stream().map(post -> {
                boolean liked = likeRepo.existsByUserIdAndPostId(user.getId(), post.getId());
                long totaLike = likeRepo.countByPostId(post.getId());
                long totalComment = commentRepo.countByPostId(post.getId());
                return GlobalDataResponse.PostResponse.builder().
                        id(post.getId()).
                        authore(post.getUser().getUsername()).
                        avatar(post.getUser().getAvatar()).
                        createTime(post.getCreatedAt()).
                        updateTime(post.getUpdateAt()).
                        descreption(post.getDescription()).
                        media(post.getMedia()).
                        totalComment(totalComment).
                        totalLike(totaLike).
                        liked(liked)
                        .build();
            }).toList();
            System.out.println("post jaw ---> " + posts.size());
        } catch (Exception e) {
            System.out.println("post error ---> " + e.getMessage());
            throw e;
        }

        return new GlobalDataResponse<>(posts, postsPage.getNumber(),
                postsPage.getTotalPages(), postsPage.hasNext());
    }

    public void creatPoste(PosteCreationRequest postRequest, UserAccount currentUser, List<MultipartFile> file) {

        List<GlobalDataResponse.Media> media = new ArrayList<>();
        if (file != null && !file.isEmpty()) {
            List<PosteUtils.MediaData> mediaData = posteUtils.saveMedia(file);
            mediaData.stream().forEach(m -> {
                media.add(new GlobalDataResponse.Media(m.getType(), m.getFilePath()));
            });

        }
        Postes post = new Postes(postRequest.description(), media, currentUser);

        subscriberRepo.findByTarget(currentUser)
                .ifPresent(followers -> followers.forEach(follower -> {
            String content = currentUser.getUsername() + " shared a new post";
            notificationService.insertNotification(follower.getUser(), content);
        }));
        post.setCreatedAt(LocalDateTime.now());
        post.setUpdateAt(LocalDateTime.now());
        posteRepo.save(post);

    }

    @Transactional
    public void deletPost(UUID postId, UserAccount currentUser) {
        Postes post = posteUtils.findPostById(postId);

        if (!posteUtils.haveAccess(post, currentUser)) {
            throw CustomResponseException.CustomException(403,
                    "can't have access for delete post");
        }
        List<GlobalDataResponse.Media> mediaPostes = post.getMedia();
        posteRepo.deleteById(post.getId());
        if (mediaPostes != null && !mediaPostes.isEmpty()) {
            for (GlobalDataResponse.Media media : mediaPostes) {
                File f = new File(".." + media.getMediaUrl()); // kayna t9dr tzid path root
                if (f.exists()) {
                    f.delete(); // delete file
                }
            }
        }

    }

    public List<GlobalDataResponse.Media> updatePost(PosteUpdateRequest updateRequest, List<MultipartFile> file, UserAccount currentUser) {
        Postes post = posteUtils.findPostById(updateRequest.postId());

        if (!posteUtils.haveAccess(post, currentUser)) {
            throw CustomResponseException.CustomException(403, "You can't update this post");
        }

        if (updateRequest.description() != null && !updateRequest.description().isBlank()) {
            post.setDescription(updateRequest.description());
        }
        if (updateRequest.removedMediaIds() != null && !updateRequest.removedMediaIds().isEmpty()) {
            Iterator<GlobalDataResponse.Media> iterator = post.getMedia().iterator();
            while (iterator.hasNext()) {
                GlobalDataResponse.Media media = iterator.next();
                if (updateRequest.removedMediaIds().contains(media.getMediaUrl())) {
                    File f = new File(".." + media.getMediaUrl());
                    if (f.exists()) {
                        f.delete();
                    }
                    iterator.remove();
                }
            }

        }
        if (file != null && !file.isEmpty()) {
            List<PosteUtils.MediaData> mediaData = posteUtils.saveMedia(file);
            mediaData.forEach(m -> {
                post.getMedia().add(new GlobalDataResponse.Media(m.getType(), m.getFilePath()));
            });
        }
        posteRepo.save(post);
        return post.getMedia();
    }

    @Transactional
    public String likePost(UUID postId, UserAccount currentUser) {
        Postes post = posteUtils.findPostById(postId);
        if (likeRepo.existsByUserIdAndPostId(currentUser.getId(), post.getId())) {
            likeRepo.deleteByUserIdAndPostId(currentUser.getId(), post.getId());
            return "diselike";
        } else {
            Liks like = new Liks();
            like.setUser(currentUser);
            like.setPost(post);
            likeRepo.save(like);
            String content = currentUser.getUsername() + " Liked your post titled '" + "'" + post.getDescription();
            notificationService.insertNotification(post.getUser(), content);
        }
        return "Like";
    }

    public List<GlobalDataResponse.Comment> getComment(UUID postId, UserAccount currentUser) {

        List<Comment> comments = commentRepo.findAllByUserIdAndPostId(currentUser.getId(), postId);
        return comments.stream().map(c -> {
            String avatar = c.getUser().getAvatar();
            String authore = c.getUser().getUsername();
            return GlobalDataResponse.Comment.builder()
                    .id(c.getId())
                    .authore(authore)
                    .avatar(avatar)
                    .content(c.getContente())
                    .createTime(c.getCrat_at())
                    .build();
        }).toList();
    }

    public GlobalDataResponse.Comment commentPost(CommentPosteRequest commentPosteRequest, UserAccount currentUser) {
        Postes post = posteUtils.findPostById(commentPosteRequest.postId());
        Comment comment = new Comment();
        comment.setContente(commentPosteRequest.description());
        comment.setPost(post);
        comment.setUser(currentUser);
        commentRepo.save(comment);
        String content = currentUser.getUsername() + " comment your post titled '" + "'" + post.getDescription();
        notificationService.insertNotification(post.getUser(), content);
        return GlobalDataResponse.Comment.builder()
                .id(comment.getId())
                .authore(comment.getUser().getUsername())
                .avatar(comment.getUser().getAvatar())
                .content(comment.getContente())
                .createTime(comment.getCrat_at())
                .build();
    }


@Transactional
    public void deletComment(UUID commentId, UserAccount currentUser) {
        Comment comment = posteUtils.findComentById(commentId);

        if (!posteUtils.haveAccess(comment, currentUser)) {
            throw CustomResponseException.CustomException(403, "You can't delet this comment");
        }

        commentRepo.deleteById(comment.getId());
    }

}
