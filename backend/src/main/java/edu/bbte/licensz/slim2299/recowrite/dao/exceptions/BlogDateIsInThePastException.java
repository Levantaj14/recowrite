package edu.bbte.licensz.slim2299.recowrite.dao.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class BlogDateIsInThePastException extends RuntimeException {
    public BlogDateIsInThePastException(String message) {
        super(message);
    }
}
