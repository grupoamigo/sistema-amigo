package com.sistema.amigo.repository;
import com.sistema.amigo.domain.ContactCard;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the ContactCard entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ContactCardRepository extends JpaRepository<ContactCard, Long> {

}
