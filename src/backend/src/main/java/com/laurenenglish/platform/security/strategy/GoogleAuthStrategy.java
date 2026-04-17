package com.laurenenglish.platform.security.strategy;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.laurenenglish.platform.models.dtos.AuthResponse;
import com.laurenenglish.platform.models.dtos.AuthRequest;
import com.laurenenglish.platform.models.entities.User;
import com.laurenenglish.platform.models.enums.AuthProvider;
import com.laurenenglish.platform.models.enums.UserRole;
import com.laurenenglish.platform.repositories.UserRepository;
import com.laurenenglish.platform.services.JwtService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.concurrent.TimeUnit;

@Component
public class GoogleAuthStrategy implements AuthStrategy {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final GoogleIdTokenVerifier googleVerifier;
    private final StringRedisTemplate redisTemplate;
    private final int refreshTokenExpiryMinutes;

    public GoogleAuthStrategy(
            UserRepository userRepository,
            JwtService jwtService,
            @Value("${application.security.oauth2.google.client-id}") String googleClientId,
            StringRedisTemplate redisTemplate,
            @Value("${application.security.jwt.expiration-minute-refresh-token}") int refreshTokenExpiryMinutes
    ) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        // Initialize the Google Verifier with Client ID
        this.googleVerifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new GsonFactory())
                .setAudience(Collections.singletonList(googleClientId))
                .build();
        this.redisTemplate = redisTemplate;
        this.refreshTokenExpiryMinutes = refreshTokenExpiryMinutes;
    }

    @Override
    public AuthProvider getProviderName() {
        return AuthProvider.google;
    }

    @Override
    @Transactional
    public AuthResponse authenticate(AuthRequest request) {
        if (request.idToken() == null) {
            throw new BadCredentialsException("Google ID Token is missing.");
        }

        try {
            GoogleIdToken idToken = googleVerifier.verify(request.idToken());
            if (idToken == null) throw new BadCredentialsException("Invalid Google ID Token.");

            GoogleIdToken.Payload payload = idToken.getPayload();

            User user = userRepository.findByEmail(payload.getEmail())
                    .orElseGet(() -> {
                        User newUser = new User();
                        newUser.setEmail(payload.getEmail());
                        newUser.setName((String) payload.get("name"));
                        newUser.setAvatarUrl((String) payload.get("picture"));
                        newUser.setGoogleId(payload.getSubject());
                        newUser.setRole(UserRole.USER);
                        newUser.setActive(true);
                        return userRepository.save(newUser);
                    });

            String accessToken = jwtService.generateAuthenticationToken(user);
            String refreshToken = jwtService.generateRefreshToken(user);

            redisTemplate.opsForValue().set(
                    "rt:" + refreshToken,
                    user.getId().toString(),
                    refreshTokenExpiryMinutes,
                    TimeUnit.MINUTES
            );

            return new AuthResponse(
                    accessToken,
                    refreshToken,
                    user.getId().toString(),
                    user.getEmail(),
                    user.getName(),
                    user.getAvatarUrl(),
                    user.getRole().name()
            );

        } catch (Exception e) {
            throw new BadCredentialsException("Google authentication failed: " + e.getMessage());
        }
    }
}