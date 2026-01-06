package com._blog.app.dtos;

import java.util.UUID;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record EditProfileRequest(
        @NotNull(message = "profile id is required")
        UUID profileId,
        @Email
        @Size(max = 255)
        String email,
        @Size(min = 4, max = 15)
        @Pattern(regexp = "^[A-Za-z][A-Za-z0-9_]*$", message = "Nickname must start with a letter and contain only letters, numbers or underscores")
        String username,
        @Size(min = 2, max = 20)
        String firstName,
        @Size(min = 2, max = 20)
        String lastName,
        String birthday,
        @Pattern(regexp = "male|female")
        String gender,
        @Size(max = 200)
        String bio,
        Boolean removeMedia
        ) {

}
