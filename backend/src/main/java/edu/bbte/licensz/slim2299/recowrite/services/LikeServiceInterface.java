package edu.bbte.licensz.slim2299.recowrite.services;

public interface LikeServiceInterface {
    void changeLike(long blogId, String username);

    boolean isLike(long blogId, String username);
}
