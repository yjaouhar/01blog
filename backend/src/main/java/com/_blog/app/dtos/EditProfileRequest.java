package com._blog.app.dtos;

import java.util.UUID;

import jakarta.validation.constraints.NotNull;

public record EditProfileRequest(
        @NotNull(message="profile id is required") UUID profileId,
        String firstName,//
        String lastName,//
        String age,//
        String gender,//
        String bio,//
        String username,
        String email

) {

}
