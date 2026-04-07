package com.placeconnect.service;

import com.placeconnect.model.Application;
import com.placeconnect.repository.ApplicationRepository;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class ApplicationService {

    private final ApplicationRepository repository;

    public ApplicationService(ApplicationRepository repository) {
        this.repository = repository;
    }

    public List<Application> getApplicationsByStudent(Long studentId) {
        return repository.findByStudentId(studentId);
    }
}
