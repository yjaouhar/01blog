package com._blog.app.dtos;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record PosteCreationRequest(
        @NotNull(message = "Description is required")
        @Size(min = 1, max = 500, message = "must 500")
        String description
        ) {

}
