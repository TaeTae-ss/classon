package com.spring.classon.oneday.repository;

import com.spring.classon.oneday.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
}
