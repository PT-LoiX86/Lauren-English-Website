package com.laurenenglish.platform.repositories;

import com.laurenenglish.platform.models.entities.DashboardActivity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface DashboardActivityRepository extends JpaRepository<DashboardActivity, UUID> {

    List<DashboardActivity> findByUserIdAndTimestampGreaterThanEqualOrderByTimestampAsc(
            UUID userId,
            LocalDateTime timestamp
    );
}
