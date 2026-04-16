package com.laurenenglish.platform.models.dtos;

public record AuthRequest(
        String idToken,
        String email,
        String password
) {}

