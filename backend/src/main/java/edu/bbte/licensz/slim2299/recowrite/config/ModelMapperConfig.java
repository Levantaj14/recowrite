package edu.bbte.licensz.slim2299.recowrite.config;

import edu.bbte.licensz.slim2299.recowrite.controllers.dto.outgoing.*;
import edu.bbte.licensz.slim2299.recowrite.dao.models.BlogModel;
import edu.bbte.licensz.slim2299.recowrite.dao.models.CommentModel;
import edu.bbte.licensz.slim2299.recowrite.dao.models.SocialsModel;
import edu.bbte.licensz.slim2299.recowrite.dao.models.UserModel;
import edu.bbte.licensz.slim2299.recowrite.mappers.AvatarPathToBase64Converter;
import edu.bbte.licensz.slim2299.recowrite.mappers.BlogAuthorConverters;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeMap;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Instant;

@Configuration
public class ModelMapperConfig {

    @Bean
    public ModelMapper modelMapperBean() {
        ModelMapper modelMapper = new ModelMapper();
        TypeMap<UserModel, UserDtoOut> userTypeMap = modelMapper.createTypeMap(UserModel.class, UserDtoOut.class);
        userTypeMap.addMappings(mapper -> mapper.using(new AvatarPathToBase64Converter()).map(UserModel::getAvatar, UserDtoOut::setAvatar));

        TypeMap<BlogModel, BlogDtoOut> blogTypeMap = modelMapper.createTypeMap(BlogModel.class, BlogDtoOut.class);
        blogTypeMap.addMappings(mapper -> mapper.using(new BlogAuthorConverters()).map(BlogModel::getUser, BlogDtoOut::setAuthor));
        blogTypeMap.setPostConverter(context -> {
            BlogModel blogModel = context.getSource();
            BlogDtoOut blogDtoOut = context.getDestination();
            Instant now = Instant.now();
            Instant blogDate = blogModel.getDate().toInstant();

            if (blogDate.isAfter(now)) {
                blogDtoOut.setContent("");
                blogDtoOut.setDescription("");
            } else {
                blogDtoOut.setContent(blogModel.getContent());
                blogDtoOut.setDescription(blogModel.getDescription());
            }
            return blogDtoOut;
        });

        TypeMap<CommentModel, AccountCommentDtoOut> accountCommentMap = modelMapper.createTypeMap(CommentModel.class, AccountCommentDtoOut.class);
        accountCommentMap.addMappings(mapper -> {
            mapper.map(src -> src.getBlog().getTitle(), AccountCommentDtoOut::setTitle);
            mapper.map(src -> src.getBlog().getId(), AccountCommentDtoOut::setBlogId);
        });

        TypeMap<CommentModel, CommentDtoOut> commentMap = modelMapper.createTypeMap(CommentModel.class, CommentDtoOut.class);
        commentMap.addMappings(mapper -> mapper.using(new AvatarPathToBase64Converter())
                .map(src -> src.getUser().getAvatar(), CommentDtoOut::setAuthorAvatar));
        commentMap.addMappings(mapper -> {
            mapper.map(src -> src.getUser().getName(), CommentDtoOut::setAuthorName);
            mapper.map(src -> src.getUser().getId(), CommentDtoOut::setAuthorId);
            mapper.map(src -> src.getUser().getUsername(), CommentDtoOut::setAuthorUsername);
        });

        TypeMap<SocialsModel, SocialMediaDtoOut> socialsMap = modelMapper.createTypeMap(SocialsModel.class, SocialMediaDtoOut.class);
        socialsMap.addMappings(mapper -> {
           mapper.map(src -> src.getSocialsType().getName(), SocialMediaDtoOut::setName);
           mapper.map(SocialsModel::getLink, SocialMediaDtoOut::setUrl);
        });

        TypeMap<UserModel, UserDtoOut> userMap = modelMapper.createTypeMap(UserModel.class, UserDtoOut.class);
        userMap.addMappings(mapper ->
                mapper.map(src -> src.getAssociations().getSocials(), UserDtoOut::setSocials)
        );

        return modelMapper;
    }
}
