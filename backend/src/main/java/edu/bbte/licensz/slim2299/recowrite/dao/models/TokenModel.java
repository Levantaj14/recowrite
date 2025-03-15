package edu.bbte.licensz.slim2299.recowrite.dao.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "tokens")
public class TokenModel extends BaseEntity {
    private String token;

    private LocalDateTime expiryDate;

    @Column(nullable = false)
    private String type;

    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private UserModel user;
}
