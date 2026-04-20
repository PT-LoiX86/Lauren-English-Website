package com.laurenenglish.platform.models.dtos;

public record AuthResponse(
        String accessToken,
        String refreshToken,
        String userId,
        String email,
        String name,
        String avatarUrl,
        String role
) {}