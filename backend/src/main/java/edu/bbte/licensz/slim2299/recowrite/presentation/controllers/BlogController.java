package edu.bbte.licensz.slim2299.recowrite.presentation.controllers;

import edu.bbte.licensz.slim2299.recowrite.business.BlogService;
import edu.bbte.licensz.slim2299.recowrite.dao.models.BlogModel;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.net.*;
import java.util.List;
import java.util.Optional;

@RestController
public class BlogController {
    private static final Logger log = LoggerFactory.getLogger(BlogController.class);
    private final BlogService blogService;

    @Autowired
    public BlogController(BlogService blogService) {
        this.blogService = blogService;
    }

    @GetMapping("/blogs")
    public List<BlogModel> getBlogs() {
        return blogService.getAllBlogs();
    }

    @RequestMapping(value="/blogsById", method = RequestMethod.GET)
    public Optional<BlogModel> getBlogsByPage(@RequestParam(value="id", defaultValue="null") String blogId) {
        return blogService.getBlogById(blogId);
    }

    @PostMapping("/addBlog")
    public void addBlog(@RequestBody BlogModel blog) {
        blogService.addBlog(blog);
    }

    @PostMapping("/getRecommendation")
    public int getRecommendation(@RequestBody String file) {
        if (file == null) {
            return -1;
        }
        try {
            URL url = new URI("http://localhost:8000/blogs/").toURL();

            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            conn.connect();
            log.info("Response code: {}", conn.getResponseCode());
        } catch (IOException | URISyntaxException e) {
            throw new RuntimeException(e);
        }
        return 3;
    }
}