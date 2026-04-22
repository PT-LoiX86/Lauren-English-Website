package com.laurenenglish.platform.controllers;

import com.laurenenglish.platform.models.dtos.VocabularyProgressDTO;
import com.laurenenglish.platform.models.entities.User;
import com.laurenenglish.platform.services.DashboardService;
import com.laurenenglish.platform.services.VocabularyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/vocabulary")
@RequiredArgsConstructor
public class VocabularyController {

    private final VocabularyService vocabularyService;

    @GetMapping("/progress")
    public ResponseEntity<VocabularyProgressDTO> getVocabularyStats(Authentication authentication) {
        User currentUser = (User) authentication.getPrincipal();
        VocabularyProgressDTO dto = vocabularyService.getVocabularyProgress(currentUser.getId());
        return ResponseEntity.ok(dto);
    }
}
