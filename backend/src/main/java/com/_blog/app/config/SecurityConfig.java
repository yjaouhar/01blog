package com._blog.app.config;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain SecurityFilterChain(HttpSecurity http) throws Exception {

        http
                .cors(c -> {
                    CorsConfigurationSource source = corsConfigurationSource();
                    c.configurationSource(source);
                })
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> {
                    auth.requestMatchers("/api/auth/**").permitAll()
                            .requestMatchers("/uploads/**").permitAll()
                            .requestMatchers(HttpMethod.GET, "/api/post").hasAnyRole("USER", "ADMIN")
                            .requestMatchers(HttpMethod.POST, "/api/post").hasAnyRole("USER", "ADMIN")
                            .requestMatchers(HttpMethod.DELETE, "/api/post/{postId}").hasAnyRole("USER", "ADMIN")
                            .requestMatchers(HttpMethod.PATCH, "/api/post").hasAnyRole("USER", "ADMIN")
                            .requestMatchers(HttpMethod.POST, "/api/post/like/{postId}").hasAnyRole("USER", "ADMIN")
                            .requestMatchers(HttpMethod.POST, "/api/post/comment").hasAnyRole("USER", "ADMIN")
                            .requestMatchers(HttpMethod.GET, "/api/post/comment/{postId}").hasAnyRole("USER", "ADMIN")
                            .requestMatchers(HttpMethod.DELETE, "/api/post/comment/{commentId}").hasAnyRole("USER", "ADMIN")
                            .requestMatchers(HttpMethod.GET, "/api/users").hasAnyRole("USER", "ADMIN")
                            .requestMatchers(HttpMethod.GET, "/api/users/serche/{keyword}").hasAnyRole("USER", "ADMIN")
                            .requestMatchers(HttpMethod.POST, "/api/users/subscrib/{userId}").hasAnyRole("USER", "ADMIN")
                            .requestMatchers(HttpMethod.GET, "/api/profile/{username}").hasAnyRole("USER", "ADMIN")
                            .requestMatchers(HttpMethod.GET, "/api/profile/post").hasAnyRole("USER", "ADMIN")
                            .requestMatchers(HttpMethod.PUT, "/api/profile/edit").hasAnyRole("USER", "ADMIN")
                            .requestMatchers(HttpMethod.GET, "/api/profile/followers").hasAnyRole("USER", "ADMIN")
                            .requestMatchers(HttpMethod.GET, "/api/profile/following").hasAnyRole("USER", "ADMIN")
                            .requestMatchers(HttpMethod.POST, "/api/report").hasAnyRole("USER", "ADMIN")
                            .requestMatchers(HttpMethod.GET, "/api/notification").hasAnyRole("USER", "ADMIN")
                            .requestMatchers(HttpMethod.GET, "/api/admin/report").hasAnyRole("ADMIN")
                            .requestMatchers(HttpMethod.POST, "/api/admin/report_reaction").hasAnyRole("ADMIN");
                }).addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();

    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:4200"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source
                = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
