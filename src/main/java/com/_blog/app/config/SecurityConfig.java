package com._blog.app.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Autowired
    private JwtAuthFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain SecurityFilterChain(HttpSecurity http) throws Exception {

        http
                .cors(AbstractHttpConfigurer::disable)
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> {
                    auth.requestMatchers("/api/auth/register", "/api/auth/login").permitAll()
                            .requestMatchers(HttpMethod.GET, "/api/post").hasAnyRole("USER", "ADMIN")
                            .requestMatchers(HttpMethod.POST, "/api/post/create").hasAnyRole("USER", "ADMIN")
                            .requestMatchers(HttpMethod.DELETE, "/api/post/delete").hasAnyRole("USER", "ADMIN")
                            .requestMatchers(HttpMethod.PUT, "/api/post/update").hasAnyRole("USER", "ADMIN")
                            .requestMatchers(HttpMethod.GET, "/api/post/like/{postId}").hasAnyRole("USER", "ADMIN")
                            .requestMatchers(HttpMethod.POST, "/api/post/update/comment").hasAnyRole("USER", "ADMIN")
                            .requestMatchers(HttpMethod.PUT, "/api/post/update/comment/edit")
                            .hasAnyRole("USER", "ADMIN")
                            .requestMatchers(HttpMethod.DELETE, "/api/post/update/comment/delet/{commentId}")
                            .hasAnyRole("USER", "ADMIN")
                            .requestMatchers(HttpMethod.GET, "/api/profile")
                            .hasAnyRole("USER", "ADMIN")
                            .requestMatchers(HttpMethod.GET, "/api/profile/post")
                            .hasAnyRole("USER", "ADMIN")
                            .requestMatchers(HttpMethod.GET, "/api/profile/users")
                            .hasAnyRole("USER", "ADMIN")
                            .requestMatchers(HttpMethod.GET, "/api/profile/explore/{keyword}")
                            .hasAnyRole("USER", "ADMIN")
                            .requestMatchers(HttpMethod.PUT, "/api/profile/edit")
                            .hasAnyRole("USER", "ADMIN")
                            .requestMatchers(HttpMethod.GET, "/api/profile/subscrib/{userId}")
                            .hasAnyRole("USER", "ADMIN")
                            .requestMatchers(HttpMethod.GET, "/api/profile/followers")
                            .hasAnyRole("USER", "ADMIN")
                            .requestMatchers(HttpMethod.GET, "/api/profile/following")
                            .hasAnyRole("USER", "ADMIN")
                            .requestMatchers(HttpMethod.GET, "/api/report")
                            .hasAnyRole("USER", "ADMIN")
                            .requestMatchers(HttpMethod.POST, "/api/report/new")
                            .hasAnyRole("USER", "ADMIN")
                            .requestMatchers(HttpMethod.GET, "/api/notification").hasAnyRole("USER", "ADMIN")
                            .requestMatchers(HttpMethod.GET, "/api/admin/report").hasAnyRole("ADMIN")
                            .requestMatchers(HttpMethod.POST, "/api/admin/report_reaction").hasAnyRole("ADMIN");
                }).addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();

    }
}
