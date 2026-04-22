package com.laurenenglish.platform.models.dtos;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class ActivityDTO {
    private UUID id;
    private String type;
    private String title;
    private String classroomName;
    private UUID referenceId;
    private String description;
    private LocalDateTime timestamp;
}
