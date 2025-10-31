package edu.bbte.licensz.slim2299.recowrite.dao.models.embeddings;

import edu.bbte.licensz.slim2299.recowrite.dao.models.*;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Embeddable;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToMany;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Embeddable
public class UserAssociations {
    @OneToMany(mappedBy = "user", fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BlogModel> blogs;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY,
            cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SocialsModel> socials;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<LikeModel> likes;

    @OneToMany(mappedBy = "reporter", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    private List<ReportModel> reporters;

    @OneToMany(mappedBy = "reportedUser", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    private List<ReportModel> reportedUsers;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<StrikeModel> strikes;

    @OneToMany(mappedBy = "reviewer", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    private List<ReportModel> strikeAdmins;
}