package edu.bbte.licensz.slim2299.recowrite.services;

import edu.bbte.licensz.slim2299.recowrite.controllers.dto.outgoing.BlogDtoOut;

import java.util.List;

public interface RecommendationServiceInterface {
    List<BlogDtoOut> getRecommendations(String blogId);

    void addRecommendation(long blogId);
}
