package com.laurenenglish.platform.repositories;

import com.laurenenglish.platform.models.entities.Classroom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ClassroomRepository extends JpaRepository<Classroom, UUID> {

    @Query("SELECT c FROM Classroom c JOIN FETCH c.teacher WHERE c.teacher.id = :teacherId ")
    List<Classroom> findAllByTeacherId( @Param("teacherId")UUID teacherId);

    @Query("SELECT e.classroom FROM Enrollment e WHERE e.student.id = :studentId")
    List<Classroom> findEnrolledClassroomsByStudentId(@Param("studentId") UUID studentId);
}
