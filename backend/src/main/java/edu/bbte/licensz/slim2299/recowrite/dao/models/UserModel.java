package edu.bbte.licensz.slim2299.recowrite.dao.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "users")
public class UserModel extends BaseEntity {
    @Column(unique = true, nullable = false)
    private String username;
    private String name;
    private String avatar;
    private String bio;
    private String email;
    private String password;
    private String salt;
    private String role = "USER";
    private String language = "en";

    @OneToMany(mappedBy = "user", fetch = FetchType.EAGER, cascade = {
            CascadeType.MERGE, CascadeType.REFRESH, CascadeType.DETACH, CascadeType.REMOVE})
    private List<BlogModel> blogs;

    @OneToMany(mappedBy = "user", fetch = FetchType.EAGER, cascade = {
            CascadeType.MERGE, CascadeType.REFRESH, CascadeType.DETACH, CascadeType.REMOVE})
    private List<SocialsModel> socials;

    @OneToMany(mappedBy = "user", fetch = FetchType.EAGER, cascade = {
            CascadeType.MERGE, CascadeType.REFRESH, CascadeType.DETACH, CascadeType.REMOVE})
    private List<LikeModel> likes;
}
