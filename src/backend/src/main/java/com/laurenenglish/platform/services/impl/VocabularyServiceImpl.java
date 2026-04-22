package com.laurenenglish.platform.services.impl;

import com.laurenenglish.platform.models.dtos.VocabularyProgressDTO;
import com.laurenenglish.platform.repositories.SavedWordRepository;
import com.laurenenglish.platform.services.VocabularyService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class VocabularyServiceImpl implements VocabularyService {

    private final SavedWordRepository savedWordRepository;

    @Transactional(readOnly = true)
    public VocabularyProgressDTO getVocabularyProgress(UUID userId) {
        LocalDateTime now = LocalDateTime.now();

        return VocabularyProgressDTO.builder()
                .totalSavedWords(savedWordRepository.countByUserId(userId))
                .learnedWords(savedWordRepository.countByUserIdAndMasteryLevelGreaterThanEqual(userId, 5))
                .masteryDistribution(savedWordRepository.getMasteryDistribution(userId))
                .nextReviewWordCount(savedWordRepository.countByUserIdAndNextReviewAtLessThanEqual(userId, now))
                .nextReviewTime(savedWordRepository.findNextReviewTimeForUser(userId).orElse(now.plusDays(1)))
                .build();
    }
}
