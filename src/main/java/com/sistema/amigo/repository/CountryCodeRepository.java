package com.sistema.amigo.repository;
import com.sistema.amigo.domain.CountryCode;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the CountryCode entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CountryCodeRepository extends JpaRepository<CountryCode, Long> {

}
