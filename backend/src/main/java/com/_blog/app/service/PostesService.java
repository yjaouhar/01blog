package com._blog.app.service;

import java.io.File;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
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

    public List<GlobalDataResponse.PostResponse> homePostes(UserAccount user) {
        List<Subscribers> followinTarget = subscriberRepo.findByUser(user);
        List<UserAccount> postUserTarget = new ArrayList<>(
                followinTarget.stream().map(Subscribers::getTarget).filter(u -> u.isActive()).toList());

        postUserTarget.add(user);
        List<Postes> postsPage = posteRepo.findByUserIn(postUserTarget).stream().filter(p -> !p.isHide()).toList();

        List<GlobalDataResponse.PostResponse> posts = postsPage.stream().map(post -> {
            boolean liked = likeRepo.existsByUserIdAndPostId(user.getId(), post.getId());
            long totaLike = likeRepo.countByPostId(post.getId());
            long totalComment = commentRepo.countByPostId(post.getId());
            return GlobalDataResponse.PostResponse.builder().id(post.getId()).authore(post.getUser().getUsername())
                    .avatar(post.getUser().getAvatar()).createTime(post.getCreatedAt())
                    .descreption(post.getDescription()).media(post.getMedia()).totalComment(totalComment)
                    .totalLike(totaLike).liked(liked)
                    .build();
        }).toList();

        return posts;
    }

    @Transactional(readOnly = true)
    public GlobalDataResponse.PostResponse getPostes(UserAccount user, UUID id) {
        Optional<Postes> poste = posteRepo.findById(id);
        Postes post = poste.orElseThrow();
        if (post.isHide()) {
            throw CustomResponseException.CustomException(403, "this post is hide");
        }
        boolean liked = likeRepo.existsByUserIdAndPostId(user.getId(), post.getId());
        long totaLike = likeRepo.countByPostId(post.getId());
        long totalComment = commentRepo.countByPostId(post.getId());
        return GlobalDataResponse.PostResponse.builder().
                id(post.getId()).
                authore(post.getUser().getUsername()).
                avatar(post.getUser().getAvatar()).
                createTime(post.getCreatedAt()).
                descreption(post.getDescription()).
                media(post.getMedia()).
                totalComment(totalComment).
                totalLike(totaLike).
                liked(liked)
                .build();
    }

    @Transactional
    public GlobalDataResponse.PostResponse creatPoste(PosteCreationRequest postRequest, UserAccount currentUser, List<MultipartFile> file) {

        List<GlobalDataResponse.Media> media = new ArrayList<>();
        if (file != null && !file.isEmpty()) {
            List<PosteUtils.MediaData> mediaData = posteUtils.saveMedia(file);
            mediaData.stream().forEach(m -> {
                media.add(new GlobalDataResponse.Media(m.getType(), m.getFilePath()));
            });

        }
        Postes post = new Postes(postRequest.description(), media, currentUser);

        subscriberRepo.findByTarget(currentUser).forEach(follower -> {
            if (follower.getUser().isActive()) {
                String content = currentUser.getUsername() + " shared a new post";
                notificationService.insertNotification(follower.getUser(), content);
            }
        });
        post.setCreatedAt(LocalDateTime.now());
        posteRepo.save(post);
        return getPostes(currentUser, post.getId());

    }

    @Transactional
    public void deletPost(UUID postId, UserAccount currentUser) {
        Postes post = posteRepo.findByIdForUpdate(postId).orElseThrow(() -> CustomResponseException.CustomException(404, "post not found"));

        if (!posteUtils.haveAccess(post, currentUser)) {
            throw CustomResponseException.CustomException(403,
                    "can't have access for delete post");
        }
        if (post.isHide()) {
            throw CustomResponseException.CustomException(403, "this post is hide");
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

    @Transactional
    public List<GlobalDataResponse.Media> updatePost(PosteUpdateRequest updateRequest, List<MultipartFile> file, UserAccount currentUser) {
        Postes post = posteRepo.findByIdForUpdate(updateRequest.postId()).orElseThrow(() -> CustomResponseException.CustomException(404, "post not found"));;

        if (!posteUtils.haveAccess(post, currentUser)) {
            throw CustomResponseException.CustomException(403, "You can't update this post");
        }
        if (post.isHide()) {
            throw CustomResponseException.CustomException(403, "this post is hide");
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
        Postes post = posteRepo.findById(postId).orElseThrow(() -> CustomResponseException.CustomException(404, "post not found"));
        if (post.isHide()) {
            throw CustomResponseException.CustomException(403, "this post is hide");
        }
        Optional<Liks> likeOp = likeRepo.findByUserIdAndPostId(currentUser.getId(), postId);
        if (likeOp.isPresent()) {
            likeRepo.delete(likeOp.get());
        } else {
            Liks like = new Liks();
            like.setUser(currentUser);
            like.setPost(post);
            likeRepo.save(like);
        }

        return "Like";
    }

    @Transactional(readOnly = true)
    public List<GlobalDataResponse.Comment> getComment(UUID postId, UserAccount currentUser) {
        Postes post = posteRepo.findById(postId).orElseThrow(() -> CustomResponseException.CustomException(404, "post not found"));
        if (post.isHide()) {
            throw CustomResponseException.CustomException(403, "this post is hide");
        }
        List<Comment> comments = commentRepo.findAllByUserIdAndPostId(currentUser.getId(), postId);
        return comments.stream().filter(u -> u.getUser().isActive()).map(c -> {
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

    @Transactional
    public GlobalDataResponse.Comment commentPost(CommentPosteRequest commentPosteRequest, UserAccount currentUser) {
        Postes post = posteUtils.findPostById(commentPosteRequest.postId());
        if (post.isHide()) {
            throw CustomResponseException.CustomException(403, "this post is hide");
        }
        Comment comment = new Comment();
        comment.setContente(commentPosteRequest.description());
        comment.setPost(post);
        comment.setUser(currentUser);
        commentRepo.save(comment);
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
        Comment comment = commentRepo.findById(commentId).orElseThrow(() -> CustomResponseException.CustomException(404, "comment not found"));
        if (!posteUtils.haveAccess(comment, currentUser)) {
            throw CustomResponseException.CustomException(403, "You can't delet this comment");
        }
        commentRepo.deleteById(comment.getId());
    }

}
