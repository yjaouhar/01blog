package com._blog.app.shared;

import lombok.AllArgsConstructor;
import lombok.Getter;


@AllArgsConstructor
@Getter
public class CustomResponseException extends  RuntimeException{
    private final int code;
    private final String message;

    public static CustomResponseException CustomException(String message) {
        return new CustomResponseException(404, message);
    }


}
