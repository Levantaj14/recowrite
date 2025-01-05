package edu.bbte.licensz.slim2299.recowrite.dao.managers.blogs;

import edu.bbte.licensz.slim2299.recowrite.dao.models.BlogModel;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BlogManager implements BlogManagerInterface {

    private final BlogRepository blogRepository;

    @Autowired
    public BlogManager(BlogRepository blogRepository) {
        this.blogRepository = blogRepository;
    }

    @Override
    public List<BlogModel> getAllBlogs() {
        return blogRepository.findAll();
    }

    @Override
    public Optional<List<BlogModel>> getBlogsByAuthor(String authorId) {
        return blogRepository.findAllByAuthor(new ObjectId(authorId));
    }

    @Override
    public Optional<BlogModel> getBlogById(String id) {
        return blogRepository.findById(id);
    }

    @Override
    public String addBlog(BlogModel blog) {
        BlogModel blogModel = blogRepository.save(blog);
        return blogModel.get_id().toString();
    }
}
