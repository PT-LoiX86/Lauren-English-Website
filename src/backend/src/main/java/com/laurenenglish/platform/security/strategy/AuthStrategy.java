package com.laurenenglish.platform.security.strategy;

import com.laurenenglish.platform.models.dtos.AuthResponse;
import com.laurenenglish.platform.models.dtos.AuthRequest;
import com.laurenenglish.platform.models.enums.AuthProvider;

public interface AuthStrategy {
    AuthResponse authenticate(AuthRequest request);
    AuthProvider getProviderName();
}