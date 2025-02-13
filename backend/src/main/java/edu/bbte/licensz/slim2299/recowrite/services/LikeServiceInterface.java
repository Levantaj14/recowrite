package edu.bbte.licensz.slim2299.recowrite.services;

public interface LikeServiceInterface {
    long likeCount(long blogId);

    void changeLike(long blogId, String username);

    boolean isLike(long blogId, String username);
}
