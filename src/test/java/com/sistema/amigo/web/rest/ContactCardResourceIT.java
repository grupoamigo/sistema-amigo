package com.sistema.amigo.web.rest;

import com.sistema.amigo.SistemaAmigoApp;
import com.sistema.amigo.domain.ContactCard;
import com.sistema.amigo.repository.ContactCardRepository;
import com.sistema.amigo.repository.search.ContactCardSearchRepository;
import com.sistema.amigo.web.rest.errors.ExceptionTranslator;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.Validator;

import javax.persistence.EntityManager;
import java.util.Collections;
import java.util.List;

import static com.sistema.amigo.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.sistema.amigo.domain.enumeration.ContactType;
/**
 * Integration tests for the {@link ContactCardResource} REST controller.
 */
@SpringBootTest(classes = SistemaAmigoApp.class)
public class ContactCardResourceIT {

    private static final ContactType DEFAULT_TYPE = ContactType.TELEFONO;
    private static final ContactType UPDATED_TYPE = ContactType.EMAIL;

    private static final String DEFAULT_VALUE = "AAAAAAAAAA";
    private static final String UPDATED_VALUE = "BBBBBBBBBB";

    @Autowired
    private ContactCardRepository contactCardRepository;

    /**
     * This repository is mocked in the com.sistema.amigo.repository.search test package.
     *
     * @see com.sistema.amigo.repository.search.ContactCardSearchRepositoryMockConfiguration
     */
    @Autowired
    private ContactCardSearchRepository mockContactCardSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    @Autowired
    private Validator validator;

    private MockMvc restContactCardMockMvc;

    private ContactCard contactCard;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final ContactCardResource contactCardResource = new ContactCardResource(contactCardRepository, mockContactCardSearchRepository);
        this.restContactCardMockMvc = MockMvcBuilders.standaloneSetup(contactCardResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter)
            .setValidator(validator).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ContactCard createEntity(EntityManager em) {
        ContactCard contactCard = new ContactCard()
            .type(DEFAULT_TYPE)
            .value(DEFAULT_VALUE);
        return contactCard;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ContactCard createUpdatedEntity(EntityManager em) {
        ContactCard contactCard = new ContactCard()
            .type(UPDATED_TYPE)
            .value(UPDATED_VALUE);
        return contactCard;
    }

    @BeforeEach
    public void initTest() {
        contactCard = createEntity(em);
    }

    @Test
    @Transactional
    public void createContactCard() throws Exception {
        int databaseSizeBeforeCreate = contactCardRepository.findAll().size();

        // Create the ContactCard
        restContactCardMockMvc.perform(post("/api/contact-cards")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(contactCard)))
            .andExpect(status().isCreated());

        // Validate the ContactCard in the database
        List<ContactCard> contactCardList = contactCardRepository.findAll();
        assertThat(contactCardList).hasSize(databaseSizeBeforeCreate + 1);
        ContactCard testContactCard = contactCardList.get(contactCardList.size() - 1);
        assertThat(testContactCard.getType()).isEqualTo(DEFAULT_TYPE);
        assertThat(testContactCard.getValue()).isEqualTo(DEFAULT_VALUE);

        // Validate the ContactCard in Elasticsearch
        verify(mockContactCardSearchRepository, times(1)).save(testContactCard);
    }

    @Test
    @Transactional
    public void createContactCardWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = contactCardRepository.findAll().size();

