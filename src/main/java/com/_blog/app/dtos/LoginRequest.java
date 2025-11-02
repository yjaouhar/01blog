package com._blog.app.dtos;

import jakarta.validation.constraints.NotNull;

public record LoginRequest(
     
        @NotNull(message = "Email or Username is required")
        String email,
       
        @NotNull(message = "Password is required")
        String password
        ) {

}
