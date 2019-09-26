package com.sistema.amigo.web.rest;

import com.sistema.amigo.domain.Evidence;
import com.sistema.amigo.repository.EvidenceRepository;
import com.sistema.amigo.repository.search.EvidenceSearchRepository;
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
 * REST controller for managing {@link com.sistema.amigo.domain.Evidence}.
 */
@RestController
@RequestMapping("/api")
public class EvidenceResource {

    private final Logger log = LoggerFactory.getLogger(EvidenceResource.class);

    private static final String ENTITY_NAME = "evidence";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final EvidenceRepository evidenceRepository;

    private final EvidenceSearchRepository evidenceSearchRepository;

    public EvidenceResource(EvidenceRepository evidenceRepository, EvidenceSearchRepository evidenceSearchRepository) {
        this.evidenceRepository = evidenceRepository;
        this.evidenceSearchRepository = evidenceSearchRepository;
    }

    /**
     * {@code POST  /evidences} : Create a new evidence.
     *
     * @param evidence the evidence to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new evidence, or with status {@code 400 (Bad Request)} if the evidence has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/evidences")
    public ResponseEntity<Evidence> createEvidence(@Valid @RequestBody Evidence evidence) throws URISyntaxException {
        log.debug("REST request to save Evidence : {}", evidence);
        if (evidence.getId() != null) {
            throw new BadRequestAlertException("A new evidence cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Evidence result = evidenceRepository.save(evidence);
        evidenceSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/evidences/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /evidences} : Updates an existing evidence.
     *
     * @param evidence the evidence to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated evidence,
     * or with status {@code 400 (Bad Request)} if the evidence is not valid,
     * or with status {@code 500 (Internal Server Error)} if the evidence couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/evidences")
    public ResponseEntity<Evidence> updateEvidence(@Valid @RequestBody Evidence evidence) throws URISyntaxException {
        log.debug("REST request to update Evidence : {}", evidence);
        if (evidence.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Evidence result = evidenceRepository.save(evidence);
        evidenceSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, evidence.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /evidences} : get all the evidences.
     *

     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of evidences in body.
     */
    @GetMapping("/evidences")
    public List<Evidence> getAllEvidences() {
        log.debug("REST request to get all Evidences");
        return evidenceRepository.findAll();
    }

    /**
     * {@code GET  /evidences/:id} : get the "id" evidence.
     *
     * @param id the id of the evidence to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the evidence, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/evidences/{id}")
    public ResponseEntity<Evidence> getEvidence(@PathVariable Long id) {
        log.debug("REST request to get Evidence : {}", id);
        Optional<Evidence> evidence = evidenceRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(evidence);
    }

    /**
     * {@code DELETE  /evidences/:id} : delete the "id" evidence.
     *
     * @param id the id of the evidence to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/evidences/{id}")
    public ResponseEntity<Void> deleteEvidence(@PathVariable Long id) {
        log.debug("REST request to delete Evidence : {}", id);
        evidenceRepository.deleteById(id);
        evidenceSearchRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }

    /**
     * {@code SEARCH  /_search/evidences?query=:query} : search for the evidence corresponding
     * to the query.
     *
     * @param query the query of the evidence search.
     * @return the result of the search.
     */
    @GetMapping("/_search/evidences")
    public List<Evidence> searchEvidences(@RequestParam String query) {
        log.debug("REST request to search Evidences for query {}", query);
        return StreamSupport
            .stream(evidenceSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }

}
