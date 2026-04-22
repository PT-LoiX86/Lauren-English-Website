package com.laurenenglish.platform.services;

import com.laurenenglish.platform.models.dtos.ClassPeriodDTO;
import com.laurenenglish.platform.models.dtos.ClassroomDTO;
import com.laurenenglish.platform.models.enums.UserRole;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface ClassPeriodService {
    Page<ClassPeriodDTO> getClassPeriods(UUID userId, UserRole role, LocalDateTime afterDate, Pageable pageable);
}
