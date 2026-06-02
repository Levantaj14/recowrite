package edu.bbte.licensz.slim2299.recowrite.controllers.dto.outgoing;

import lombok.*;

@Data
@Builder
public class AddBlogDtoOut {
    private Long id;
    private boolean review;
}
