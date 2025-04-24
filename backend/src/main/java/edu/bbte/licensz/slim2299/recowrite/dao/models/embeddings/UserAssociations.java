package edu.bbte.licensz.slim2299.recowrite.dao.models.embeddings;

import edu.bbte.licensz.slim2299.recowrite.dao.models.*;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Embeddable
public class UserAssociations {
    @OneToMany(mappedBy = "user", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    private List<BlogModel> blogs;

    @OneToMany(mappedBy = "user", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    private List<SocialsModel> socials;

    @OneToMany(mappedBy = "user", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    private List<LikeModel> likes;

    @OneToMany(mappedBy = "reporter", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    private List<ReportModel> reporters;

    @OneToMany(mappedBy = "reportedUser", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    private List<ReportModel> reportedUsers;

    @OneToMany(mappedBy = "user", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    private List<StrikeModel> strikes;

    @OneToMany(mappedBy = "admin", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    private List<StrikeModel> strikeAdmins;
}