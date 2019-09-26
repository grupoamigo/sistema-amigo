package com.sistema.amigo.web.rest;

import com.sistema.amigo.domain.ContactCard;
import com.sistema.amigo.repository.ContactCardRepository;
import com.sistema.amigo.repository.search.ContactCardSearchRepository;
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
 * REST controller for managing {@link com.sistema.amigo.domain.ContactCard}.
 */
@RestController
@RequestMapping("/api")
public class ContactCardResource {

    private final Logger log = LoggerFactory.getLogger(ContactCardResource.class);

    private static final String ENTITY_NAME = "contactCard";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ContactCardRepository contactCardRepository;

    private final ContactCardSearchRepository contactCardSearchRepository;

    public ContactCardResource(ContactCardRepository contactCardRepository, ContactCardSearchRepository contactCardSearchRepository) {
        this.contactCardRepository = contactCardRepository;
        this.contactCardSearchRepository = contactCardSearchRepository;
    }

    /**
     * {@code POST  /contact-cards} : Create a new contactCard.
     *
     * @param contactCard the contactCard to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new contactCard, or with status {@code 400 (Bad Request)} if the contactCard has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/contact-cards")
    public ResponseEntity<ContactCard> createContactCard(@Valid @RequestBody ContactCard contactCard) throws URISyntaxException {
        log.debug("REST request to save ContactCard : {}", contactCard);
        if (contactCard.getId() != null) {
            throw new BadRequestAlertException("A new contactCard cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ContactCard result = contactCardRepository.save(contactCard);
        contactCardSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/contact-cards/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /contact-cards} : Updates an existing contactCard.
     *
     * @param contactCard the contactCard to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated contactCard,
     * or with status {@code 400 (Bad Request)} if the contactCard is not valid,
     * or with status {@code 500 (Internal Server Error)} if the contactCard couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/contact-cards")
    public ResponseEntity<ContactCard> updateContactCard(@Valid @RequestBody ContactCard contactCard) throws URISyntaxException {
        log.debug("REST request to update ContactCard : {}", contactCard);
        if (contactCard.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        ContactCard result = contactCardRepository.save(contactCard);
        contactCardSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, contactCard.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /contact-cards} : get all the contactCards.
     *

     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of contactCards in body.
     */
    @GetMapping("/contact-cards")
    public List<ContactCard> getAllContactCards() {
        log.debug("REST request to get all ContactCards");
        return contactCardRepository.findAll();
    }

    /**
     * {@code GET  /contact-cards/:id} : get the "id" contactCard.
     *
     * @param id the id of the contactCard to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the contactCard, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/contact-cards/{id}")
    public ResponseEntity<ContactCard> getContactCard(@PathVariable Long id) {
        log.debug("REST request to get ContactCard : {}", id);
        Optional<ContactCard> contactCard = contactCardRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(contactCard);
    }

    /**
     * {@code DELETE  /contact-cards/:id} : delete the "id" contactCard.
     *
     * @param id the id of the contactCard to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/contact-cards/{id}")
    public ResponseEntity<Void> deleteContactCard(@PathVariable Long id) {
        log.debug("REST request to delete ContactCard : {}", id);
        contactCardRepository.deleteById(id);
        contactCardSearchRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }

    /**
     * {@code SEARCH  /_search/contact-cards?query=:query} : search for the contactCard corresponding
     * to the query.
     *
     * @param query the query of the contactCard search.
     * @return the result of the search.
     */
    @GetMapping("/_search/contact-cards")
    public List<ContactCard> searchContactCards(@RequestParam String query) {
        log.debug("REST request to search ContactCards for query {}", query);
        return StreamSupport
            .stream(contactCardSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }

}
