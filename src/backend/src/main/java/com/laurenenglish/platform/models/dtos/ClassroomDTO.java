package com.laurenenglish.platform.models.dtos;

import lombok.Builder;
import lombok.Data;
import java.util.UUID;

@Data
@Builder
public class ClassroomDTO {
    private UUID id;
    private String name;
    private String status;
    private String teacherName;
}