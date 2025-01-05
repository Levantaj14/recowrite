package edu.bbte.licensz.slim2299.recowrite.controllers.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class BlogDtoOut {
    private String id;
    private String title;
    private String content;
    private String description;
    private String author;
    private String banner;
    private String date;
}
