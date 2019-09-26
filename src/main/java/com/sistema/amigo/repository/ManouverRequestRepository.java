package com.sistema.amigo.repository;
import com.sistema.amigo.domain.ManouverRequest;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the ManouverRequest entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ManouverRequestRepository extends JpaRepository<ManouverRequest, Long> {

}
