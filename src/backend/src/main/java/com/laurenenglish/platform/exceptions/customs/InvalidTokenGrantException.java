package com.laurenenglish.platform.exceptions.customs;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.FORBIDDEN)
public class InvalidTokenGrantException extends RuntimeException {
    public InvalidTokenGrantException(String message) {
        super(message);
    }
}