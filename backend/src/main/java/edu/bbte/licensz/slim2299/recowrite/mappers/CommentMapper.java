package edu.bbte.licensz.slim2299.recowrite.mappers;

import edu.bbte.licensz.slim2299.recowrite.controllers.dto.outgoing.CommentDtoOut;
import edu.bbte.licensz.slim2299.recowrite.dao.models.CommentModel;
import edu.bbte.licensz.slim2299.recowrite.dao.models.UserModel;
import org.springframework.stereotype.Component;

@Component
public class CommentMapper {
    public CommentDtoOut modelToDto(CommentModel comment) {
        CommentDtoOut commentDto = new CommentDtoOut();
        commentDto.setId(comment.getId());
        commentDto.setComment(comment.getComment());
        UserModel userModel = comment.getUser();
        commentDto.setAuthorId(userModel.getId());
        commentDto.setAuthorName(userModel.getName());
        commentDto.setAuthorAvatar(userModel.getAvatar());
        commentDto.setAuthorUsername(userModel.getUsername());
        return commentDto;
    }
}
