package edu.bbte.licensz.slim2299.recowrite.controllers.dto.outgoing;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Getter
@Setter
public class LikedBlogsDtoOut {
    private long id;
    private String author;
    private String title;
}
