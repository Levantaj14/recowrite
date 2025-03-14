package edu.bbte.licensz.slim2299.recowrite.controllers.dto.outgoing;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class AccountCommentDtoOut {
    private long id;
    private long blogId;
    private String comment;
    private String title;
}
