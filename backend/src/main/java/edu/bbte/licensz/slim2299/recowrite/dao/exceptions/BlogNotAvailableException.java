package edu.bbte.licensz.slim2299.recowrite.dao.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.FORBIDDEN)
public class BlogNotAvailableException extends RuntimeException {
    public BlogNotAvailableException(String message) {
        super(message);
    }
}
