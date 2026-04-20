package com.laurenenglish.platform.services.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.laurenenglish.platform.models.entities.User;
import com.laurenenglish.platform.services.JwtService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Base64;
import java.util.Date;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtServiceImpl implements JwtService {

    private final SecretKey key;
    private final String serverIss;
    private final int authTokenExpiryMinutes;
    private final int refreshTokenExpiryMinutes;

    public JwtServiceImpl(
            @Value("${application.security.jwt.secret-key}") String secretKey,
            @Value("${application.security.jwt.issuer}") String serverIss,
            @Value("${application.security.jwt.expiration-minute-access-token}") int authTokenExpiryMinutes,
            @Value("${application.security.jwt.expiration-minute-refresh-token}") int refreshTokenExpiryMinutes
    ) {
        this.key = Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
        this.serverIss = serverIss;
        this.authTokenExpiryMinutes = authTokenExpiryMinutes;
        this.refreshTokenExpiryMinutes = refreshTokenExpiryMinutes;
    }

    @Override
    public String generateAuthenticationToken(User user) {
        return buildToken(user, authTokenExpiryMinutes, "access");
    }

    @Override
    public String generateRefreshToken(User user) {
        return buildToken(user, refreshTokenExpiryMinutes, "refresh");
    }

    private String buildToken(User user, int expirationMinutes, String type) {
        Instant now = Instant.now();
        Instant expiry = now.plus(expirationMinutes, ChronoUnit.MINUTES);

        return Jwts.builder()
                .header().add("typ", type)
                .and()
                .claim("role", user.getRole().toString())
                .issuer(serverIss)
                .subject(user.getId().toString())
                .issuedAt(Date.from(now))
                .expiration(Date.from(expiry))
                .signWith(key, Jwts.SIG.HS256)
                .compact();
    }

    public String extractUserId(String token, String expectedType) {
        String actualType = (String) extractHeader(token).get("typ");

        if (!expectedType.equals(actualType)) {
            throw new MalformedJwtException("Invalid token type. Expected: " + expectedType);
        }

        return extractClaim(token, Claims::getSubject);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public Map<String, Object> extractHeader(String token) {
        try {
            String[] parts = token.split("\\.");

            if (parts.length < 2) {
                throw new MalformedJwtException("JWT does not contain a valid header section.");
            }

            String tokenHeader = parts[0];
            String headerDecoded = new String(Base64.getUrlDecoder().decode(tokenHeader));

            ObjectMapper mapper = new ObjectMapper();
            return mapper.readValue(headerDecoded, Map.class);

        } catch (IllegalArgumentException | JsonProcessingException e) {
            throw new MalformedJwtException("JWT header is corrupted or improperly formatted.", e);
        }
    }
}