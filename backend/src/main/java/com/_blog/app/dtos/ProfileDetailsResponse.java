package com._blog.app.dtos;

import java.util.UUID;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
// @AllArgsConstructor
@NoArgsConstructor
public class ProfileDetailsResponse {

    private UUID id;
    private String firstName;
    private String lasteName;
    private String birthday;
    private String gender;
    private String bio;
    private String userName;
    private String email;
    private String avatar;
    private boolean reported = false; //
    private String role;
    private Long postes;
    private Long followers;
    private Long following;
    private boolean personelProfile = false;
    private boolean reacted = false;

}
