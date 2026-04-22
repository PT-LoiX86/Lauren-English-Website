package com.laurenenglish.platform.controllers;

import com.laurenenglish.platform.models.dtos.ClassPeriodDTO;
import com.laurenenglish.platform.models.entities.User;
import com.laurenenglish.platform.services.ClassPeriodService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/v1/class-periods")
@RequiredArgsConstructor
public class ClassPeriodController {

    private final ClassPeriodService classPeriodService;

    @GetMapping
    public ResponseEntity<Page<ClassPeriodDTO>> getPeriods(
            Authentication authentication,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime afterDate,

            @PageableDefault(size = 20, sort = "startAt") Pageable pageable) {

        User currentUser = (User) authentication.getPrincipal();

        if (afterDate == null) {
            afterDate = LocalDateTime.now();
        }

        Page<ClassPeriodDTO> periods = classPeriodService.getClassPeriods(
                currentUser.getId(),
                currentUser.getRole(),
                afterDate,
                pageable
        );

        return ResponseEntity.ok(periods);
    }
}
