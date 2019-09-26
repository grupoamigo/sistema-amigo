package com.sistema.amigo.web.rest;

import com.sistema.amigo.domain.Contract;
import com.sistema.amigo.repository.ContractRepository;
import com.sistema.amigo.repository.search.ContractSearchRepository;
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
 * REST controller for managing {@link com.sistema.amigo.domain.Contract}.
 */
@RestController
@RequestMapping("/api")
public class ContractResource {

    private final Logger log = LoggerFactory.getLogger(ContractResource.class);

    private static final String ENTITY_NAME = "contract";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ContractRepository contractRepository;

    private final ContractSearchRepository contractSearchRepository;

    public ContractResource(ContractRepository contractRepository, ContractSearchRepository contractSearchRepository) {
        this.contractRepository = contractRepository;
        this.contractSearchRepository = contractSearchRepository;
    }

    /**
     * {@code POST  /contracts} : Create a new contract.
     *
     * @param contract the contract to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new contract, or with status {@code 400 (Bad Request)} if the contract has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/contracts")
    public ResponseEntity<Contract> createContract(@Valid @RequestBody Contract contract) throws URISyntaxException {
        log.debug("REST request to save Contract : {}", contract);
        if (contract.getId() != null) {
            throw new BadRequestAlertException("A new contract cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Contract result = contractRepository.save(contract);
        contractSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/contracts/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /contracts} : Updates an existing contract.
     *
     * @param contract the contract to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated contract,
     * or with status {@code 400 (Bad Request)} if the contract is not valid,
     * or with status {@code 500 (Internal Server Error)} if the contract couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/contracts")
    public ResponseEntity<Contract> updateContract(@Valid @RequestBody Contract contract) throws URISyntaxException {
        log.debug("REST request to update Contract : {}", contract);
        if (contract.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Contract result = contractRepository.save(contract);
        contractSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, contract.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /contracts} : get all the contracts.
     *

     * @param filter the filter of the request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of contracts in body.
     */
    @GetMapping("/contracts")
    public List<Contract> getAllContracts(@RequestParam(required = false) String filter) {
        if ("servicequote-is-null".equals(filter)) {
            log.debug("REST request to get all Contracts where serviceQuote is null");
            return StreamSupport
                .stream(contractRepository.findAll().spliterator(), false)
                .filter(contract -> contract.getServiceQuote() == null)
                .collect(Collectors.toList());
        }
        log.debug("REST request to get all Contracts");
        return contractRepository.findAll();
    }

    /**
     * {@code GET  /contracts/:id} : get the "id" contract.
     *
     * @param id the id of the contract to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the contract, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/contracts/{id}")
    public ResponseEntity<Contract> getContract(@PathVariable Long id) {
        log.debug("REST request to get Contract : {}", id);
        Optional<Contract> contract = contractRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(contract);
    }

    /**
     * {@code DELETE  /contracts/:id} : delete the "id" contract.
     *
     * @param id the id of the contract to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/contracts/{id}")
    public ResponseEntity<Void> deleteContract(@PathVariable Long id) {
        log.debug("REST request to delete Contract : {}", id);
        contractRepository.deleteById(id);
        contractSearchRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }

    /**
     * {@code SEARCH  /_search/contracts?query=:query} : search for the contract corresponding
     * to the query.
     *
     * @param query the query of the contract search.
     * @return the result of the search.
     */
    @GetMapping("/_search/contracts")
    public List<Contract> searchContracts(@RequestParam String query) {
        log.debug("REST request to search Contracts for query {}", query);
        return StreamSupport
            .stream(contractSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }

}
