package com.laurenenglish.platform.models.dtos;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class ClassPeriodDTO {
    private String id;
    private String classroomName;
    private String lessonContent;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
}
