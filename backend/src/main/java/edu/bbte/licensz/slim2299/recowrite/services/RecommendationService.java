package edu.bbte.licensz.slim2299.recowrite.services;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import edu.bbte.licensz.slim2299.recowrite.controllers.dto.outgoing.BlogDtoOut;
import edu.bbte.licensz.slim2299.recowrite.dao.exceptions.BlogNotAvailableException;
import edu.bbte.licensz.slim2299.recowrite.dao.exceptions.BlogNotFoundException;
import edu.bbte.licensz.slim2299.recowrite.dao.managers.BlogManager;
import edu.bbte.licensz.slim2299.recowrite.dao.models.BlogModel;
import edu.bbte.licensz.slim2299.recowrite.services.exceptions.RecommendationServiceNotRespondingException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URL;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class RecommendationService implements RecommendationServiceInterface {
    private static final Logger log = LoggerFactory.getLogger(RecommendationService.class);

    @Autowired
    private BlogServiceInterface blogService;

    @Autowired
    private BlogManager blogManager;

    @Override
    public List<BlogDtoOut> getRecommendations(String blogId) {
        Optional<BlogModel> blogModel = blogManager.findById(Long.valueOf(blogId));
        if (blogModel.isEmpty()) {
            throw new BlogNotFoundException("Blog not found");
        }
        Instant now = Instant.now();
        Instant blogDate = blogModel.get().getDate().toInstant();
        if (blogDate.isAfter(now)) {
            throw new BlogNotAvailableException("Blog not available");
        }
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            String apiHost = "http://localhost:8000/recommendation";
            URI uri = UriComponentsBuilder.fromUriString(apiHost)
                    .queryParam("id", blogId)
                    .queryParam("k", 4)
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
            for (String s : data.subList(1, data.size())) {
                blogs.add(blogService.getBlogById(Long.parseLong(s)));
            }

            log.info("Response code: {}", conn.getResponseCode());
            log.info("Response message: {}", data);
            return blogs;
        } catch (IOException e) {
            log.error("Recommendation service not responding");
            throw new RecommendationServiceNotRespondingException("Error getting recommendations");
        }
    }
}