        // Create the ContactCard with an existing ID
        contactCard.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restContactCardMockMvc.perform(post("/api/contact-cards")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(contactCard)))
            .andExpect(status().isBadRequest());

        // Validate the ContactCard in the database
        List<ContactCard> contactCardList = contactCardRepository.findAll();
        assertThat(contactCardList).hasSize(databaseSizeBeforeCreate);

        // Validate the ContactCard in Elasticsearch
        verify(mockContactCardSearchRepository, times(0)).save(contactCard);
    }


    @Test
    @Transactional
    public void checkTypeIsRequired() throws Exception {
        int databaseSizeBeforeTest = contactCardRepository.findAll().size();
        // set the field null
        contactCard.setType(null);

        // Create the ContactCard, which fails.

        restContactCardMockMvc.perform(post("/api/contact-cards")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(contactCard)))
            .andExpect(status().isBadRequest());

        List<ContactCard> contactCardList = contactCardRepository.findAll();
        assertThat(contactCardList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkValueIsRequired() throws Exception {
        int databaseSizeBeforeTest = contactCardRepository.findAll().size();
        // set the field null
        contactCard.setValue(null);

        // Create the ContactCard, which fails.

        restContactCardMockMvc.perform(post("/api/contact-cards")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(contactCard)))
            .andExpect(status().isBadRequest());

        List<ContactCard> contactCardList = contactCardRepository.findAll();
        assertThat(contactCardList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllContactCards() throws Exception {
        // Initialize the database
        contactCardRepository.saveAndFlush(contactCard);

        // Get all the contactCardList
        restContactCardMockMvc.perform(get("/api/contact-cards?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(contactCard.getId().intValue())))
            .andExpect(jsonPath("$.[*].type").value(hasItem(DEFAULT_TYPE.toString())))
            .andExpect(jsonPath("$.[*].value").value(hasItem(DEFAULT_VALUE.toString())));
    }
    
    @Test
    @Transactional
    public void getContactCard() throws Exception {
        // Initialize the database
        contactCardRepository.saveAndFlush(contactCard);

        // Get the contactCard
        restContactCardMockMvc.perform(get("/api/contact-cards/{id}", contactCard.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(contactCard.getId().intValue()))
            .andExpect(jsonPath("$.type").value(DEFAULT_TYPE.toString()))
            .andExpect(jsonPath("$.value").value(DEFAULT_VALUE.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingContactCard() throws Exception {
        // Get the contactCard
        restContactCardMockMvc.perform(get("/api/contact-cards/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateContactCard() throws Exception {
        // Initialize the database
        contactCardRepository.saveAndFlush(contactCard);

        int databaseSizeBeforeUpdate = contactCardRepository.findAll().size();

        // Update the contactCard
        ContactCard updatedContactCard = contactCardRepository.findById(contactCard.getId()).get();
        // Disconnect from session so that the updates on updatedContactCard are not directly saved in db
        em.detach(updatedContactCard);
        updatedContactCard
            .type(UPDATED_TYPE)
            .value(UPDATED_VALUE);

        restContactCardMockMvc.perform(put("/api/contact-cards")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedContactCard)))
            .andExpect(status().isOk());

        // Validate the ContactCard in the database
        List<ContactCard> contactCardList = contactCardRepository.findAll();
        assertThat(contactCardList).hasSize(databaseSizeBeforeUpdate);
        ContactCard testContactCard = contactCardList.get(contactCardList.size() - 1);
        assertThat(testContactCard.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testContactCard.getValue()).isEqualTo(UPDATED_VALUE);

        // Validate the ContactCard in Elasticsearch
        verify(mockContactCardSearchRepository, times(1)).save(testContactCard);
    }

    @Test
    @Transactional
    public void updateNonExistingContactCard() throws Exception {
        int databaseSizeBeforeUpdate = contactCardRepository.findAll().size();

        // Create the ContactCard

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restContactCardMockMvc.perform(put("/api/contact-cards")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(contactCard)))
            .andExpect(status().isBadRequest());

        // Validate the ContactCard in the database
        List<ContactCard> contactCardList = contactCardRepository.findAll();
        assertThat(contactCardList).hasSize(databaseSizeBeforeUpdate);

        // Validate the ContactCard in Elasticsearch
        verify(mockContactCardSearchRepository, times(0)).save(contactCard);
    }

    @Test
    @Transactional
    public void deleteContactCard() throws Exception {
        // Initialize the database
        contactCardRepository.saveAndFlush(contactCard);

        int databaseSizeBeforeDelete = contactCardRepository.findAll().size();

        // Delete the contactCard
        restContactCardMockMvc.perform(delete("/api/contact-cards/{id}", contactCard.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ContactCard> contactCardList = contactCardRepository.findAll();
        assertThat(contactCardList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the ContactCard in Elasticsearch
        verify(mockContactCardSearchRepository, times(1)).deleteById(contactCard.getId());
    }

    @Test
    @Transactional
    public void searchContactCard() throws Exception {
        // Initialize the database
        contactCardRepository.saveAndFlush(contactCard);
        when(mockContactCardSearchRepository.search(queryStringQuery("id:" + contactCard.getId())))
            .thenReturn(Collections.singletonList(contactCard));
        // Search the contactCard
        restContactCardMockMvc.perform(get("/api/_search/contact-cards?query=id:" + contactCard.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(contactCard.getId().intValue())))
            .andExpect(jsonPath("$.[*].type").value(hasItem(DEFAULT_TYPE.toString())))
            .andExpect(jsonPath("$.[*].value").value(hasItem(DEFAULT_VALUE)));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ContactCard.class);
        ContactCard contactCard1 = new ContactCard();
        contactCard1.setId(1L);
        ContactCard contactCard2 = new ContactCard();
        contactCard2.setId(contactCard1.getId());
        assertThat(contactCard1).isEqualTo(contactCard2);
        contactCard2.setId(2L);
        assertThat(contactCard1).isNotEqualTo(contactCard2);
        contactCard1.setId(null);
        assertThat(contactCard1).isNotEqualTo(contactCard2);
    }
}
