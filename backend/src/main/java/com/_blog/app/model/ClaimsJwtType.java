package com._blog.app.model;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class ClaimsJwtType {

    private String username;
    private String role;
    private String id;

    public ClaimsJwtType(String username, String role, String id) {
        this.username = username;
        this.role = role;
        this.id = id;
    }

}
