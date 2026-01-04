package com._blog.app.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProfileDetailsResponse {

    private String firstName;
    private String lasteName;
    private String age;
    private String gender;
    private String bio;
    private String userName;
    private String email;
    private String avatar;
    private boolean active;
    private boolean reported;
    private String rol;
    private Long followers;
    private Long following;
    private boolean personelProfile = false;
    private boolean reacted = false;
}
