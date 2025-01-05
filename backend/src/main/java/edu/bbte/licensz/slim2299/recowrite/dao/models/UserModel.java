package edu.bbte.licensz.slim2299.recowrite.dao.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("users")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class UserModel {
    private ObjectId _id;
    private String username;
    private String name;
    private String avatar;
    private String bio;
    private Object socials;
}
