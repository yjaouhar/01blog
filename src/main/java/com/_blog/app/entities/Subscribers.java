package com._blog.app.entities;

import java.util.UUID;

import org.hibernate.annotations.UuidGenerator;

import jakarta.annotation.Generated;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "subscribers")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Subscribers {
    @Id
    @GeneratedValue(generator = "UUID")
    @UuidGenerator
    private UUID id;

    @ManyToOne(fetch=FetchType.LAZY , optional=false)
    @JoinColumn(name="user")
    private UserAccount user;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "target")
    private UserAccount target;
}
