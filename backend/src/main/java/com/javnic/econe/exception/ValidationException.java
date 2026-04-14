package com.javnic.econe.exception;

public class ValidationException extends CustomException {
    public ValidationException(String message) {
        super(message, "VALIDATION_ERROR");
    }
}
