package edu.bbte.licensz.slim2299.recowrite.services;

import edu.bbte.licensz.slim2299.recowrite.controllers.dto.outgoing.LikedBlogsDtoOut;

import java.util.List;

public interface LikeServiceInterface {
    long likeCount(long blogId);

    void changeLike(long blogId, String username);

    boolean isLike(long blogId, String username);

    List<LikedBlogsDtoOut> getLikedBlogs(String username);

    long receivedLikeCount(String username);
}
