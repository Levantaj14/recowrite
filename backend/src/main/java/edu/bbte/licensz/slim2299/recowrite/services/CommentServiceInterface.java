package edu.bbte.licensz.slim2299.recowrite.services;

import edu.bbte.licensz.slim2299.recowrite.controllers.dto.incoming.CommentDtoIn;
import edu.bbte.licensz.slim2299.recowrite.controllers.dto.outgoing.AccountCommentDtoOut;
import edu.bbte.licensz.slim2299.recowrite.controllers.dto.outgoing.CommentDtoOut;
import java.util.List;

public interface CommentServiceInterface {
    List<CommentDtoOut> findAllByBlog(Long blogId);

    List<AccountCommentDtoOut> findAllByAccount(String username);

    long addComment(CommentDtoIn commentDtoIn, long blogId, String username);

    boolean isCommentOwnedByUser(Long commentId, String username);

    void editComment(CommentDtoIn commentDtoIn, Long commentId);

    void deleteCommentById(Long id);
}
