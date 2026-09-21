package com.spring.classon.instructor.repository;

import com.spring.classon.instructor.entity.InstructorRejection;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InstructorRejectionRepository extends JpaRepository<InstructorRejection, Long> {
}