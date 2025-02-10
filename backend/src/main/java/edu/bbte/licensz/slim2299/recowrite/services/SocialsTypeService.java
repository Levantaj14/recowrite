package edu.bbte.licensz.slim2299.recowrite.services;

import edu.bbte.licensz.slim2299.recowrite.dao.exceptions.SocialMediaNotSupported;
import edu.bbte.licensz.slim2299.recowrite.dao.managers.SocialsTypeManager;
import edu.bbte.licensz.slim2299.recowrite.dao.models.SocialsTypesModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class SocialsTypeService implements SocialsTypeInterface{

    @Autowired
    private SocialsTypeManager socialsTypeManager;

    @Override
    public SocialsTypesModel getSocialsType(Long id) {
        Optional<SocialsTypesModel> socialsTypes = socialsTypeManager.findById(id);
        if (socialsTypes.isPresent()) {
            return socialsTypes.get();
        }
        throw new SocialMediaNotSupported("Socials type not found");
    }
}
