package com.placeconnect.service;

import com.placeconnect.model.Application;
import com.placeconnect.model.Job;
import com.placeconnect.repository.ApplicationRepository;
import com.placeconnect.repository.JobRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ApplicationService {

    private final ApplicationRepository repository;
    private final JobRepository jobRepository;

    public ApplicationService(ApplicationRepository repository, JobRepository jobRepository) {
        this.repository = repository;
        this.jobRepository = jobRepository;
    }

    public List<Application> getApplicationsByStudent(Long studentId) {
        return repository.findByStudentId(studentId);
    }

    public List<Application> findAll() {
        return repository.findAll();
    }

    @Transactional
    public Application createApplication(Long studentId, Long jobId) {
        if (repository.findByStudentIdAndJob_Id(studentId, jobId).isPresent()) {
            throw new IllegalArgumentException("Already applied for this job");
        }
        Job job = jobRepository.findById(jobId).orElseThrow(() -> new IllegalArgumentException("Job not found"));
        Application a = new Application();
        a.setStudentId(studentId);
        a.setJob(job);
        a.setStatus("APPLIED");
        return repository.save(a);
    }

    @Transactional
    public void deleteApplication(Long id) {
        if (!repository.existsById(id)) {
            throw new IllegalArgumentException("Application not found");
        }
        repository.deleteById(id);
    }
}
