package edu.bbte.licensz.slim2299.recowrite.services;

import edu.bbte.licensz.slim2299.recowrite.controllers.dto.incoming.CommentDtoIn;
import edu.bbte.licensz.slim2299.recowrite.controllers.dto.outgoing.CommentDtoOut;
import edu.bbte.licensz.slim2299.recowrite.dao.exceptions.BlogNotFoundException;
import edu.bbte.licensz.slim2299.recowrite.dao.exceptions.CommentNotFoundException;
import edu.bbte.licensz.slim2299.recowrite.dao.exceptions.UserNotFoundException;
import edu.bbte.licensz.slim2299.recowrite.dao.managers.BlogManager;
import edu.bbte.licensz.slim2299.recowrite.dao.managers.CommentManager;
import edu.bbte.licensz.slim2299.recowrite.dao.managers.UserManager;
import edu.bbte.licensz.slim2299.recowrite.dao.models.BlogModel;
import edu.bbte.licensz.slim2299.recowrite.dao.models.CommentModel;
import edu.bbte.licensz.slim2299.recowrite.dao.models.UserModel;
import edu.bbte.licensz.slim2299.recowrite.mappers.CommentMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CommentService implements CommentServiceInterface{

    @Autowired
    private CommentManager commentManager;

    @Autowired
    private CommentMapper commentMapper;

    @Autowired
    private BlogManager blogManager;

    @Autowired
    private UserManager userManager;

    @Override
    public List<CommentDtoOut> findAllByBlog(Long blogId) {
        Optional<List<CommentModel>> comments = commentManager.findAllByBlog_Id(blogId);
        List<CommentDtoOut> commentDtos = new ArrayList<>();
        if (comments.isPresent()) {
            for (CommentModel commentModel : comments.get()) {
                commentDtos.add(commentMapper.modelToDto(commentModel));
            }
        }
        return commentDtos;
    }

    @Override
    public long addComment(CommentDtoIn commentDtoIn, long blogId, String username) {
        CommentModel commentModel = new CommentModel();
        commentModel.setComment(commentDtoIn.getComment());
        Optional<UserModel> user = userManager.findByUsername(username);
        if (user.isEmpty()) {
            throw new UserNotFoundException("User not found");
        }
        commentModel.setUser(user.get());
        Optional<BlogModel> blog = blogManager.findById(blogId);
        if (blog.isEmpty()) {
            throw new BlogNotFoundException("Blog not found");
        }
        commentModel.setBlog(blog.get());
        return commentManager.save(commentModel).getId();
    }

    @Override
    public boolean isCommentOwnedByUser(Long commentId, String username) {
        Optional<UserModel> user = userManager.findByUsername(username);
        if (user.isEmpty()) {
            return false;
        }
        Optional<CommentModel> comment = commentManager.findByIdAndUser(commentId, user.get());
        return comment.isPresent();
    }

    @Override
    public void editComment(CommentDtoIn commentDtoIn, Long commentId) {
        Optional<CommentModel> comment = commentManager.findById(commentId);
        if (comment.isEmpty()) {
            throw new CommentNotFoundException("Comment not found");
        }
        comment.get().setComment(commentDtoIn.getComment());
        commentManager.save(comment.get());
    }

    @Override
    public void deleteCommentById(Long id) {
        commentManager.deleteById(id);
    }
}
