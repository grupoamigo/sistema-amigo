package com.sistema.amigo.web.rest;

import com.sistema.amigo.domain.StateCode;
import com.sistema.amigo.repository.StateCodeRepository;
import com.sistema.amigo.repository.search.StateCodeSearchRepository;
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
 * REST controller for managing {@link com.sistema.amigo.domain.StateCode}.
 */
@RestController
@RequestMapping("/api")
public class StateCodeResource {

    private final Logger log = LoggerFactory.getLogger(StateCodeResource.class);

    private static final String ENTITY_NAME = "stateCode";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final StateCodeRepository stateCodeRepository;

    private final StateCodeSearchRepository stateCodeSearchRepository;

    public StateCodeResource(StateCodeRepository stateCodeRepository, StateCodeSearchRepository stateCodeSearchRepository) {
        this.stateCodeRepository = stateCodeRepository;
        this.stateCodeSearchRepository = stateCodeSearchRepository;
    }

    /**
     * {@code POST  /state-codes} : Create a new stateCode.
     *
     * @param stateCode the stateCode to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new stateCode, or with status {@code 400 (Bad Request)} if the stateCode has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/state-codes")
    public ResponseEntity<StateCode> createStateCode(@Valid @RequestBody StateCode stateCode) throws URISyntaxException {
        log.debug("REST request to save StateCode : {}", stateCode);
        if (stateCode.getId() != null) {
            throw new BadRequestAlertException("A new stateCode cannot already have an ID", ENTITY_NAME, "idexists");
        }
        StateCode result = stateCodeRepository.save(stateCode);
        stateCodeSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/state-codes/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /state-codes} : Updates an existing stateCode.
     *
     * @param stateCode the stateCode to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated stateCode,
     * or with status {@code 400 (Bad Request)} if the stateCode is not valid,
     * or with status {@code 500 (Internal Server Error)} if the stateCode couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/state-codes")
    public ResponseEntity<StateCode> updateStateCode(@Valid @RequestBody StateCode stateCode) throws URISyntaxException {
        log.debug("REST request to update StateCode : {}", stateCode);
        if (stateCode.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        StateCode result = stateCodeRepository.save(stateCode);
        stateCodeSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, stateCode.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /state-codes} : get all the stateCodes.
     *

     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of stateCodes in body.
     */
    @GetMapping("/state-codes")
    public List<StateCode> getAllStateCodes() {
        log.debug("REST request to get all StateCodes");
        return stateCodeRepository.findAll();
    }

    /**
     * {@code GET  /state-codes/:id} : get the "id" stateCode.
     *
     * @param id the id of the stateCode to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the stateCode, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/state-codes/{id}")
    public ResponseEntity<StateCode> getStateCode(@PathVariable Long id) {
        log.debug("REST request to get StateCode : {}", id);
        Optional<StateCode> stateCode = stateCodeRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(stateCode);
    }

    /**
     * {@code DELETE  /state-codes/:id} : delete the "id" stateCode.
     *
     * @param id the id of the stateCode to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/state-codes/{id}")
    public ResponseEntity<Void> deleteStateCode(@PathVariable Long id) {
        log.debug("REST request to delete StateCode : {}", id);
        stateCodeRepository.deleteById(id);
        stateCodeSearchRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }

    /**
     * {@code SEARCH  /_search/state-codes?query=:query} : search for the stateCode corresponding
     * to the query.
     *
     * @param query the query of the stateCode search.
     * @return the result of the search.
     */
    @GetMapping("/_search/state-codes")
    public List<StateCode> searchStateCodes(@RequestParam String query) {
        log.debug("REST request to search StateCodes for query {}", query);
        return StreamSupport
            .stream(stateCodeSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }

}
