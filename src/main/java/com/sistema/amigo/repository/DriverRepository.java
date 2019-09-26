package com.sistema.amigo.repository;
import com.sistema.amigo.domain.Driver;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data  repository for the Driver entity.
 */
@SuppressWarnings("unused")
@Repository
public interface DriverRepository extends JpaRepository<Driver, Long> {

    @Query("select driver from Driver driver where driver.user.login = ?#{principal.username}")
    List<Driver> findByUserIsCurrentUser();

}
