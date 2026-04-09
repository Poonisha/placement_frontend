package com.placeconnect.config;

import com.placeconnect.model.Application;
import com.placeconnect.model.Job;
import com.placeconnect.model.User;
import com.placeconnect.repository.ApplicationRepository;
import com.placeconnect.repository.JobRepository;
import com.placeconnect.repository.UserRepository;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataSeed {

    @Bean
    ApplicationRunner seedData(
            UserRepository userRepository,
            JobRepository jobRepository,
            ApplicationRepository applicationRepository) {
        return args -> {
            if (userRepository.count() == 0) {
                User u1 = new User();
                u1.setName("Demo Student");
                u1.setEmail("student@demo.com");
                u1.setPassword("demo");
                u1.setRole("STUDENT");
                u1 = userRepository.save(u1);

                User u2 = new User();
                u2.setName("Jane Student");
                u2.setEmail("jane@demo.com");
                u2.setPassword("demo");
                u2.setRole("STUDENT");
                u2 = userRepository.save(u2);

                User emp = new User();
                emp.setName("Demo Employer");
                emp.setEmail("employer@demo.com");
                emp.setPassword("demo");
                emp.setRole("EMPLOYER");
                userRepository.save(emp);

                User admin = new User();
                admin.setName("Admin");
                admin.setEmail("admin@demo.com");
                admin.setPassword("demo");
                admin.setRole("ADMIN");
                userRepository.save(admin);

                Job j1 = new Job();
                j1.setTitle("Graduate Software Engineer");
                j1.setCompanyName("Northwind Labs");
                j1 = jobRepository.save(j1);

                Job j2 = new Job();
                j2.setTitle("Data Analyst Intern");
                j2.setCompanyName("Summit Analytics");
                j2 = jobRepository.save(j2);

                Application a1 = new Application();
                a1.setStudentId(u1.getId());
                a1.setJob(j1);
                a1.setStatus("APPLIED");
                applicationRepository.save(a1);

                Application a2 = new Application();
                a2.setStudentId(u1.getId());
                a2.setJob(j2);
                a2.setStatus("SHORTLISTED");
                applicationRepository.save(a2);

                Application a3 = new Application();
                a3.setStudentId(u2.getId());
                a3.setJob(j1);
                a3.setStatus("REJECTED");
                applicationRepository.save(a3);
            } else if (applicationRepository.count() == 0 && jobRepository.count() > 0) {
                var jobs = jobRepository.findAll();
                if (jobs.size() >= 2) {
                    Job j1 = jobs.get(0);
                    Job j2 = jobs.get(1);
                    var users = userRepository.findAll();
                    var students = users.stream().filter(u -> "STUDENT".equals(u.getRole())).toList();
                    if (!students.isEmpty()) {
                        Long sid = students.get(0).getId();
                        Application a1 = new Application();
                        a1.setStudentId(sid);
                        a1.setJob(j1);
                        a1.setStatus("APPLIED");
                        applicationRepository.save(a1);
                        Application a2 = new Application();
                        a2.setStudentId(sid);
                        a2.setJob(j2);
                        a2.setStatus("SHORTLISTED");
                        applicationRepository.save(a2);
                    }
                }
            }
        };
    }
}
