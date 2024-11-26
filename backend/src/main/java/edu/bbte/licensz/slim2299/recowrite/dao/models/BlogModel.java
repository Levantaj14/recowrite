package edu.bbte.licensz.slim2299.recowrite.dao.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("blogs")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class BlogModel {
    private ObjectId _id;
    private String title;
    private String content;
    private String author;
    private String date;
}
