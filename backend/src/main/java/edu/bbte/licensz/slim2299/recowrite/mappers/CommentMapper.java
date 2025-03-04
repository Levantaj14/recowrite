package edu.bbte.licensz.slim2299.recowrite.mappers;

import edu.bbte.licensz.slim2299.recowrite.controllers.dto.outgoing.CommentDtoOut;
import edu.bbte.licensz.slim2299.recowrite.dao.models.CommentModel;
import edu.bbte.licensz.slim2299.recowrite.dao.models.UserModel;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;

@Slf4j
@Component
public class CommentMapper {
    public CommentDtoOut modelToDto(CommentModel comment) {
        CommentDtoOut commentDto = new CommentDtoOut();
        commentDto.setId(comment.getId());
        commentDto.setComment(comment.getComment());
        UserModel userModel = comment.getUser();
        commentDto.setAuthorId(userModel.getId());
        commentDto.setAuthorName(userModel.getName());
        if (userModel.getAvatar() != null && !userModel.getAvatar().isEmpty()) {
            Path path = Paths.get(userModel.getAvatar());
            try {
                byte[] fileBytes = Files.readAllBytes(path);
                String base64 = Base64.getEncoder().encodeToString(fileBytes);
                commentDto.setAuthorAvatar(base64);
            } catch (IOException e) {
                log.error("There was an error reading the user avatar file");
                commentDto.setAuthorAvatar("");
            }
        }
        commentDto.setAuthorUsername(userModel.getUsername());
        return commentDto;
    }
}
