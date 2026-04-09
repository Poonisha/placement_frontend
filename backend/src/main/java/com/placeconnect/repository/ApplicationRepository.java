package com.placeconnect.repository;

import com.placeconnect.model.Application;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ApplicationRepository extends JpaRepository<Application, Long> {

    List<Application> findByStudentId(Long studentId);

    Optional<Application> findByStudentIdAndJob_Id(Long studentId, Long jobId);
}
