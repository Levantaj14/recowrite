package edu.bbte.licensz.slim2299.recowrite.services;

import edu.bbte.licensz.slim2299.recowrite.controllers.dto.CommentDtoIn;
import edu.bbte.licensz.slim2299.recowrite.controllers.dto.CommentDtoOut;
import java.util.List;

public interface CommentServiceInterface {
    List<CommentDtoOut> findAllByBlog(Long blogId);

    long addComment(CommentDtoIn commentDtoIn, long blogId, String username);

    void editComment(CommentDtoIn commentDtoIn);

    void deleteCommentById(Long id);
}
