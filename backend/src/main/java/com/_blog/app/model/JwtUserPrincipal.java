package com._blog.app.model;

import java.util.UUID;


public class JwtUserPrincipal {
    private final  String username;
    private final String role;
    private final UUID id;

    public JwtUserPrincipal(String username, String role, UUID id) {
        this.username = username;
        this.role = role;
        this.id = id;
    }

    public UUID getId() {
        return this.id;
    }
    public String getUsername() {
        return this.username;
    }

    public String getRole() {
        return this.role;
    }
}
