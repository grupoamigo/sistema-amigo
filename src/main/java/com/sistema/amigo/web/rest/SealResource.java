package com.sistema.amigo.web.rest;

import com.sistema.amigo.domain.Seal;
import com.sistema.amigo.repository.SealRepository;
import com.sistema.amigo.repository.search.SealSearchRepository;
import com.sistema.amigo.web.rest.errors.BadRequestAlertException;

import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing {@link com.sistema.amigo.domain.Seal}.
 */
@RestController
@RequestMapping("/api")
public class SealResource {

    private final Logger log = LoggerFactory.getLogger(SealResource.class);

    private static final String ENTITY_NAME = "seal";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SealRepository sealRepository;

    private final SealSearchRepository sealSearchRepository;

    public SealResource(SealRepository sealRepository, SealSearchRepository sealSearchRepository) {
        this.sealRepository = sealRepository;
        this.sealSearchRepository = sealSearchRepository;
    }

    /**
     * {@code POST  /seals} : Create a new seal.
     *
     * @param seal the seal to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new seal, or with status {@code 400 (Bad Request)} if the seal has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/seals")
    public ResponseEntity<Seal> createSeal(@Valid @RequestBody Seal seal) throws URISyntaxException {
        log.debug("REST request to save Seal : {}", seal);
        if (seal.getId() != null) {
            throw new BadRequestAlertException("A new seal cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Seal result = sealRepository.save(seal);
        sealSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/seals/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /seals} : Updates an existing seal.
     *
     * @param seal the seal to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated seal,
     * or with status {@code 400 (Bad Request)} if the seal is not valid,
     * or with status {@code 500 (Internal Server Error)} if the seal couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/seals")
    public ResponseEntity<Seal> updateSeal(@Valid @RequestBody Seal seal) throws URISyntaxException {
        log.debug("REST request to update Seal : {}", seal);
        if (seal.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Seal result = sealRepository.save(seal);
        sealSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, seal.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /seals} : get all the seals.
     *

     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of seals in body.
     */
    @GetMapping("/seals")
    public List<Seal> getAllSeals() {
        log.debug("REST request to get all Seals");
        return sealRepository.findAll();
    }

    /**
     * {@code GET  /seals/:id} : get the "id" seal.
     *
     * @param id the id of the seal to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the seal, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/seals/{id}")
    public ResponseEntity<Seal> getSeal(@PathVariable Long id) {
        log.debug("REST request to get Seal : {}", id);
        Optional<Seal> seal = sealRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(seal);
    }

    /**
     * {@code DELETE  /seals/:id} : delete the "id" seal.
     *
     * @param id the id of the seal to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/seals/{id}")
    public ResponseEntity<Void> deleteSeal(@PathVariable Long id) {
        log.debug("REST request to delete Seal : {}", id);
        sealRepository.deleteById(id);
        sealSearchRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }

    /**
     * {@code SEARCH  /_search/seals?query=:query} : search for the seal corresponding
     * to the query.
     *
     * @param query the query of the seal search.
     * @return the result of the search.
     */
    @GetMapping("/_search/seals")
    public List<Seal> searchSeals(@RequestParam String query) {
        log.debug("REST request to search Seals for query {}", query);
        return StreamSupport
            .stream(sealSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }

}
