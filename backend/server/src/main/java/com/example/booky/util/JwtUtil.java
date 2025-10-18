package com.example.booky.util;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

  @Value("${jwt.secret}")
  private String jwtSecret;

  @Value("${jwt.expiration-ms:86400000}") // 1 day default
  private long jwtExpirationMs;

  public String generateToken(String username) {
    Key key = Keys.hmacShaKeyFor(jwtSecret.getBytes());
    return Jwts.builder()
            .setSubject(username)
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
            .signWith(key, SignatureAlgorithm.HS256)
            .compact();
  }
}
