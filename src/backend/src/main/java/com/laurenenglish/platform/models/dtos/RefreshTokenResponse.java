package com.laurenenglish.platform.models.dtos;

public record RefreshTokenResponse(
        String accessToken,
        String refreshToken
) {}
