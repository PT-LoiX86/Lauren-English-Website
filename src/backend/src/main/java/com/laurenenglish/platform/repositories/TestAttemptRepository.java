package com.laurenenglish.platform.repositories;

import com.laurenenglish.platform.models.entities.TestAttempt;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

public interface TestAttemptRepository extends JpaRepository<TestAttempt, UUID> {

    Optional<TestAttempt> findFirstByStudentIdAndSubmittedAtIsNotNullOrderBySubmittedAtDesc(UUID studentId);

    @Query("SELECT ta FROM TestAttempt ta JOIN FETCH ta.test " +
            "WHERE ta.student.id = :studentId AND ta.submittedAt IS NOT NULL " +
            "ORDER BY ta.submittedAt DESC")
    Page<TestAttempt> findTestHistoryByStudentId(@Param("studentId") UUID studentId, Pageable pageable);
}
