package com.sistema.amigo.repository;
import com.sistema.amigo.domain.Membership;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data  repository for the Membership entity.
 */
@SuppressWarnings("unused")
@Repository
public interface MembershipRepository extends JpaRepository<Membership, Long> {

    @Query("select membership from Membership membership where membership.user.login = ?#{principal.username}")
    List<Membership> findByUserIsCurrentUser();

}
