package com.sistema.amigo.repository;
import com.sistema.amigo.domain.Evidence;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the Evidence entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EvidenceRepository extends JpaRepository<Evidence, Long> {

}
