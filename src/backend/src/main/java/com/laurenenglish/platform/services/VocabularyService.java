package com.laurenenglish.platform.services;

import com.laurenenglish.platform.models.dtos.VocabularyProgressDTO;

import java.util.UUID;

public interface VocabularyService {
    VocabularyProgressDTO getVocabularyProgress(UUID userId);
}
