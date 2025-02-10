package edu.bbte.licensz.slim2299.recowrite.dao.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "blogs")
public class BlogModel {
    @Id
    private long id;
    private String title;
    private String content;
    private String description;
    private String banner;
    private String date;

    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private UserModel user;
}
