package com._blog.app.config;

import java.util.Date;
import java.util.Map;
import java.util.Objects;
import java.util.function.Function;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtHelper {

    @Value("${jwt.secret}")
    private String JWT_SECRET;

    public String extractUsername(String token) {
        return extraClaims(token, Claims::getSubject);
    }

    public boolean isTokenValid(String token, UserDetails userAccount) {
        final String username = extractUsername(token);
        final Date tokenExpirationDate = extraClaims(token, Claims::getExpiration);
        boolean usernameMatch = Objects.equals(username, userAccount.getUsername());
        boolean tokenExpired = tokenExpirationDate.before(new Date(System.currentTimeMillis()));
        return usernameMatch && !tokenExpired;
    }

    public String generateToken(Map<String, Object> extraClaims, String username) {
        return Jwts.builder()
                .claims(extraClaims)
                .subject(username)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24 * 14))
                .signWith(getSignInkey())
                .compact();
    }

    public <T> T extraClaims(String token, Function<Claims, T> claimsResolve) {
        final Claims claims = extractAllClaims(token);
        return claimsResolve.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts
                .parser()
                .verifyWith(getSignInkey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private SecretKey getSignInkey() {
        byte[] keyBytes = Decoders.BASE64.decode(JWT_SECRET);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
