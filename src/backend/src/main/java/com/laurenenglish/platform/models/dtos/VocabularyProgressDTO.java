package com.laurenenglish.platform.models.dtos;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class VocabularyProgressDTO {
    private Long learnedWords;
    private Long totalSavedWords;
    private List<WordMasteryCountDTO> masteryDistribution;
    private Long nextReviewWordCount;
    private LocalDateTime nextReviewTime;
}