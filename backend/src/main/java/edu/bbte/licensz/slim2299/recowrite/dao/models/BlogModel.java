package edu.bbte.licensz.slim2299.recowrite.dao.models;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("blogs")
public class BlogModel {
    private ObjectId _id;
    private String title;
    private String content;
    private String author;
    private String date;

    public BlogModel() {
    }

    public BlogModel(ObjectId _id, String title, String content, String author, String date) {
        this._id = _id;
        this.title = title;
        this.content = content;
        this.author = author;
        this.date = date;
    }

    public ObjectId get_id() {
        return _id;
    }

    public void set_id(ObjectId _id) {
        this._id = _id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }
}
