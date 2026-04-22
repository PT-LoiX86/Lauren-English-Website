package com.laurenenglish.platform.services;

import com.laurenenglish.platform.models.dtos.ClassroomDTO;
import com.laurenenglish.platform.models.enums.UserRole;

import java.util.List;
import java.util.UUID;

public interface ClassroomService {

    List<ClassroomDTO> getUserClassrooms(UUID userId, UserRole role);
}
