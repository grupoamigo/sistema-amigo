package com.sistema.amigo.repository;
import com.sistema.amigo.domain.ServiceQuote;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the ServiceQuote entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ServiceQuoteRepository extends JpaRepository<ServiceQuote, Long> {

}
