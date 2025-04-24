package edu.bbte.licensz.slim2299.recowrite.dao.models.embeddings;

import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Embeddable
public class UserPreferences {
    private String language = "en";
    private boolean emails = true;
}