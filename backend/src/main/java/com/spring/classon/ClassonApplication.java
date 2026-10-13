package com.spring.classon;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class ClassonApplication {

	public static void main(String[] args) {
		SpringApplication.run(ClassonApplication.class, args);
	}

}
