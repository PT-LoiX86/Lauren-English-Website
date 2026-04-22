package com.laurenenglish.platform.controllers;

import com.laurenenglish.platform.models.dtos.TestFeedbackDTO;
import com.laurenenglish.platform.models.entities.User;
import com.laurenenglish.platform.services.TestAttemptService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/test-attempts")
@RequiredArgsConstructor
public class TestAttemptController {

    private final TestAttemptService testAttemptService;

    @GetMapping("/latest-feedback")
    public ResponseEntity<TestFeedbackDTO> getLatestFeedback(Authentication authentication) {
        User currentUser = (User) authentication.getPrincipal();
        TestFeedbackDTO feedback = testAttemptService.getLatestTestFeedback(currentUser.getId());

        if (feedback == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(feedback);
    }
}
