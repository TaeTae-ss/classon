package com.spring.classon.instructor.repository;

import com.spring.classon.instructor.entity.InstructorDocument;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InstructorDocumentRepository extends JpaRepository<InstructorDocument, Long> {
}