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
    @Column(unique = true, nullable = false)
    private String email;
    private String password;
    private String salt;
    private String role = "USER";
    private String language = "en";
    private boolean emails = true;
    private boolean valid;

    @OneToMany(mappedBy = "user", fetch = FetchType.EAGER, cascade = {
            CascadeType.MERGE, CascadeType.REFRESH, CascadeType.DETACH, CascadeType.REMOVE})
    private List<BlogModel> blogs;

    @OneToMany(mappedBy = "user", fetch = FetchType.EAGER, cascade = {
            CascadeType.MERGE, CascadeType.REFRESH, CascadeType.DETACH, CascadeType.REMOVE})
    private List<SocialsModel> socials;

    @OneToMany(mappedBy = "user", fetch = FetchType.EAGER, cascade = {
            CascadeType.MERGE, CascadeType.REFRESH, CascadeType.DETACH, CascadeType.REMOVE})
    private List<LikeModel> likes;

    @OneToMany(mappedBy = "reporter", fetch = FetchType.EAGER, cascade = {
            CascadeType.MERGE, CascadeType.REFRESH, CascadeType.DETACH})
    private List<ReportModel> reporters;

    @OneToMany(mappedBy = "reportedUser", fetch = FetchType.EAGER, cascade = {
            CascadeType.MERGE, CascadeType.REFRESH, CascadeType.DETACH, CascadeType.REMOVE})
    private List<ReportModel> reportedUsers;

    @OneToMany(mappedBy = "user", fetch = FetchType.EAGER, cascade = {
            CascadeType.MERGE, CascadeType.REFRESH, CascadeType.DETACH, CascadeType.REMOVE})
    private List<StrikeModel> strikes;

    @OneToMany(mappedBy = "admin", fetch = FetchType.EAGER, cascade = {
            CascadeType.MERGE, CascadeType.REFRESH, CascadeType.DETACH})
    private List<StrikeModel> strikeAdmins;
}
