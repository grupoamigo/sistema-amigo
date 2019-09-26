package com.sistema.amigo.repository;
import com.sistema.amigo.domain.Inspection;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the Inspection entity.
 */
@SuppressWarnings("unused")
@Repository
public interface InspectionRepository extends JpaRepository<Inspection, Long> {

}
