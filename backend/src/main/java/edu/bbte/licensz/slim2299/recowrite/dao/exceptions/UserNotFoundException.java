package edu.bbte.licensz.slim2299.recowrite.dao.exceptions;

public class UserNotFoundException extends RuntimeException {
    public UserNotFoundException(String message) {
        super(message);
    }
}
