package com.spring.classon.instructor.repository;

import com.spring.classon.instructor.entity.InstructorRequest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InstructorRequestRepository extends JpaRepository<InstructorRequest, Long> {
}