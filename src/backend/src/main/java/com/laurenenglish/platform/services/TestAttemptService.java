package com.laurenenglish.platform.services;

import com.laurenenglish.platform.models.dtos.TestFeedbackDTO;

import java.util.UUID;

public interface TestAttemptService {
    TestFeedbackDTO getLatestTestFeedback(UUID studentId);
}
