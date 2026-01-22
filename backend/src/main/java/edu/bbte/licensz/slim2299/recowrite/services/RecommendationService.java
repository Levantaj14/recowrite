package edu.bbte.licensz.slim2299.recowrite.services;

import edu.bbte.licensz.slim2299.recowrite.controllers.dto.outgoing.BlogDtoOut;
import edu.bbte.licensz.slim2299.recowrite.dao.exceptions.BlogNotAvailableException;
import edu.bbte.licensz.slim2299.recowrite.dao.exceptions.BlogNotFoundException;
import edu.bbte.licensz.slim2299.recowrite.dao.managers.BlogManager;
import edu.bbte.licensz.slim2299.recowrite.dao.models.BlogModel;
import edu.bbte.licensz.slim2299.recowrite.services.dto.RecommendationDataDtoIn;
import edu.bbte.licensz.slim2299.recowrite.services.exceptions.RecommendationServiceException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.Instant;
import java.util.List;

@Service
@Slf4j
public class RecommendationService implements RecommendationServiceInterface {
    private final BlogServiceInterface blogService;
    private final BlogManager blogManager;
    private final WebClient webClient;

    @Autowired
    public RecommendationService(BlogServiceInterface blogService, BlogManager blogManager) {
        this.blogService = blogService;
        this.blogManager = blogManager;
        this.webClient = WebClient.create("http://" + System.getenv("RECOMMEND") + ":8000");
    }

    @Override
    public List<BlogDtoOut> getRecommendations(String blogId) {
        BlogModel blogModel = findVisibleBlog(blogId);
        checkBlogAvailability(blogModel);

        RecommendationDataDtoIn recommendationData = fetchRecommendations(blogId);

        return mapToBlogDto(recommendationData);
    }


    @Override
    public void addRecommendation(long blogId) {
        try {
            ResponseEntity<?> response = webClient.post()
                    .uri(uriBuilder -> uriBuilder
                            .path("/add")
                            .queryParam("id", blogId)
                            .build()
                    ).retrieve().toEntity(Void.class).block();
            if (response != null) {
                if (response.getStatusCode() == HttpStatus.OK) {
                    log.info("Successfully added the blog with id {} to the recommendation system", blogId);
                } else {
                    log.error("Couldn't add the blog with id {} to the recommendation system. Status code: {}", blogId, response.getStatusCode());
                }
            } else {
                log.error("We didn't hear back from the recommendation system");
                throw new RecommendationServiceException("Error connection to recommendation system");
            }
        } catch (HttpServerErrorException.InternalServerError e) {
            log.error("Something happened in the recommendation system");
        }
    }

    @Override
    public void removeRecommendation(long blogId) {
        try {
            ResponseEntity<?> response = webClient.delete()
                    .uri(uriBuilder -> uriBuilder
                            .path("/remove")
                            .queryParam("id", blogId)
                            .build()
                    ).retrieve().toEntity(Void.class).block();
            if (response != null) {
                if (response.getStatusCode() == HttpStatus.OK) {
                    log.info("Successfully removed the blog with id {} from the recommendation system", blogId);
                } else {
                    log.error("Couldn't remove the blog with id {} from the recommendation system. Status code: {}", blogId, response.getStatusCode());
                }
            } else {
                log.error("We didn't hear back from the recommendation system");
                throw new RecommendationServiceException("Error connection to recommendation system");
            }
        } catch (HttpServerErrorException.InternalServerError e) {
            log.error("Something happened in the recommendation system");
        }
    }

    private BlogModel findVisibleBlog(String blogId) {
        return blogManager.findByIdAndVisible(Long.parseLong(blogId), true)
                .orElseThrow(() -> new BlogNotFoundException("Blog not found"));
    }

    private void checkBlogAvailability(BlogModel blogModel) {
        Instant now = Instant.now();
        Instant blogDate = blogModel.getDate().toInstant();
        if (blogDate.isAfter(now)) {
            throw new BlogNotAvailableException("Blog not available");
        }
    }

    private RecommendationDataDtoIn fetchRecommendations(String blogId) {
        try {
            ResponseEntity<RecommendationDataDtoIn> response = webClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/recommend")
                            .queryParam("id", blogId)
                            .queryParam("k", 3)
                            .build()
                    )
                    .retrieve()
                    .toEntity(RecommendationDataDtoIn.class)
                    .block();

            if (response == null) {
                log.error("No response from recommendation system");
                throw new RecommendationServiceException("Error connecting to recommendation system");
            }

            RecommendationDataDtoIn body = response.getBody();
            if (body == null) {
                log.error("Status code: {}", response.getStatusCode());
                throw new RecommendationServiceException("Error getting recommendations");
            }

            log.info("Recommendation got successfully. Status code: {}", response.getStatusCode());
            return body;

        } catch (HttpServerErrorException.InternalServerError e) {
            log.error("Exception in recommendation system", e);
            throw new RecommendationServiceException("Error getting recommendations");
        }
    }

    private List<BlogDtoOut> mapToBlogDto(RecommendationDataDtoIn recommendationData) {
        return recommendationData.getData().stream()
                .map(blogService::getBlogById)
                .toList();
    }
}
