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
@Table(name = "comments")
public class CommentModel extends BaseEntity {
    @Column(nullable = false)
    private String comment;

    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private UserModel user;

    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private BlogModel blog;
}
