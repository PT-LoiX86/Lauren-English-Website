package com.laurenenglish.platform.services;

import com.laurenenglish.platform.models.dtos.AuthResponse;
import com.laurenenglish.platform.models.dtos.AuthRequest;
import com.laurenenglish.platform.models.dtos.RefreshTokenResponse;
import com.laurenenglish.platform.models.enums.AuthProvider;

public interface AuthService {
    AuthResponse executeLogin(AuthProvider provider, AuthRequest request);

    RefreshTokenResponse refreshTokens(String incomingRefreshToken);

    void logout(String refreshToken);
}
