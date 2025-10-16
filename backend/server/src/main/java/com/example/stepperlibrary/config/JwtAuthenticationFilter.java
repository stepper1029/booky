package com.example.stepperlibrary.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

  @Value("${jwt.secret}")
  private String jwtSecret;

  @Override
  protected void doFilterInternal(
          HttpServletRequest request,
          HttpServletResponse response,
          FilterChain filterChain
  ) throws ServletException, IOException {

    // Read the Authorization header
    String authHeader = request.getHeader("Authorization");
    System.out.println("Authorization header: " + authHeader);

    if (authHeader != null && authHeader.startsWith("Bearer ")) {
      String token = authHeader.substring(7); // Remove "Bearer " prefix

      try {
        // Parse and validate JWT
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(Keys.hmacShaKeyFor(jwtSecret.getBytes()))
                .build()
                .parseClaimsJws(token)
                .getBody();

        String username = claims.getSubject();
        System.out.println("JWT parsed successfully, username: " + username);

        // Set authentication in Spring Security context
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(username, null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

      } catch (JwtException e) {
        System.err.println("Invalid JWT: " + e.getMessage());
        response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid JWT");
        return; // stop filter chain
      }
    } else {
      System.out.println("No Bearer token found in request");
    }

    // Continue filter chain
    filterChain.doFilter(request, response);
  }
}
