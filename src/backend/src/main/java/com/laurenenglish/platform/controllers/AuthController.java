package com.laurenenglish.platform.controllers;

import com.laurenenglish.platform.models.dtos.AuthResponse;
import com.laurenenglish.platform.models.dtos.AuthRequest;
import com.laurenenglish.platform.models.dtos.RefreshTokenRequest;
import com.laurenenglish.platform.models.dtos.RefreshTokenResponse;
import com.laurenenglish.platform.models.enums.AuthProvider;
import com.laurenenglish.platform.services.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/{provider}")
    public ResponseEntity<AuthResponse> login(
            @PathVariable AuthProvider provider,
            @RequestBody AuthRequest request
    ) {
        AuthResponse response = authService.executeLogin(provider, request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/refresh")
    public ResponseEntity<RefreshTokenResponse> refreshToken(@RequestBody RefreshTokenRequest request) {
        RefreshTokenResponse response = authService.refreshTokens(request.refreshToken());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@RequestBody RefreshTokenRequest request) {
        authService.logout(request.refreshToken());
        return ResponseEntity.ok().build();
    }
}