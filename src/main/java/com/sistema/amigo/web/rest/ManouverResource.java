package com.sistema.amigo.web.rest;

import com.sistema.amigo.domain.Manouver;
import com.sistema.amigo.repository.ManouverRepository;
import com.sistema.amigo.repository.search.ManouverSearchRepository;
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
 * REST controller for managing {@link com.sistema.amigo.domain.Manouver}.
 */
@RestController
@RequestMapping("/api")
public class ManouverResource {

    private final Logger log = LoggerFactory.getLogger(ManouverResource.class);

    private static final String ENTITY_NAME = "manouver";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ManouverRepository manouverRepository;

    private final ManouverSearchRepository manouverSearchRepository;

    public ManouverResource(ManouverRepository manouverRepository, ManouverSearchRepository manouverSearchRepository) {
        this.manouverRepository = manouverRepository;
        this.manouverSearchRepository = manouverSearchRepository;
    }

    /**
     * {@code POST  /manouvers} : Create a new manouver.
     *
     * @param manouver the manouver to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new manouver, or with status {@code 400 (Bad Request)} if the manouver has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/manouvers")
    public ResponseEntity<Manouver> createManouver(@Valid @RequestBody Manouver manouver) throws URISyntaxException {
        log.debug("REST request to save Manouver : {}", manouver);
        if (manouver.getId() != null) {
            throw new BadRequestAlertException("A new manouver cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Manouver result = manouverRepository.save(manouver);
        manouverSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/manouvers/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /manouvers} : Updates an existing manouver.
     *
     * @param manouver the manouver to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated manouver,
     * or with status {@code 400 (Bad Request)} if the manouver is not valid,
     * or with status {@code 500 (Internal Server Error)} if the manouver couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/manouvers")
    public ResponseEntity<Manouver> updateManouver(@Valid @RequestBody Manouver manouver) throws URISyntaxException {
        log.debug("REST request to update Manouver : {}", manouver);
        if (manouver.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Manouver result = manouverRepository.save(manouver);
        manouverSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, manouver.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /manouvers} : get all the manouvers.
     *

     * @param filter the filter of the request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of manouvers in body.
     */
    @GetMapping("/manouvers")
    public List<Manouver> getAllManouvers(@RequestParam(required = false) String filter) {
        if ("manouverrequest-is-null".equals(filter)) {
            log.debug("REST request to get all Manouvers where manouverRequest is null");
            return StreamSupport
                .stream(manouverRepository.findAll().spliterator(), false)
                .filter(manouver -> manouver.getManouverRequest() == null)
                .collect(Collectors.toList());
        }
        log.debug("REST request to get all Manouvers");
        return manouverRepository.findAll();
    }

    /**
     * {@code GET  /manouvers/:id} : get the "id" manouver.
     *
     * @param id the id of the manouver to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the manouver, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/manouvers/{id}")
    public ResponseEntity<Manouver> getManouver(@PathVariable Long id) {
        log.debug("REST request to get Manouver : {}", id);
        Optional<Manouver> manouver = manouverRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(manouver);
    }

    /**
     * {@code DELETE  /manouvers/:id} : delete the "id" manouver.
     *
     * @param id the id of the manouver to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/manouvers/{id}")
    public ResponseEntity<Void> deleteManouver(@PathVariable Long id) {
        log.debug("REST request to delete Manouver : {}", id);
        manouverRepository.deleteById(id);
        manouverSearchRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }

    /**
     * {@code SEARCH  /_search/manouvers?query=:query} : search for the manouver corresponding
     * to the query.
     *
     * @param query the query of the manouver search.
     * @return the result of the search.
     */
    @GetMapping("/_search/manouvers")
    public List<Manouver> searchManouvers(@RequestParam String query) {
        log.debug("REST request to search Manouvers for query {}", query);
        return StreamSupport
            .stream(manouverSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }

}
