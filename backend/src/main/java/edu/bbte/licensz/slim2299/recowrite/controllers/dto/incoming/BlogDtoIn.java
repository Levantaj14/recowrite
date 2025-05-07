package edu.bbte.licensz.slim2299.recowrite.controllers.dto.incoming;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@AllArgsConstructor
@Getter
@Setter
public class BlogDtoIn {
    @NotNull
    @Size(min = 1, max = 255)
    private String title;

    @NotNull
    @Size(max = 255)
    private String description;

    @NotNull
    @NotEmpty
    private String content;

    @NotNull
    private String date;

    @NotNull
    @NotEmpty
    private String banner;

    @NotNull
    @NotEmpty
    private String banner_type;

    private String banner_name;
}
