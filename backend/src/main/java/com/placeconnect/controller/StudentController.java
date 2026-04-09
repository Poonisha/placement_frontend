package com.placeconnect.controller;

import com.placeconnect.model.Application;
import com.placeconnect.repository.ApplicationRepository;
import com.placeconnect.repository.JobRepository;
import com.placeconnect.service.ApplicationService;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/student")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"})
public class StudentController {

    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final ApplicationService applicationService;

    public StudentController(
            ApplicationRepository applicationRepository,
            JobRepository jobRepository,
            ApplicationService applicationService) {
        this.applicationRepository = applicationRepository;
        this.jobRepository = jobRepository;
        this.applicationService = applicationService;
    }

    @GetMapping("/applications/{studentId}")
    public List<Application> listApplications(@PathVariable Long studentId) {
        return applicationService.getApplicationsByStudent(studentId);
    }

    @GetMapping("/stats/{userId}")
    public Map<String, Object> getStats(@PathVariable Long userId) {
        long totalJobs = jobRepository.count();
        List<Application> apps = applicationRepository.findByStudentId(userId);
        long shortlisted =
                apps.stream()
                        .filter(a -> {
                            String s = a.getStatus();
                            return s != null
                                    && (s.equalsIgnoreCase("SHORTLISTED")
                                            || s.equalsIgnoreCase("SELECTED"));
                        })
                        .count();
        List<Long> appliedJobIds =
                apps.stream()
                        .map(a -> a.getJob() != null ? a.getJob().getId() : null)
                        .filter(id -> id != null)
                        .collect(Collectors.toList());

        Map<String, Object> res = new HashMap<>();
        res.put("totalJobs", totalJobs);
        res.put("applied", apps.size());
        res.put("shortlisted", shortlisted);
        res.put("appliedJobIds", appliedJobIds);
        return res;
    }
}
