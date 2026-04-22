package com.laurenenglish.platform.services.impl;

import com.laurenenglish.platform.models.dtos.ClassPeriodDTO;
import com.laurenenglish.platform.models.entities.ClassPeriod;
import com.laurenenglish.platform.models.enums.UserRole;
import com.laurenenglish.platform.repositories.ClassPeriodRepository;
import com.laurenenglish.platform.services.ClassPeriodService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ClassPeriodServiceImpl implements ClassPeriodService {

    private final ClassPeriodRepository periodRepository;

    public Page<ClassPeriodDTO> getClassPeriods(UUID userId, UserRole role, LocalDateTime afterDate, Pageable pageable) {

        Page<ClassPeriod> periods;

        if (UserRole.TEACHER.equals(role)) {
            periods = periodRepository.findUpcomingForTeacher(userId, afterDate, pageable);
        } else {
            periods = periodRepository.findUpcomingForStudent(userId, afterDate, pageable);
        }

        return periods.map(period -> ClassPeriodDTO.builder()
                .id(period.getId().toString())
                .classroomName(period.getClassroom().getName())
                .lessonContent(period.getLessonContent())
                .startTime(period.getStartAt())
                .build()
        );
    }
}
