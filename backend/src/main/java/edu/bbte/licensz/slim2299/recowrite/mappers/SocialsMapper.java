package edu.bbte.licensz.slim2299.recowrite.mappers;

import edu.bbte.licensz.slim2299.recowrite.controllers.dto.outgoing.SocialMediaDtoOut;
import edu.bbte.licensz.slim2299.recowrite.dao.models.SocialsModel;
import edu.bbte.licensz.slim2299.recowrite.services.SocialsTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class SocialsMapper {
    private final SocialsTypeService socialsTypeService;

    @Autowired
    public SocialsMapper(SocialsTypeService socialsTypeService) {
        this.socialsTypeService = socialsTypeService;
    }

    public SocialMediaDtoOut modelToDto(SocialsModel model) {
        SocialMediaDtoOut dto = new SocialMediaDtoOut();
        dto.setName(socialsTypeService.getSocialsType(model.getSocialsType().getId()).getName());
        dto.setUrl(model.getLink());
        return dto;
    }
}
