package edu.bbte.licensz.slim2299.recowrite.mappers;

import edu.bbte.licensz.slim2299.recowrite.controllers.dto.outgoing.SocialMediaDtoOut;
import edu.bbte.licensz.slim2299.recowrite.dao.models.SocialsModel;
import org.modelmapper.Converter;
import org.modelmapper.spi.MappingContext;

public class SocialsConverter implements Converter<SocialsModel, SocialMediaDtoOut> {
    @Override
    public SocialMediaDtoOut convert(MappingContext<SocialsModel, SocialMediaDtoOut> context) {
        SocialsModel socialsModel = context.getSource();
        SocialMediaDtoOut dto = new SocialMediaDtoOut();
        dto.setName(socialsModel.getSocialsType().getName());
        dto.setUrl(socialsModel.getLink());
        return dto;
    }
}
