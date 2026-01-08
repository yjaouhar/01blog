package com._blog.app.entities;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.hibernate.annotations.UuidGenerator;

import com._blog.app.shared.GlobalDataResponse;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "postes")
@Getter
@Setter
@NoArgsConstructor
public class Postes {

    @Id
    @GeneratedValue(generator = "UUID")
    @UuidGenerator
    private UUID id;
    @Column(length = 500)
    private String description;

    @ElementCollection
    @Column(name = "media")
    private List<GlobalDataResponse.Media> media;

    @Column(name = "create_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    private boolean hide = false;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private UserAccount user;
    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Liks> likes = new ArrayList<>();
    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Comment> comment = new ArrayList<>();
    @OneToMany(mappedBy = "reportedPost", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Report> report = new ArrayList<>();

    public Postes(String description, List<GlobalDataResponse.Media> media, UserAccount user) {
        this.description = description;
        this.media = media;
        this.user = user;
    }

}
