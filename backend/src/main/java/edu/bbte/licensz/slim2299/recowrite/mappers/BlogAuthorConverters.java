package edu.bbte.licensz.slim2299.recowrite.mappers;

import edu.bbte.licensz.slim2299.recowrite.dao.models.UserModel;
import org.modelmapper.Converter;
import org.modelmapper.spi.MappingContext;

public class BlogAuthorConverters implements Converter<UserModel, Long> {
    @Override
    public Long convert(MappingContext<UserModel, Long> context) {
        UserModel user = context.getSource();
        return user.getId();
    }
}
