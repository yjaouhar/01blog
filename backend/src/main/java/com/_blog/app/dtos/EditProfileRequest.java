package com._blog.app.dtos;

import java.util.UUID;

import org.hibernate.validator.constraints.Length;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record EditProfileRequest(
        @NotNull(message = "profile id is required")
        UUID profileId,
        @Email
        @Pattern(regexp = "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$", message = "Email is invalid")
        String email,
        @Size(min = 4, max = 15)
        @Pattern(regexp = "^[A-Za-z][A-Za-z0-9_]*$", message = "Nickname must start with a letter and contain only letters, numbers or underscores")
        String username,
        @Pattern(regexp = "^[A-Za-z]+( [A-Za-z]+)*$", message = "First Name must contain only letters")
        @Size(min = 2, max = 20, message = "First Name must be between 4 and 20 characters")
        String firstName,
        @Pattern(regexp = "^[A-Za-z]+( [A-Za-z]+)*$", message = "First Name must contain only letters")
        @Size(min = 2, max = 20, message = "Last Name must be between 4 and 20 characters")
        String lastName,
        String birthday,
        @Pattern(regexp = "male|female")
        String gender,
        @Length(max = 200, message = "bio must be 200 characters")
        String bio,
        Boolean removeMedia
        ) {

}
