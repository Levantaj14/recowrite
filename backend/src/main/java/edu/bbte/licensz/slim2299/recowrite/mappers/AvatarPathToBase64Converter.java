package edu.bbte.licensz.slim2299.recowrite.mappers;

import org.modelmapper.Converter;
import org.modelmapper.spi.MappingContext;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;

public class AvatarPathToBase64Converter implements Converter<String, String> {
    @Override
    public String convert(MappingContext<String, String> context) {
        String avatarPath = context.getSource();
        if (avatarPath == null || avatarPath.isEmpty()) {
            return "";
        }

        try {
            Path path = Paths.get(avatarPath);
            byte[] fileBytes = Files.readAllBytes(path);
            return Base64.getEncoder().encodeToString(fileBytes);
        } catch (IOException e) {
            return "";
        }
    }
}
