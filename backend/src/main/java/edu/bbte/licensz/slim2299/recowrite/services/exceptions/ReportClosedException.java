package edu.bbte.licensz.slim2299.recowrite.services.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.BAD_REQUEST)
public class ReportClosedException extends RuntimeException {
    public ReportClosedException(String message) {
        super(message);
    }
}
