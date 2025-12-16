package com._blog.app.entities;

import java.time.LocalDateTime;

import org.hibernate.annotations.UuidGenerator;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@NoArgsConstructor
@Setter
@Getter
public class RefreshToken {

    @Id
    @GeneratedValue(generator = "UUID")
    @UuidGenerator
    private String token;

    @ManyToOne
    private UserAccount user;

    private LocalDateTime expiryDate;
}
