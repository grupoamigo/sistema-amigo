package com.sistema.amigo.repository;
import com.sistema.amigo.domain.Seal;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the Seal entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SealRepository extends JpaRepository<Seal, Long> {

}
