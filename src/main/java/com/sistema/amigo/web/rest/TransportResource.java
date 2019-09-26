package com.sistema.amigo.web.rest;

import com.sistema.amigo.domain.Transport;
import com.sistema.amigo.repository.TransportRepository;
import com.sistema.amigo.repository.search.TransportSearchRepository;
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
 * REST controller for managing {@link com.sistema.amigo.domain.Transport}.
 */
@RestController
@RequestMapping("/api")
public class TransportResource {

    private final Logger log = LoggerFactory.getLogger(TransportResource.class);

    private static final String ENTITY_NAME = "transport";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final TransportRepository transportRepository;

    private final TransportSearchRepository transportSearchRepository;

    public TransportResource(TransportRepository transportRepository, TransportSearchRepository transportSearchRepository) {
        this.transportRepository = transportRepository;
        this.transportSearchRepository = transportSearchRepository;
    }

    /**
     * {@code POST  /transports} : Create a new transport.
     *
     * @param transport the transport to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new transport, or with status {@code 400 (Bad Request)} if the transport has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/transports")
    public ResponseEntity<Transport> createTransport(@Valid @RequestBody Transport transport) throws URISyntaxException {
        log.debug("REST request to save Transport : {}", transport);
        if (transport.getId() != null) {
            throw new BadRequestAlertException("A new transport cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Transport result = transportRepository.save(transport);
        transportSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/transports/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /transports} : Updates an existing transport.
     *
     * @param transport the transport to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated transport,
     * or with status {@code 400 (Bad Request)} if the transport is not valid,
     * or with status {@code 500 (Internal Server Error)} if the transport couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/transports")
    public ResponseEntity<Transport> updateTransport(@Valid @RequestBody Transport transport) throws URISyntaxException {
        log.debug("REST request to update Transport : {}", transport);
        if (transport.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Transport result = transportRepository.save(transport);
        transportSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, transport.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /transports} : get all the transports.
     *

     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of transports in body.
     */
    @GetMapping("/transports")
    public List<Transport> getAllTransports() {
        log.debug("REST request to get all Transports");
        return transportRepository.findAll();
    }

    /**
     * {@code GET  /transports/:id} : get the "id" transport.
     *
     * @param id the id of the transport to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the transport, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/transports/{id}")
    public ResponseEntity<Transport> getTransport(@PathVariable Long id) {
        log.debug("REST request to get Transport : {}", id);
        Optional<Transport> transport = transportRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(transport);
    }

    /**
     * {@code DELETE  /transports/:id} : delete the "id" transport.
     *
     * @param id the id of the transport to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/transports/{id}")
    public ResponseEntity<Void> deleteTransport(@PathVariable Long id) {
        log.debug("REST request to delete Transport : {}", id);
        transportRepository.deleteById(id);
        transportSearchRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }

    /**
     * {@code SEARCH  /_search/transports?query=:query} : search for the transport corresponding
     * to the query.
     *
     * @param query the query of the transport search.
     * @return the result of the search.
     */
    @GetMapping("/_search/transports")
    public List<Transport> searchTransports(@RequestParam String query) {
        log.debug("REST request to search Transports for query {}", query);
        return StreamSupport
            .stream(transportSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }

}
