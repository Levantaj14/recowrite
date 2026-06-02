package edu.bbte.licensz.slim2299.recowrite.dao.models;

import jakarta.persistence.Entity;
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
@Table(name = "banner_hosts")
public class AllowedHostsModel extends BaseEntity {
    private String hostName;
}
