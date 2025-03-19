package edu.bbte.licensz.slim2299.recowrite.controllers.dto.incoming;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@AllArgsConstructor
@Getter
@Setter
public class BlogDtoIn {
    private String title;
    private String description;
    private String content;
    private String date;
    private String banner;
}
