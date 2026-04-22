package com.laurenenglish.platform.controllers;

import com.laurenenglish.platform.models.dtos.ClassroomDTO;
import com.laurenenglish.platform.models.entities.User;
import com.laurenenglish.platform.models.enums.UserRole;
import com.laurenenglish.platform.services.ClassroomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/classrooms")
@RequiredArgsConstructor
public class ClassroomController {

    private final ClassroomService classroomService;

    @GetMapping
    public ResponseEntity<List<ClassroomDTO>> getMyClassrooms(Authentication authentication) {
        User currentUser = (User) authentication.getPrincipal();

        UUID userId = currentUser.getId();
        UserRole role = currentUser.getRole();

        List<ClassroomDTO> classrooms = classroomService.getUserClassrooms(userId, role);

        return ResponseEntity.ok(classrooms);
    }
}
