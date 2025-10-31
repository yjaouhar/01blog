package com._blog.app.entities;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
// @NoArgsConstructor
public class UserAccount {

    private UUID id;
    private String firstName;
    private String lasttName;
    private short age;
    private String gender;
    private String username;
    private String email;
    private String password;

}
