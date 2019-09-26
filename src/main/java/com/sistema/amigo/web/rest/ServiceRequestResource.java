package com.sistema.amigo.web.rest;

import com.sistema.amigo.domain.ServiceRequest;
import com.sistema.amigo.repository.ServiceRequestRepository;
import com.sistema.amigo.repository.search.ServiceRequestSearchRepository;
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
 * REST controller for managing {@link com.sistema.amigo.domain.ServiceRequest}.
 */
@RestController
@RequestMapping("/api")
public class ServiceRequestResource {

    private final Logger log = LoggerFactory.getLogger(ServiceRequestResource.class);

    private static final String ENTITY_NAME = "serviceRequest";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ServiceRequestRepository serviceRequestRepository;

    private final ServiceRequestSearchRepository serviceRequestSearchRepository;

    public ServiceRequestResource(ServiceRequestRepository serviceRequestRepository, ServiceRequestSearchRepository serviceRequestSearchRepository) {
        this.serviceRequestRepository = serviceRequestRepository;
        this.serviceRequestSearchRepository = serviceRequestSearchRepository;
    }

    /**
     * {@code POST  /service-requests} : Create a new serviceRequest.
     *
     * @param serviceRequest the serviceRequest to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new serviceRequest, or with status {@code 400 (Bad Request)} if the serviceRequest has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/service-requests")
    public ResponseEntity<ServiceRequest> createServiceRequest(@Valid @RequestBody ServiceRequest serviceRequest) throws URISyntaxException {
        log.debug("REST request to save ServiceRequest : {}", serviceRequest);
        if (serviceRequest.getId() != null) {
            throw new BadRequestAlertException("A new serviceRequest cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ServiceRequest result = serviceRequestRepository.save(serviceRequest);
        serviceRequestSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/service-requests/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /service-requests} : Updates an existing serviceRequest.
     *
     * @param serviceRequest the serviceRequest to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated serviceRequest,
     * or with status {@code 400 (Bad Request)} if the serviceRequest is not valid,
     * or with status {@code 500 (Internal Server Error)} if the serviceRequest couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/service-requests")
    public ResponseEntity<ServiceRequest> updateServiceRequest(@Valid @RequestBody ServiceRequest serviceRequest) throws URISyntaxException {
        log.debug("REST request to update ServiceRequest : {}", serviceRequest);
        if (serviceRequest.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        ServiceRequest result = serviceRequestRepository.save(serviceRequest);
        serviceRequestSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, serviceRequest.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /service-requests} : get all the serviceRequests.
     *

     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of serviceRequests in body.
     */
    @GetMapping("/service-requests")
    public List<ServiceRequest> getAllServiceRequests() {
        log.debug("REST request to get all ServiceRequests");
        return serviceRequestRepository.findAll();
    }

    /**
     * {@code GET  /service-requests/:id} : get the "id" serviceRequest.
     *
     * @param id the id of the serviceRequest to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the serviceRequest, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/service-requests/{id}")
    public ResponseEntity<ServiceRequest> getServiceRequest(@PathVariable Long id) {
        log.debug("REST request to get ServiceRequest : {}", id);
        Optional<ServiceRequest> serviceRequest = serviceRequestRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(serviceRequest);
    }

    /**
     * {@code DELETE  /service-requests/:id} : delete the "id" serviceRequest.
     *
     * @param id the id of the serviceRequest to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/service-requests/{id}")
    public ResponseEntity<Void> deleteServiceRequest(@PathVariable Long id) {
        log.debug("REST request to delete ServiceRequest : {}", id);
        serviceRequestRepository.deleteById(id);
        serviceRequestSearchRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }

    /**
     * {@code SEARCH  /_search/service-requests?query=:query} : search for the serviceRequest corresponding
     * to the query.
     *
     * @param query the query of the serviceRequest search.
     * @return the result of the search.
     */
    @GetMapping("/_search/service-requests")
    public List<ServiceRequest> searchServiceRequests(@RequestParam String query) {
        log.debug("REST request to search ServiceRequests for query {}", query);
        return StreamSupport
            .stream(serviceRequestSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }

}
