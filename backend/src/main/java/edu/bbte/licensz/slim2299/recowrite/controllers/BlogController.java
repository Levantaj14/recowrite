package edu.bbte.licensz.slim2299.recowrite.controllers;

import edu.bbte.licensz.slim2299.recowrite.controllers.dto.BlogDtoOut;
import edu.bbte.licensz.slim2299.recowrite.controllers.dto.IdDtoOut;
import edu.bbte.licensz.slim2299.recowrite.dao.models.BlogModel;
import edu.bbte.licensz.slim2299.recowrite.services.BlogServiceInterface;
import edu.bbte.licensz.slim2299.recowrite.services.RecommendationServiceInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController()
@RequestMapping("/blogs")
public class BlogController {

    @Autowired
    private BlogServiceInterface blogService;

    @Autowired
    private RecommendationServiceInterface recommendationService;

    @GetMapping()
    public List<BlogDtoOut> getBlogs() {
        return blogService.getAllBlogs();
    }

    @GetMapping("/author")
    public List<BlogDtoOut> getBlogsByAuthor(@RequestParam(value = "id") long authorId) {
        return blogService.getBlogsByAuthor(authorId);
    }

    @GetMapping("/{id}")
    public BlogDtoOut getBlogsById(@PathVariable("id") long id) {
        return blogService.getBlogById(id);
    }

    @PostMapping()
    public IdDtoOut addBlog(@RequestBody BlogModel blog) {
        return new IdDtoOut(blogService.addBlog(blog));
    }

    @GetMapping("/recommendation")
    public List<BlogDtoOut> getRecommendation(@RequestParam("id") String blogId) {
        return recommendationService.getRecommendations(blogId);
    }
}