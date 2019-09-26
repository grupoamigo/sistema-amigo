package com.sistema.amigo.web.rest;

import com.sistema.amigo.domain.ManouverRequest;
import com.sistema.amigo.repository.ManouverRequestRepository;
import com.sistema.amigo.repository.search.ManouverRequestSearchRepository;
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
 * REST controller for managing {@link com.sistema.amigo.domain.ManouverRequest}.
 */
@RestController
@RequestMapping("/api")
public class ManouverRequestResource {

    private final Logger log = LoggerFactory.getLogger(ManouverRequestResource.class);

    private static final String ENTITY_NAME = "manouverRequest";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ManouverRequestRepository manouverRequestRepository;

    private final ManouverRequestSearchRepository manouverRequestSearchRepository;

    public ManouverRequestResource(ManouverRequestRepository manouverRequestRepository, ManouverRequestSearchRepository manouverRequestSearchRepository) {
        this.manouverRequestRepository = manouverRequestRepository;
        this.manouverRequestSearchRepository = manouverRequestSearchRepository;
    }

    /**
     * {@code POST  /manouver-requests} : Create a new manouverRequest.
     *
     * @param manouverRequest the manouverRequest to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new manouverRequest, or with status {@code 400 (Bad Request)} if the manouverRequest has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/manouver-requests")
    public ResponseEntity<ManouverRequest> createManouverRequest(@Valid @RequestBody ManouverRequest manouverRequest) throws URISyntaxException {
        log.debug("REST request to save ManouverRequest : {}", manouverRequest);
        if (manouverRequest.getId() != null) {
            throw new BadRequestAlertException("A new manouverRequest cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ManouverRequest result = manouverRequestRepository.save(manouverRequest);
        manouverRequestSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/manouver-requests/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /manouver-requests} : Updates an existing manouverRequest.
     *
     * @param manouverRequest the manouverRequest to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated manouverRequest,
     * or with status {@code 400 (Bad Request)} if the manouverRequest is not valid,
     * or with status {@code 500 (Internal Server Error)} if the manouverRequest couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/manouver-requests")
    public ResponseEntity<ManouverRequest> updateManouverRequest(@Valid @RequestBody ManouverRequest manouverRequest) throws URISyntaxException {
        log.debug("REST request to update ManouverRequest : {}", manouverRequest);
        if (manouverRequest.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        ManouverRequest result = manouverRequestRepository.save(manouverRequest);
        manouverRequestSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, manouverRequest.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /manouver-requests} : get all the manouverRequests.
     *

     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of manouverRequests in body.
     */
    @GetMapping("/manouver-requests")
    public List<ManouverRequest> getAllManouverRequests() {
        log.debug("REST request to get all ManouverRequests");
        return manouverRequestRepository.findAll();
    }

    /**
     * {@code GET  /manouver-requests/:id} : get the "id" manouverRequest.
     *
     * @param id the id of the manouverRequest to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the manouverRequest, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/manouver-requests/{id}")
    public ResponseEntity<ManouverRequest> getManouverRequest(@PathVariable Long id) {
        log.debug("REST request to get ManouverRequest : {}", id);
        Optional<ManouverRequest> manouverRequest = manouverRequestRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(manouverRequest);
    }

    /**
     * {@code DELETE  /manouver-requests/:id} : delete the "id" manouverRequest.
     *
     * @param id the id of the manouverRequest to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/manouver-requests/{id}")
    public ResponseEntity<Void> deleteManouverRequest(@PathVariable Long id) {
        log.debug("REST request to delete ManouverRequest : {}", id);
        manouverRequestRepository.deleteById(id);
        manouverRequestSearchRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }

    /**
     * {@code SEARCH  /_search/manouver-requests?query=:query} : search for the manouverRequest corresponding
     * to the query.
     *
     * @param query the query of the manouverRequest search.
     * @return the result of the search.
     */
    @GetMapping("/_search/manouver-requests")
    public List<ManouverRequest> searchManouverRequests(@RequestParam String query) {
        log.debug("REST request to search ManouverRequests for query {}", query);
        return StreamSupport
            .stream(manouverRequestSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }

}
