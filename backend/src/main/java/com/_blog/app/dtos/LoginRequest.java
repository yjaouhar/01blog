package com._blog.app.dtos;

import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
     
        @NotBlank(message = "Email or Username is required")
        String email,
       
        @NotBlank(message = "Password is required")
        String password
        ) {

}
