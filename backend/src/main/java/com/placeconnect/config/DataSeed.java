package com.placeconnect.config;

import com.placeconnect.model.Application;
import com.placeconnect.model.Job;
import com.placeconnect.repository.ApplicationRepository;
import com.placeconnect.repository.JobRepository;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataSeed {

    @Bean
    ApplicationRunner seedApplications(JobRepository jobRepository, ApplicationRepository applicationRepository) {
        return args -> {
            if (applicationRepository.count() > 0) {
                return;
            }
            Job j1 = new Job();
            j1.setTitle("Graduate Software Engineer");
            j1.setCompanyName("Northwind Labs");
            j1 = jobRepository.save(j1);

            Job j2 = new Job();
            j2.setTitle("Data Analyst Intern");
            j2.setCompanyName("Summit Analytics");
            j2 = jobRepository.save(j2);

            Application a1 = new Application();
            a1.setStudentId(1L);
            a1.setJob(j1);
            a1.setStatus("APPLIED");
            applicationRepository.save(a1);

            Application a2 = new Application();
            a2.setStudentId(1L);
            a2.setJob(j2);
            a2.setStatus("SHORTLISTED");
            applicationRepository.save(a2);

            Application a3 = new Application();
            a3.setStudentId(2L);
            a3.setJob(j1);
            a3.setStatus("REJECTED");
            applicationRepository.save(a3);
        };
    }
}
