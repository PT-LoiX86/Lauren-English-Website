package com.laurenenglish.platform.services;

import com.laurenenglish.platform.models.entities.User;
import io.jsonwebtoken.Claims;

import java.time.temporal.ChronoUnit;
import java.util.Map;
import java.util.function.Function;

public interface JwtService {
    String generateAuthenticationToken(User user);

    String generateRefreshToken(User user);

    String extractUserId(String token, String expectedType);

    <T> T extractClaim(String token, Function<Claims, T> claimsResolver);

    Map<String, Object> extractHeader(String token);
}
