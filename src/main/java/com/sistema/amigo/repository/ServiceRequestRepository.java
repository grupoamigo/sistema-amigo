package com.sistema.amigo.repository;
import com.sistema.amigo.domain.ServiceRequest;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the ServiceRequest entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ServiceRequestRepository extends JpaRepository<ServiceRequest, Long> {

}
