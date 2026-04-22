package com.laurenenglish.platform.repositories;

import com.laurenenglish.platform.models.entities.ClassPeriod;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.UUID;

public interface ClassPeriodRepository extends JpaRepository<ClassPeriod, UUID> {

    @Query("SELECT cp FROM ClassPeriod cp " +
            "JOIN cp.classroom c JOIN Enrollment e ON c.id = e.classroom.id " +
            "WHERE e.student.id = :studentId AND cp.startAt >= :afterDate")
    Page<ClassPeriod> findUpcomingForStudent(
            @Param("studentId") UUID studentId,
            @Param("afterDate") LocalDateTime afterDate,
            Pageable pageable);

    @Query("SELECT cp FROM ClassPeriod cp " +
            "JOIN cp.classroom c " +
            "WHERE c.teacher.id = :teacherId AND cp.startAt >= :afterDate")
    Page<ClassPeriod> findUpcomingForTeacher(
            @Param("teacherId") UUID teacherId,
            @Param("afterDate") LocalDateTime afterDate,
            Pageable pageable);
}
