package com._blog.app.dtos;

import java.util.UUID;

import jakarta.validation.constraints.NotNull;

public record ReportsActionRequest(
        @NotNull(message = "reports id is requerd") UUID reportId,
        boolean remove,
        boolean status) {

}
