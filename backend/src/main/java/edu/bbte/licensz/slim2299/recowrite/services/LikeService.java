package edu.bbte.licensz.slim2299.recowrite.services;

import edu.bbte.licensz.slim2299.recowrite.dao.managers.LikeManager;
import edu.bbte.licensz.slim2299.recowrite.dao.models.BlogModel;
import edu.bbte.licensz.slim2299.recowrite.dao.models.LikeModel;
import edu.bbte.licensz.slim2299.recowrite.dao.models.UserModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class LikeService implements LikeServiceInterface{

    @Autowired
    private LikeManager likeManager;

    @Autowired
    private UserService userService;

    @Autowired
    private BlogService blogService;

    @Override
    public void changeLike(long blogId, String username) {
        UserModel user = userService.getUserModelByUsername(username);
        Optional<LikeModel> likeModel = likeManager.findByIdAndUser(blogId, user);
        if (likeModel.isPresent()) {
            LikeModel like = likeModel.get();
            likeManager.delete(like);
        } else {
            LikeModel like = new LikeModel();
            BlogModel blog = blogService.getBlogModelById(blogId);
            like.setBlog(blog);
            like.setUser(user);
            likeManager.save(like);
        }
    }

    @Override
    public boolean isLike(long blogId, String username) {
        UserModel user = userService.getUserModelByUsername(username);
        Optional<LikeModel> likeModel = likeManager.findByIdAndUser(blogId, user);
        return likeModel.isPresent();
    }
}
