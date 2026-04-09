package com.placeconnect.controller;

import com.placeconnect.model.Application;
import com.placeconnect.service.ApplicationService;
import java.util.List;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"})
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @GetMapping
    public List<Application> listAll() {
        return applicationService.findAll();
    }

    @GetMapping("/student/{studentId}")
    public List<Application> listForStudent(@PathVariable Long studentId) {
        return applicationService.getApplicationsByStudent(studentId);
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Map<String, Object> body) {
        return applyInternal(body);
    }

    @PostMapping("/apply")
    public ResponseEntity<?> apply(@RequestBody Map<String, Object> body) {
        return applyInternal(body);
    }

    private ResponseEntity<?> applyInternal(Map<String, Object> body) {
        try {
            @SuppressWarnings("unchecked")
            Map<String, Object> student = (Map<String, Object>) body.get("student");
            @SuppressWarnings("unchecked")
            Map<String, Object> job = (Map<String, Object>) body.get("job");
            if (student == null || job == null) {
                return ResponseEntity.badRequest().body(Map.of("message", "student and job are required"));
            }
            Object sid = student.get("id");
            Object jid = job.get("id");
            if (sid == null || jid == null) {
                return ResponseEntity.badRequest().body(Map.of("message", "student.id and job.id are required"));
            }
            long studentId = ((Number) sid).longValue();
            long jobId = ((Number) jid).longValue();
            Application saved = applicationService.createApplication(studentId, jobId);
            return ResponseEntity.ok(saved);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            applicationService.deleteApplication(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
