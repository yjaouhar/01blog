package com._blog.app.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
                @NotNull(message = "First Name is required") @Size(min = 3, max = 20, message = "First Name must be between 3 and 20 characters") String firstName,

                @NotNull(message = "Last Name is required") @Size(min = 3, max = 20, message = "Last Name must be between 3 and 20 characters") String lastName,

                @NotNull(message = "Age is required") @Min(value = 10, message = "Age must be at least 10") @Max(value = 300, message = "Age must be less than 300") Short age,

                @NotNull(message = "Gender is required") @Pattern(regexp = "male|female", message = "Gender must be 'male' or 'female'") String gender,

                String bio,
                @Pattern(regexp = "^[A-Za-z][A-Za-z0-9_]*$", message = "Nickname must start with a letter and contain only letters, numbers or underscores") @NotNull(message = "Nickname is required") @Size(min = 3, max = 15, message = "Nickname must be between 3 and 15 characters") String username,
                @NotNull(message = "Email is required") @Email(message = "Email is invalid") @Size(max = 50, message = "Email must be less than 50 characters") String email,

                @NotNull(message = "Password is required") @Size(min = 3, max = 20, message = "Password must be between 6 and 20 characters")
                // @Pattern(
                // regexp =
                // "^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,20}$",
                // message = "Password must contain uppercase, lowercase, number and special
                // character"
                // )

                String password) {

}

