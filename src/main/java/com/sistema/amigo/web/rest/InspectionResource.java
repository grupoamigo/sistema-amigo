package com.sistema.amigo.web.rest;

import com.sistema.amigo.domain.Inspection;
import com.sistema.amigo.repository.InspectionRepository;
import com.sistema.amigo.repository.search.InspectionSearchRepository;
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
 * REST controller for managing {@link com.sistema.amigo.domain.Inspection}.
 */
@RestController
@RequestMapping("/api")
public class InspectionResource {

    private final Logger log = LoggerFactory.getLogger(InspectionResource.class);

    private static final String ENTITY_NAME = "inspection";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final InspectionRepository inspectionRepository;

    private final InspectionSearchRepository inspectionSearchRepository;

    public InspectionResource(InspectionRepository inspectionRepository, InspectionSearchRepository inspectionSearchRepository) {
        this.inspectionRepository = inspectionRepository;
        this.inspectionSearchRepository = inspectionSearchRepository;
    }

    /**
     * {@code POST  /inspections} : Create a new inspection.
     *
     * @param inspection the inspection to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new inspection, or with status {@code 400 (Bad Request)} if the inspection has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/inspections")
    public ResponseEntity<Inspection> createInspection(@Valid @RequestBody Inspection inspection) throws URISyntaxException {
        log.debug("REST request to save Inspection : {}", inspection);
        if (inspection.getId() != null) {
            throw new BadRequestAlertException("A new inspection cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Inspection result = inspectionRepository.save(inspection);
        inspectionSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/inspections/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /inspections} : Updates an existing inspection.
     *
     * @param inspection the inspection to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated inspection,
     * or with status {@code 400 (Bad Request)} if the inspection is not valid,
     * or with status {@code 500 (Internal Server Error)} if the inspection couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/inspections")
    public ResponseEntity<Inspection> updateInspection(@Valid @RequestBody Inspection inspection) throws URISyntaxException {
        log.debug("REST request to update Inspection : {}", inspection);
        if (inspection.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Inspection result = inspectionRepository.save(inspection);
        inspectionSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, inspection.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /inspections} : get all the inspections.
     *

     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of inspections in body.
     */
    @GetMapping("/inspections")
    public List<Inspection> getAllInspections() {
        log.debug("REST request to get all Inspections");
        return inspectionRepository.findAll();
    }

    /**
     * {@code GET  /inspections/:id} : get the "id" inspection.
     *
     * @param id the id of the inspection to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the inspection, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/inspections/{id}")
    public ResponseEntity<Inspection> getInspection(@PathVariable Long id) {
        log.debug("REST request to get Inspection : {}", id);
        Optional<Inspection> inspection = inspectionRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(inspection);
    }

    /**
     * {@code DELETE  /inspections/:id} : delete the "id" inspection.
     *
     * @param id the id of the inspection to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/inspections/{id}")
    public ResponseEntity<Void> deleteInspection(@PathVariable Long id) {
        log.debug("REST request to delete Inspection : {}", id);
        inspectionRepository.deleteById(id);
        inspectionSearchRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }

    /**
     * {@code SEARCH  /_search/inspections?query=:query} : search for the inspection corresponding
     * to the query.
     *
     * @param query the query of the inspection search.
     * @return the result of the search.
     */
    @GetMapping("/_search/inspections")
    public List<Inspection> searchInspections(@RequestParam String query) {
        log.debug("REST request to search Inspections for query {}", query);
        return StreamSupport
            .stream(inspectionSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }

}
