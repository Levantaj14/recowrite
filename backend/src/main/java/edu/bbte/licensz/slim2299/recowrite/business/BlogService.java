package edu.bbte.licensz.slim2299.recowrite.business;

import edu.bbte.licensz.slim2299.recowrite.dao.models.BlogModel;
import edu.bbte.licensz.slim2299.recowrite.dao.repositories.BlogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BlogService {
    private final BlogRepository blogRepository;

    @Autowired
    public BlogService(BlogRepository blogRepository) {
        this.blogRepository = blogRepository;
    }

    public List<BlogModel> getAllBlogs() {
        return blogRepository.findAll();
    }

    public Optional<BlogModel> getBlogById(String id) {
        return blogRepository.findById(id);
    }

    public void addBlog(BlogModel blog) {
        blogRepository.save(blog);
    }
}
