package com.sistema.amigo.repository;
import com.sistema.amigo.domain.ExtraField;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the ExtraField entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ExtraFieldRepository extends JpaRepository<ExtraField, Long> {

}
