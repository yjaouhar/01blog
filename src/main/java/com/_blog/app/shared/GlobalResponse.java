package com._blog.app.shared;

import java.util.List;

import lombok.Getter;

@Getter
public class GlobalResponse<T> {
    public final static String SUCCESS = "success";
    public final static String ERROR = "error";

    private final String status;
    private final T  data;
    private final List<ErrorItem> errors;
    

    public record  ErrorItem(String message){}

    public GlobalResponse(List<ErrorItem> error) {
        this.status = ERROR;
        this.data = null;
        this.errors = error;
    }
    public GlobalResponse(T data) {
        this.status = SUCCESS;
        this.data = data;
        this.errors = null;
    }
}
