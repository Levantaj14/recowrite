package edu.bbte.licensz.slim2299.recowrite.services;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import edu.bbte.licensz.slim2299.recowrite.controllers.dto.outgoing.BlogDtoOut;
import edu.bbte.licensz.slim2299.recowrite.dao.exceptions.BlogNotAvailableException;
import edu.bbte.licensz.slim2299.recowrite.dao.exceptions.BlogNotFoundException;
import edu.bbte.licensz.slim2299.recowrite.dao.managers.BlogManager;
import edu.bbte.licensz.slim2299.recowrite.dao.models.BlogModel;
import edu.bbte.licensz.slim2299.recowrite.services.exceptions.RecommendationServiceNotRespondingException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.time.Instant;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
@Slf4j
public class RecommendationService implements RecommendationServiceInterface {
    private final BlogServiceInterface blogService;
    private final BlogManager blogManager;

    @Autowired
    public RecommendationService(BlogServiceInterface blogService, BlogManager blogManager) {
        this.blogService = blogService;
        this.blogManager = blogManager;
    }

    @Override
    public List<BlogDtoOut> getRecommendations(String blogId) {
        //TODO: Move these checks to the django server
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
            String apiHost = "http://" + System.getenv("RECOMMEND") + ":8000/recommend";
            ObjectMapper objectMapper = new ObjectMapper();
            URI uri = UriComponentsBuilder.fromUriString(apiHost)
                    .queryParam("id", blogId)
                    .queryParam("k", 3)
                    .build()
                    .toUri();

            URL url = uri.toURL();

            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            conn.connect();
            var sb = new StringBuilder();
            try (var ir = new InputStreamReader(conn.getInputStream());
                 var br = new BufferedReader(ir)) {
                String output = br.readLine();
                while (output != null) {
                    sb.append(output);
                    output = br.readLine();
                }
            }
            List<String> data = objectMapper.readValue(
                    objectMapper.readTree(sb.toString()).get("data").toString(),
                    new TypeReference<>() {
                    }
            );

            List<BlogDtoOut> blogs = new ArrayList<>();
            for (String s : data) {
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

    @Override
    public void addRecommendation(long blogId) {
        try {
            Map<String, Long> data = new ConcurrentHashMap<>();
            data.put("id", blogId);
            ObjectMapper objectMapper = new ObjectMapper();
            String dataToSend = objectMapper.writeValueAsString(data);

            String apiHost = "http://" + System.getenv("RECOMMEND") + ":8000/add";
            URL url = new URI(apiHost).toURL();
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("POST");
            connection.setDoOutput(true);
            connection.setRequestProperty("Content-Type", "application/json");
            try (DataOutputStream os = new DataOutputStream(connection.getOutputStream())) {
                os.writeBytes(dataToSend);
                os.flush();
            }
            int responseCode = connection.getResponseCode();
            if (responseCode != HttpURLConnection.HTTP_OK) {
                log.error("Couldn't add the blog with id {} to the recommendation system", blogId);
            }
            connection.disconnect();
        } catch (URISyntaxException | IOException e) {
            log.error("Error processing data");
        }
    }
}
