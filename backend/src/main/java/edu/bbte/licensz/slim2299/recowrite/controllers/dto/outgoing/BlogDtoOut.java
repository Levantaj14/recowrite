package edu.bbte.licensz.slim2299.recowrite.controllers.dto.outgoing;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class BlogDtoOut {
    private Long id;
    private String title;
    private String content;
    private String description;
    private long author;
    private String banner;
    private String banner_type;
    private String date;
}
