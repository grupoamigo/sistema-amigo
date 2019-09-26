package com.sistema.amigo.web.rest;

import com.sistema.amigo.domain.Damage;
import com.sistema.amigo.repository.DamageRepository;
import com.sistema.amigo.repository.search.DamageSearchRepository;
import com.sistema.amigo.web.rest.errors.BadRequestAlertException;

import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing {@link com.sistema.amigo.domain.Damage}.
 */
@RestController
@RequestMapping("/api")
public class DamageResource {

    private final Logger log = LoggerFactory.getLogger(DamageResource.class);

    private static final String ENTITY_NAME = "damage";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final DamageRepository damageRepository;

    private final DamageSearchRepository damageSearchRepository;

    public DamageResource(DamageRepository damageRepository, DamageSearchRepository damageSearchRepository) {
        this.damageRepository = damageRepository;
        this.damageSearchRepository = damageSearchRepository;
    }

    /**
     * {@code POST  /damages} : Create a new damage.
     *
     * @param damage the damage to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new damage, or with status {@code 400 (Bad Request)} if the damage has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/damages")
    public ResponseEntity<Damage> createDamage(@RequestBody Damage damage) throws URISyntaxException {
        log.debug("REST request to save Damage : {}", damage);
        if (damage.getId() != null) {
            throw new BadRequestAlertException("A new damage cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Damage result = damageRepository.save(damage);
        damageSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/damages/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /damages} : Updates an existing damage.
     *
     * @param damage the damage to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated damage,
     * or with status {@code 400 (Bad Request)} if the damage is not valid,
     * or with status {@code 500 (Internal Server Error)} if the damage couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/damages")
    public ResponseEntity<Damage> updateDamage(@RequestBody Damage damage) throws URISyntaxException {
        log.debug("REST request to update Damage : {}", damage);
        if (damage.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Damage result = damageRepository.save(damage);
        damageSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, damage.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /damages} : get all the damages.
     *

     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of damages in body.
     */
    @GetMapping("/damages")
    public List<Damage> getAllDamages() {
        log.debug("REST request to get all Damages");
        return damageRepository.findAll();
    }

    /**
     * {@code GET  /damages/:id} : get the "id" damage.
     *
     * @param id the id of the damage to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the damage, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/damages/{id}")
    public ResponseEntity<Damage> getDamage(@PathVariable Long id) {
        log.debug("REST request to get Damage : {}", id);
        Optional<Damage> damage = damageRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(damage);
    }

    /**
     * {@code DELETE  /damages/:id} : delete the "id" damage.
     *
     * @param id the id of the damage to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/damages/{id}")
    public ResponseEntity<Void> deleteDamage(@PathVariable Long id) {
        log.debug("REST request to delete Damage : {}", id);
        damageRepository.deleteById(id);
        damageSearchRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }

    /**
     * {@code SEARCH  /_search/damages?query=:query} : search for the damage corresponding
     * to the query.
     *
     * @param query the query of the damage search.
     * @return the result of the search.
     */
    @GetMapping("/_search/damages")
    public List<Damage> searchDamages(@RequestParam String query) {
        log.debug("REST request to search Damages for query {}", query);
        return StreamSupport
            .stream(damageSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }

}
