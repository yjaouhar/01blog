package com._blog.app.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record PosteCreationRequest(
        @NotBlank(message = "Description is required")
        @Size(min = 1, max = 500, message = "Description must 500 characters")
        String description
        ) {

}
