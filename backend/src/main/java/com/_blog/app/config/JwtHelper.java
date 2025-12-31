package com._blog.app.config;

import java.util.Date;
import java.util.Map;
import java.util.UUID;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com._blog.app.model.JwtUserPrincipal;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtHelper {

    @Value("${jwt.secret}")
    private String JWT_SECRET;

    // public String extractUsername(String token) {
    //     return extraClaims(token, Claims::getSubject);
    // }
    public JwtUserPrincipal isTokenValid(String token) {
        Claims claims = extractAllClaims(token);
        // System.out.println("------> Claims jwt : " + claims);
        JwtUserPrincipal userClaims = new JwtUserPrincipal(claims.getSubject(), claims.get("role", String.class), UUID.fromString(claims.get("userId", String.class)));
        return userClaims;
    }

    public String generateAccessToken(Map<String, Object> extraClaims, String username) {
        return Jwts.builder()
                .claims(extraClaims)
                .subject(username)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + 1000 * 60 * 15))
                .signWith(getSignInkey())
                .compact();
    }

    public String generateRefreshToken() {
        return UUID.randomUUID().toString();
    }

    // public <T> T extraClaims(String token, Function<Claims, T> claimsResolve) {
    //     final Claims claims = extractAllClaims(token);
    //     return claimsResolve.apply(claims);
    // }
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
