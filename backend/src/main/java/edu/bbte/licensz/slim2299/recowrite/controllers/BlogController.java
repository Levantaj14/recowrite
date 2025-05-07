package edu.bbte.licensz.slim2299.recowrite.controllers;

import edu.bbte.licensz.slim2299.recowrite.config.JwtUtil;
import edu.bbte.licensz.slim2299.recowrite.controllers.dto.incoming.BlogDtoIn;
import edu.bbte.licensz.slim2299.recowrite.controllers.dto.outgoing.BlogDtoOut;
import edu.bbte.licensz.slim2299.recowrite.controllers.dto.outgoing.IdDtoOut;
import edu.bbte.licensz.slim2299.recowrite.services.BlogServiceInterface;
import edu.bbte.licensz.slim2299.recowrite.services.RecommendationServiceInterface;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController()
@RequestMapping("/blogs")
public class BlogController {
    private final BlogServiceInterface blogService;
    private final RecommendationServiceInterface recommendationService;
    private final AuthCookieFinder authCookieFinder;
    private final JwtUtil jwtUtil;

    @Autowired
    public BlogController(BlogServiceInterface blogService, RecommendationServiceInterface recommendationService, AuthCookieFinder authCookieFinder, JwtUtil jwtUtil) {
        this.blogService = blogService;
        this.recommendationService = recommendationService;
        this.authCookieFinder = authCookieFinder;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping()
    public List<BlogDtoOut> getBlogs() {
        return blogService.getAllBlogs();
    }

    @GetMapping("/author")
    public List<BlogDtoOut> getBlogsByAuthor(@RequestParam("id") long authorId) {
        return blogService.getBlogsByAuthor(authorId);
    }

    @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE + ";charset=UTF-8")
    public BlogDtoOut getBlogById(@PathVariable("id") long id) {
        return blogService.getBlogById(id);
    }

    @PostMapping()
    public IdDtoOut addBlog(HttpServletRequest request, @RequestBody @Valid BlogDtoIn blog) throws IOException {
        Cookie authCookie = authCookieFinder.serachAuthCookie(request.getCookies());
        long blogId = blogService.addBlog(blog, jwtUtil.extractUsername(authCookie.getValue()));
        recommendationService.addRecommendation(blogId);
        return new IdDtoOut(blogId);
    }

    @GetMapping("/recommendation")
    public List<BlogDtoOut> getRecommendation(@RequestParam("id") String blogId) {
        return recommendationService.getRecommendations(blogId);
    }
}