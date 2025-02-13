package edu.bbte.licensz.slim2299.recowrite.dao.models;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "likes")
public class LikeModel extends BaseEntity{
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private UserModel user;

    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private BlogModel blog;
}
