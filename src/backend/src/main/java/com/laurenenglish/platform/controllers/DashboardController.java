package com.laurenenglish.platform.controllers;

import com.laurenenglish.platform.models.dtos.ActivityDTO;
import com.laurenenglish.platform.models.dtos.ClassPeriodDTO;
import com.laurenenglish.platform.models.dtos.TestFeedbackDTO;
import com.laurenenglish.platform.models.dtos.VocabularyProgressDTO;
import com.laurenenglish.platform.models.entities.User;
import com.laurenenglish.platform.services.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/activities")
    public ResponseEntity<List<ActivityDTO>> getActivities(Authentication authentication) {

        User currentUser = (User) authentication.getPrincipal();

        List<ActivityDTO> activities = dashboardService.getUpcomingActivities(currentUser.getId());

        return ResponseEntity.ok(activities);
    }
}
