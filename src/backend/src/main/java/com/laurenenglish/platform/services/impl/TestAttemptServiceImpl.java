package com.laurenenglish.platform.services.impl;

import com.laurenenglish.platform.models.dtos.TestFeedbackDTO;
import com.laurenenglish.platform.models.entities.TestAttempt;
import com.laurenenglish.platform.repositories.TestAttemptRepository;
import com.laurenenglish.platform.services.TestAttemptService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TestAttemptServiceImpl implements TestAttemptService {

    private final TestAttemptRepository testAttemptRepository;

    @Transactional(readOnly = true)
    @SuppressWarnings("unchecked")
    public TestFeedbackDTO getLatestTestFeedback(UUID studentId) {
        Optional<TestAttempt> lastAttemptOpt = testAttemptRepository
                .findFirstByStudentIdAndSubmittedAtIsNotNullOrderBySubmittedAtDesc(studentId);

        if (lastAttemptOpt.isEmpty() || lastAttemptOpt.get().getFeedback() == null) {
            return null;
        }

        TestAttempt attempt = lastAttemptOpt.get();
        Map<String, Object> feedback = attempt.getFeedback();

        return TestFeedbackDTO.builder()
                .testTitle(attempt.getTest().getTitle())
                .strengths((List<String>) feedback.getOrDefault("strengths", List.of()))
                .weaknesses((List<String>) feedback.getOrDefault("weaknesses", List.of()))
                .suggestions((List<String>) feedback.getOrDefault("suggestions", List.of()))
                .build();
    }
}
