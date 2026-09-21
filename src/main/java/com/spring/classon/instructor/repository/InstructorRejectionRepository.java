package com.spring.classon.instructor.repository;

import com.spring.classon.instructor.entity.InstructorRejection;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface InstructorRejectionRepository extends JpaRepository<InstructorRejection, Long> {

    Optional<InstructorRejection> findByReqNo(Long reqNo);
}