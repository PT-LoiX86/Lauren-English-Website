package com.laurenenglish.platform.models.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import org.hibernate.annotations.Immutable;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "dashboard_activities") // This is the view, not actual table
@Immutable
@Getter
public class DashboardActivity {

    @Id
    private UUID id;

    private String type;
    private String title;

    @Column(name = "classroom_name")
    private String classroomName;

    @Column(name = "reference_id")
    private UUID referenceId;

    private String description;
    private LocalDateTime timestamp;

    @Column(name = "user_id")
    private UUID userId;
}
