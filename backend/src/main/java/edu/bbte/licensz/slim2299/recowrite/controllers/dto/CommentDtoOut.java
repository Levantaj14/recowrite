package edu.bbte.licensz.slim2299.recowrite.controllers.dto;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class CommentDtoOut {
    private long id;
    private String comment;
    private long authorId;
    private String authorName;
    private String authorAvatar;
    private String authorUsername;
}
