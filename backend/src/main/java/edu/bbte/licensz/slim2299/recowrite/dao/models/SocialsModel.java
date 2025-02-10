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
@Table(name = "socials")
public class SocialsModel extends BaseEntity {
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private UserModel user;

    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private SocialsTypesModel socialsType;

    private String link;
}
