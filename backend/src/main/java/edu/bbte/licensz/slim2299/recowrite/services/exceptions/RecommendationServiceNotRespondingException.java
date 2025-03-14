package edu.bbte.licensz.slim2299.recowrite.services.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
public class RecommendationServiceNotRespondingException extends RuntimeException {
    public RecommendationServiceNotRespondingException(String message) {
        super(message);
    }
}
