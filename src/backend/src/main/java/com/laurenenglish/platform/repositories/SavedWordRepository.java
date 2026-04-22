package com.laurenenglish.platform.repositories;

import com.laurenenglish.platform.models.dtos.WordMasteryCountDTO;
import com.laurenenglish.platform.models.entities.SavedWord;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface SavedWordRepository extends JpaRepository<SavedWord, UUID> {

    long countByUserId(UUID userId);
    long countByUserIdAndMasteryLevelGreaterThanEqual(UUID userId, Integer level);
    long countByUserIdAndNextReviewAtLessThanEqual(UUID userId, LocalDateTime now);

    @Query("SELECT MIN(s.nextReviewAt) FROM SavedWord s WHERE s.user.id = :userId")
    Optional<LocalDateTime> findNextReviewTimeForUser(@Param("userId") UUID userId);

    @Query("SELECT new com.laurenenglish.platform.models.dtos.WordMasteryCountDTO(CONCAT('L', s.masteryLevel), COUNT(s)) " +
            "FROM SavedWord s WHERE s.user.id = :userId GROUP BY s.masteryLevel ORDER BY s.masteryLevel ASC")
    List<WordMasteryCountDTO> getMasteryDistribution(@Param("userId") UUID userId);


    @Query("SELECT s FROM SavedWord s JOIN FETCH s.word WHERE s.user.id = :userId")
    Page<SavedWord> findAllByUserId(@Param("userId") UUID userId, Pageable pageable);

    @Query("SELECT s FROM SavedWord s JOIN FETCH s.word WHERE s.user.id = :userId AND s.nextReviewAt <= :now")
    Page<SavedWord> findWordsDueForReview(@Param("userId") UUID userId, @Param("now") LocalDateTime now, Pageable pageable);
}
