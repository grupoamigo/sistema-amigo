package com.sistema.amigo.repository;
import com.sistema.amigo.domain.StateCode;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the StateCode entity.
 */
@SuppressWarnings("unused")
@Repository
public interface StateCodeRepository extends JpaRepository<StateCode, Long> {

}
