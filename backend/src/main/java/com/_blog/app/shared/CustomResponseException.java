package com._blog.app.shared;

import java.io.IOException;
import java.util.List;

import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class CustomResponseException extends RuntimeException {

    private final int code;
    private final String message;

    public static CustomResponseException CustomException(int code, String message) {
        System.out.println("RRRRRRRRRRRRRRRRRRR  : " + code);
        return new CustomResponseException(code, message);
    }

    public static void returnError(HttpServletResponse response, String message, int code) throws IOException {
        response.setStatus(code);
        response.setContentType("application/json");
        response.getWriter().write(new ObjectMapper().writeValueAsString(new GlobalResponse<>(List.of(new GlobalResponse.ErrorItem(message)))));
    }
}
