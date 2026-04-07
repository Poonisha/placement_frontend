package com.placeconnect.controller;

import com.placeconnect.model.Application;
import com.placeconnect.service.ApplicationService;
import java.util.List;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/student")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"})
public class StudentController {

    private final ApplicationService appService;

    public StudentController(ApplicationService appService) {
        this.appService = appService;
    }

    @GetMapping("/applications/{studentId}")
    public List<Application> getStudentApplications(@PathVariable Long studentId) {
        return appService.getApplicationsByStudent(studentId);
    }
}
