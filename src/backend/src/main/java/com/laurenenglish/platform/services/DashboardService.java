package com.laurenenglish.platform.services;

import com.laurenenglish.platform.models.dtos.ActivityDTO;

import java.util.List;
import java.util.UUID;

public interface DashboardService {
    List<ActivityDTO> getUpcomingActivities(UUID userId);
}
