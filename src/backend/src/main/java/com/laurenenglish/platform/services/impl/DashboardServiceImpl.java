package com.laurenenglish.platform.services.impl;

import com.laurenenglish.platform.models.dtos.ActivityDTO;
import com.laurenenglish.platform.repositories.DashboardActivityRepository;
import com.laurenenglish.platform.services.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final DashboardActivityRepository activityRepository;

    public List<ActivityDTO> getUpcomingActivities(UUID userId) {
        LocalDateTime startOfToday = LocalDate.now().atStartOfDay();

        return activityRepository
                .findByUserIdAndTimestampGreaterThanEqualOrderByTimestampAsc(userId, startOfToday)
                .stream()
                .map(activity -> ActivityDTO.builder()
                        .id(activity.getId())
                        .type(activity.getType())
                        .title(activity.getTitle())
                        .classroomName(activity.getClassroomName())
                        .referenceId(activity.getReferenceId())
                        .description(activity.getDescription())
                        .timestamp(activity.getTimestamp())
                        .build())
                .collect(Collectors.toList());
    }
}
