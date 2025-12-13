package com._blog.app.dtos;

import org.hibernate.validator.constraints.Length;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank(message = "First Name is required")
        @Pattern(regexp = "^[A-Za-z]+( [A-Za-z]+)*$", message = "First Name must contain only letters")
        @Size(min = 4, max = 20, message = "First Name must be between 4 and 20 characters")
        String firstName,

        @NotBlank(message = "Last Name is required")
        @Pattern(regexp = "^[A-Za-z]+( [A-Za-z]+)*$", message = "Last Name must contain only letters")
        @Size(min = 4, max = 20, message = "Last Name must be between 4 and 20 characters")
        String lastName,

        @NotBlank(message = "Birthday is required")
        String birthday,

        @NotBlank(message = "Gender is required")
        @Pattern(regexp = "male|female", message = "Gender must be 'male' or 'female'")
        String gender,

        @Length(max = 200)
        String bio,

        @Size(min = 4, max = 15, message = "Nickname must be between 4 and 15 characters")
        @Pattern(regexp = "^[A-Za-z][A-Za-z0-9_]*$", message = "Nickname must start with a letter and contain only letters, numbers or underscores")
        @jakarta.annotation.Nullable
        String username,

        @NotBlank(message = "Email is required")
        @Email(message = "Email is invalid")
        @Size(max = 50, message = "Email must be less than 50 characters")
        String email,

        @NotBlank(message = "Password is required")
        @Size(min = 3, max = 20, message = "Password must be between 6 and 20 characters")
        // @Pattern(
        // regexp =
        // "^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,20}$",
        // message = "Password must contain uppercase, lowercase, number and special
        // character"
        // )

        String password) {

}
