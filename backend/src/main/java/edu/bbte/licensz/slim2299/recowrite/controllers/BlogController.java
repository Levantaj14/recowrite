package edu.bbte.licensz.slim2299.recowrite.controllers;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import edu.bbte.licensz.slim2299.recowrite.business.BlogService;
import edu.bbte.licensz.slim2299.recowrite.controllers.dto.BlogDtoOut;
import edu.bbte.licensz.slim2299.recowrite.controllers.dto.BlogIdDtoOut;
import edu.bbte.licensz.slim2299.recowrite.dao.models.BlogModel;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

@RestController()
@RequestMapping("/blogs")
public class BlogController {
    private static final Logger log = LoggerFactory.getLogger(BlogController.class);
    private final BlogService blogService;

    @Autowired
    public BlogController(BlogService blogService) {
        this.blogService = blogService;
    }

    @GetMapping()
    public List<BlogDtoOut> getBlogs() {
        return blogService.getAllBlogs();
    }

    @GetMapping("/author")
    public List<BlogDtoOut> getBlogsByAuthor(@RequestParam(value = "id") String authorId) {
        return blogService.getBlogsByAuthor(authorId);
    }

    @GetMapping("/{id}")
    public BlogDtoOut getBlogsById(@PathVariable("id") String id) {
        return blogService.getBlogById(id);
    }

    @PostMapping()
    public BlogIdDtoOut addBlog(@RequestBody BlogModel blog) {
        return new BlogIdDtoOut(blogService.addBlog(blog));
    }

    @GetMapping("/recommendation")
    public List<BlogDtoOut> getRecommendation(@RequestParam("id") String blogId) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            String apiHost = "http://localhost:8000/recommendation";
            URI uri = UriComponentsBuilder.fromUriString(apiHost)
                    .queryParam("id", blogId)
                    .queryParam("k", 3)
                    .build()
                    .toUri();

            URL url = uri.toURL();

            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            conn.connect();
            var br = new BufferedReader(new InputStreamReader((conn.getInputStream())));
            var sb = new StringBuilder();
            String output;
            while ((output = br.readLine()) != null) {
                sb.append(output);
            }
            // Converting response body from JSON to Java Object with Jackson
            List<String> data = objectMapper.readValue(
                    objectMapper.readTree(sb.toString()).get("data").toString(),
                    new TypeReference<>() {}
            );

            List<BlogDtoOut> blogs = new ArrayList<>();
            for (String s : data) {
                blogs.add(blogService.getBlogById(s));
            }

            log.info("Response code: {}", conn.getResponseCode());
            log.info("Response message: {}", data);
            return blogs;
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}