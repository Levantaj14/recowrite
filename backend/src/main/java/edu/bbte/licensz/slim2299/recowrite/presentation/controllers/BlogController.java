package edu.bbte.licensz.slim2299.recowrite.presentation.controllers;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import edu.bbte.licensz.slim2299.recowrite.business.BlogService;
import edu.bbte.licensz.slim2299.recowrite.dao.models.BlogModel;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
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
    public List<Integer> getRecommendation(@RequestBody String requestBody) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            String apiHost = "http://localhost:8000/blogs";
            String fileName = objectMapper.readTree(requestBody).get("file").toString();
            URI uri = UriComponentsBuilder.fromUriString(apiHost)
                    .queryParam("file", fileName.substring(1, fileName.length() - 1))
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
            List<Integer> data = objectMapper.readValue(
                    objectMapper.readTree(sb.toString()).get("data").toString(),
                    new TypeReference<>() {
                    }
            );

            log.info("Response code: {}", conn.getResponseCode());
            log.info("Response message: {}", data.toString());
            return data;
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}