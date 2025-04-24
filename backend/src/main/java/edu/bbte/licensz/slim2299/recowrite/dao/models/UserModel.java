package edu.bbte.licensz.slim2299.recowrite.dao.models;

import edu.bbte.licensz.slim2299.recowrite.dao.models.embeddings.UserAssociations;
import edu.bbte.licensz.slim2299.recowrite.dao.models.embeddings.UserPreferences;
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
    private boolean valid;

    @Embedded
    private UserPreferences preferences;

    @Embedded
    private UserAssociations associations;
}
