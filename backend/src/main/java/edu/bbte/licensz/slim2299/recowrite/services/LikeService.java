package edu.bbte.licensz.slim2299.recowrite.services;

import edu.bbte.licensz.slim2299.recowrite.controllers.dto.outgoing.LikedBlogsDtoOut;
import edu.bbte.licensz.slim2299.recowrite.dao.exceptions.BlogNotAvailableException;
import edu.bbte.licensz.slim2299.recowrite.dao.exceptions.BlogNotFoundException;
import edu.bbte.licensz.slim2299.recowrite.dao.managers.BlogManager;
import edu.bbte.licensz.slim2299.recowrite.dao.managers.LikeManager;
import edu.bbte.licensz.slim2299.recowrite.dao.models.BlogModel;
import edu.bbte.licensz.slim2299.recowrite.dao.models.LikeModel;
import edu.bbte.licensz.slim2299.recowrite.dao.models.UserModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class LikeService implements LikeServiceInterface {
    private final LikeManager likeManager;
    private final UserServiceInterface userService;
    private final BlogManager blogManager;

    @Autowired
    public LikeService(LikeManager likeManager, UserServiceInterface userService, BlogManager blogManager) {
        this.likeManager = likeManager;
        this.userService = userService;
        this.blogManager = blogManager;
    }

    @Override
    public long likeCount(long blogId) {
        return likeManager.countByBlog_Id(blogId);
    }

    @Override
    public void changeLike(long blogId, String username) {
        Optional<BlogModel> blog = blogManager.findByIdAndVisible(blogId, true);
        if (blog.isEmpty()) {
            throw new BlogNotFoundException("Blog with id " + blogId + " not found");
        }
        BlogModel blogModel = blog.get();
        // Checking if a blog is available so it an unpublished post can't be liked
        Instant now = Instant.now();
        Instant blogDate = blogModel.getDate().toInstant();
        if (blogDate.isAfter(now)) {
            throw new BlogNotAvailableException("Blog not available");
        }
        UserModel user = userService.getUserModelByUsername(username);
        Optional<LikeModel> likeModel = likeManager.findByBlog_IdAndUser(blogId, user);
        if (likeModel.isPresent()) {
            LikeModel like = likeModel.get();
            likeManager.delete(like);
        } else {
            LikeModel like = new LikeModel();
            like.setBlog(blogModel);
            like.setUser(user);
            likeManager.save(like);
        }
    }

    @Override
    public boolean isLike(long blogId, String username) {
        UserModel user = userService.getUserModelByUsername(username);
        Optional<LikeModel> likeModel = likeManager.findByBlog_IdAndUser(blogId, user);
        return likeModel.isPresent();
    }

    @Override
    public List<LikedBlogsDtoOut> getLikedBlogs(String username) {
        UserModel user = userService.getUserModelByUsername(username);
        Optional<List<LikeModel>> likeModel = likeManager.findAllByUser(user);
        if (likeModel.isPresent()) {
            List<LikeModel> likeModelList = likeModel.get();
            List<LikedBlogsDtoOut> likedBlogsDtoOut = new ArrayList<>();
            for (LikeModel likeModelItem : likeModelList) {
                BlogModel blog = likeModelItem.getBlog();
                LikedBlogsDtoOut dtoOut = new LikedBlogsDtoOut(blog.getId(), blog.getUser().getName(), blog.getTitle());
                likedBlogsDtoOut.add(dtoOut);
            }
            return likedBlogsDtoOut;
        }
        return new ArrayList<>();
    }

    @Override
    public long receivedLikeCount(String username) {
        UserModel user = userService.getUserModelByUsername(username);
        Optional<List<LikeModel>> likeModel = likeManager.findAllByBlogUser(user);
        return likeModel.map(List::size).orElse(0);
    }
}
