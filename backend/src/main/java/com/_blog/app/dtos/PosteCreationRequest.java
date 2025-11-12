package com._blog.app.dtos;


import jakarta.validation.constraints.NotNull;

public record PosteCreationRequest(
        String title,
        @NotNull(message = "Description is required") String description

     ) {

}

