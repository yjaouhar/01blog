package com._blog.app.shared;

import java.nio.file.AccessDeniedException;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageConversionException;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.multipart.support.MissingServletRequestPartException;
import org.springframework.web.servlet.NoHandlerFoundException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

@ControllerAdvice
public class GlobalExceptionResponse {

    @ExceptionHandler(NoHandlerFoundException.class)
    public ResponseEntity<GlobalResponse<?>> handelBadRequestExcepion(NoResourceFoundException ex) {
        List<GlobalResponse.ErrorItem> errors = List.of(new GlobalResponse.ErrorItem("Not Found"));
        return new ResponseEntity<>(new GlobalResponse<>(errors), HttpStatus.NOT_FOUND);

    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<GlobalResponse<?>> handelBadRequestExcepion(HttpMessageNotReadableException ex) {
        List<GlobalResponse.ErrorItem> errors = List.of(new GlobalResponse.ErrorItem("Malformed JSON"));
        return new ResponseEntity<>(new GlobalResponse<>(errors), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<GlobalResponse<?>> handelAccessDeniedException(AccessDeniedException ex) {
        List<GlobalResponse.ErrorItem> errors = List.of(new GlobalResponse.ErrorItem("Access denied"));
        return new ResponseEntity<>(new GlobalResponse<>(errors), HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(CustomResponseException.class)
    public ResponseEntity<GlobalResponse<?>> handelCustomExcepion(CustomResponseException ex) {
        List<GlobalResponse.ErrorItem> errors = List.of(new GlobalResponse.ErrorItem(ex.getMessage()));
        return new ResponseEntity<>(new GlobalResponse<>(errors), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<GlobalResponse<?>> handelValidatioExcepion(MethodArgumentNotValidException ex) {
        List<GlobalResponse.ErrorItem> errors = ex.getBindingResult().getFieldErrors().stream()
                .map(err -> new GlobalResponse.ErrorItem(err.getDefaultMessage())).toList();

        return new ResponseEntity<>(new GlobalResponse<>(errors), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(HttpMessageConversionException.class)
    public ResponseEntity<GlobalResponse<?>> handleConversionException(HttpMessageConversionException ex) {
        List<GlobalResponse.ErrorItem> errors = List.of(
                new GlobalResponse.ErrorItem("Invalid JSON format or type mismatch"));
        return new ResponseEntity<>(new GlobalResponse<>(errors), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<String> handleMaxSizeException(MaxUploadSizeExceededException ex) {
        return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE)
                .body("File size exceeds limit!");
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<GlobalResponse<?>> handelInternalServerExcepion(Exception ex) {
        List<GlobalResponse.ErrorItem> errors = List.of(new GlobalResponse.ErrorItem("Something went wrong"));
        return new ResponseEntity<>(new GlobalResponse<>(errors), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<GlobalResponse<?>> handelHttpRequestMethodNotSupportedException(Exception ex) {
        List<GlobalResponse.ErrorItem> errors = List.of(new GlobalResponse.ErrorItem("Methode not Allow"));
        return new ResponseEntity<>(new GlobalResponse<>(errors), HttpStatus.METHOD_NOT_ALLOWED);
    }

    @ExceptionHandler(HttpMediaTypeNotSupportedException.class)
    public ResponseEntity<GlobalResponse<?>> handleUnsupportedMediaType(HttpMediaTypeNotSupportedException ex) {
        List<GlobalResponse.ErrorItem> errors = List.of(new GlobalResponse.ErrorItem(
                "Content-Type not supported. Use application/json or multipart/form-data"));
        return new ResponseEntity<>(new GlobalResponse<>(errors), HttpStatus.UNSUPPORTED_MEDIA_TYPE);
    }

    @ExceptionHandler(MissingServletRequestPartException.class)
    public ResponseEntity<GlobalResponse<?>> handelMissingServletRequestPartException(Exception ex) {
        List<GlobalResponse.ErrorItem> errors = List.of(new GlobalResponse.ErrorItem("Missing data part in request"));
        return new ResponseEntity<>(new GlobalResponse<>(errors), HttpStatus.BAD_REQUEST);
    }
}
