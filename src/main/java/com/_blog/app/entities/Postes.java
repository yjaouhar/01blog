package com._blog.app.entities;

import java.util.UUID;

import org.hibernate.annotations.UuidGenerator;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "postes")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Postes {
    @Id
    @GeneratedValue(generator = "UUID")
    @UuidGenerator
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID usere_id;

    @Column(name = "desc", nullable = false)
    private String desc;

    @Column(name = "media_url", nullable = false)
    private String media_url;

    @Column(name = "media_type", nullable = false)
    private String media_type;

    @Column(name = "creat_at", nullable = false)
    private String creat_at;

    @Column(name = "update_at", nullable = false)
    private String update_at;

}
