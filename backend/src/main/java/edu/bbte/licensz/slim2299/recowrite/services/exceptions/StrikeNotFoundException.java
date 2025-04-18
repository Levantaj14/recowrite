package edu.bbte.licensz.slim2299.recowrite.services.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class StrikeNotFoundException extends RuntimeException {
    public StrikeNotFoundException(String message) {
        super(message);
    }
}
