package edu.bbte.licensz.slim2299.recowrite.dao.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "blogs")
public class BlogModel extends BaseEntity {
    private String title;
    @Lob
    private String content;
    private String description;
    private String banner;
    private Date date;

    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private UserModel user;

    @OneToMany(mappedBy = "blog", fetch = FetchType.EAGER, cascade = {
            CascadeType.MERGE, CascadeType.REFRESH, CascadeType.DETACH, CascadeType.REMOVE})
    private List<LikeModel> likes;

    @OneToMany(mappedBy = "blog", fetch = FetchType.EAGER, cascade = {
            CascadeType.MERGE, CascadeType.REFRESH, CascadeType.DETACH})
    private List<ReportModel> reports;
}
