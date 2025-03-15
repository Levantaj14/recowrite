package edu.bbte.licensz.slim2299.recowrite.dao.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.FORBIDDEN)
public class UserNotValidatedException extends RuntimeException {
    public UserNotValidatedException(String message) {
        super(message);
    }
}
