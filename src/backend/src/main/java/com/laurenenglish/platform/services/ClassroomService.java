package com.laurenenglish.platform.services;

import com.laurenenglish.platform.models.dtos.ClassroomDTO;
import com.laurenenglish.platform.models.entities.Classroom;
import com.laurenenglish.platform.models.enums.UserRole;
import com.laurenenglish.platform.repositories.ClassroomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ClassroomService {

    private final ClassroomRepository classroomRepository;

    @Transactional(readOnly = true)
    public List<ClassroomDTO> getUserClassrooms(UUID userId, UserRole role) {
        List<Classroom> classrooms;

        if (UserRole.TEACHER.equals(role)) {
            classrooms = classroomRepository.findAllByTeacherId(userId);
        } else {
            classrooms = classroomRepository.findEnrolledClassroomsByStudentId(userId);
        }

        return classrooms.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private ClassroomDTO mapToDTO(Classroom classroom) {
        return ClassroomDTO.builder()
                .id(classroom.getId())
                .name(classroom.getName())
                .status(classroom.getStatus().name())
                .teacherName(classroom.getTeacher().getName())
                .build();
    }
}
