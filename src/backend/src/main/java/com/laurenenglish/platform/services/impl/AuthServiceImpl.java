package com.laurenenglish.platform.services.impl;

import com.laurenenglish.platform.exceptions.customs.InvalidTokenGrantException;
import com.laurenenglish.platform.exceptions.customs.ResourceNotFoundException;
import com.laurenenglish.platform.models.dtos.AuthResponse;
import com.laurenenglish.platform.models.dtos.AuthRequest;
import com.laurenenglish.platform.models.dtos.RefreshTokenResponse;
import com.laurenenglish.platform.models.entities.User;
import com.laurenenglish.platform.models.enums.AuthProvider;
import com.laurenenglish.platform.repositories.UserRepository;
import com.laurenenglish.platform.security.strategy.AuthStrategy;
import com.laurenenglish.platform.services.AuthService;
import com.laurenenglish.platform.services.JwtService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.data.redis.core.StringRedisTemplate;

import javax.swing.plaf.synth.SynthTextAreaUI;
import java.util.concurrent.TimeUnit;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class AuthServiceImpl implements AuthService {

    private final Map<AuthProvider, AuthStrategy> strategies;
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final StringRedisTemplate redisTemplate;
    private final int refreshTokenExpiryMinutes;

    public AuthServiceImpl(List<AuthStrategy> strategyList, JwtService jwtService,
                           UserRepository userRepository, StringRedisTemplate redisTemplate,
                           @Value("${application.security.jwt.expiration-minute-refresh-token}") int refreshTokenExpiryMinutes) {
        this.strategies = strategyList.stream()
                .collect(Collectors.toMap(AuthStrategy::getProviderName, Function.identity()));
        this.jwtService = jwtService;
        this.userRepository = userRepository;
        this.redisTemplate = redisTemplate;
        this.refreshTokenExpiryMinutes = refreshTokenExpiryMinutes;
    }

    public AuthResponse executeLogin(AuthProvider provider, AuthRequest request) {
        AuthStrategy strategy = strategies.get(provider);

        if (strategy == null) {
            throw new IllegalArgumentException("Authentication provider '" + provider + "' is not supported.");
        }

        return strategy.authenticate(request);
    }

    @Transactional
    public RefreshTokenResponse refreshTokens(String incomingRefreshToken) {
        try {
            String userIdString = jwtService.extractUserId(incomingRefreshToken, "refresh");

            // Redis Storage Validation (Whitelist Check)
            String redisKey = "rt:" + incomingRefreshToken;
            String storedUserId = redisTemplate.opsForValue().get(redisKey);

            if (storedUserId == null) {
                throw new InvalidTokenGrantException("The refresh token is invalid, expired, or has been revoked.");
            }

            User user = userRepository.findById(UUID.fromString(userIdString))
                    .orElseThrow(() -> new ResourceNotFoundException("User not found."));

            String newAccessToken = jwtService.generateAuthenticationToken(user);
            String newRefreshToken = jwtService.generateRefreshToken(user);

            redisTemplate.delete(redisKey); // Invalidate the old token in redis

            redisTemplate.opsForValue().set(
                    "rt:" + newRefreshToken,
                    user.getId().toString(),
                    refreshTokenExpiryMinutes,
                    TimeUnit.MINUTES
            );

            return new RefreshTokenResponse(newAccessToken, newRefreshToken);

        } catch (Exception e) {
            throw new InvalidTokenGrantException("The refresh token is invalid, expired, or has been revoked.");
        }
    }

    public void logout(String refreshToken) {
        if (refreshToken != null) {
            redisTemplate.delete("rt:" + refreshToken);
        }
    }
}