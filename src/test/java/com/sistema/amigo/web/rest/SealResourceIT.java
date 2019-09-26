package com.sistema.amigo.web.rest;

import com.sistema.amigo.SistemaAmigoApp;
import com.sistema.amigo.domain.Seal;
import com.sistema.amigo.repository.SealRepository;
import com.sistema.amigo.repository.search.SealSearchRepository;
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

/**
 * Integration tests for the {@link SealResource} REST controller.
 */
@SpringBootTest(classes = SistemaAmigoApp.class)
public class SealResourceIT {

    private static final String DEFAULT_ISSUER = "AAAAAAAAAA";
    private static final String UPDATED_ISSUER = "BBBBBBBBBB";

    private static final String DEFAULT_UNIQUE_ID = "AAAAAAAAAA";
    private static final String UPDATED_UNIQUE_ID = "BBBBBBBBBB";

    @Autowired
    private SealRepository sealRepository;

    /**
     * This repository is mocked in the com.sistema.amigo.repository.search test package.
     *
     * @see com.sistema.amigo.repository.search.SealSearchRepositoryMockConfiguration
     */
    @Autowired
    private SealSearchRepository mockSealSearchRepository;

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

    private MockMvc restSealMockMvc;

    private Seal seal;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final SealResource sealResource = new SealResource(sealRepository, mockSealSearchRepository);
        this.restSealMockMvc = MockMvcBuilders.standaloneSetup(sealResource)
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
    public static Seal createEntity(EntityManager em) {
        Seal seal = new Seal()
            .issuer(DEFAULT_ISSUER)
            .uniqueId(DEFAULT_UNIQUE_ID);
        return seal;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Seal createUpdatedEntity(EntityManager em) {
        Seal seal = new Seal()
            .issuer(UPDATED_ISSUER)
            .uniqueId(UPDATED_UNIQUE_ID);
        return seal;
    }

    @BeforeEach
    public void initTest() {
        seal = createEntity(em);
    }

    @Test
    @Transactional
    public void createSeal() throws Exception {
        int databaseSizeBeforeCreate = sealRepository.findAll().size();

        // Create the Seal
        restSealMockMvc.perform(post("/api/seals")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(seal)))
            .andExpect(status().isCreated());

        // Validate the Seal in the database
        List<Seal> sealList = sealRepository.findAll();
        assertThat(sealList).hasSize(databaseSizeBeforeCreate + 1);
        Seal testSeal = sealList.get(sealList.size() - 1);
        assertThat(testSeal.getIssuer()).isEqualTo(DEFAULT_ISSUER);
        assertThat(testSeal.getUniqueId()).isEqualTo(DEFAULT_UNIQUE_ID);

        // Validate the Seal in Elasticsearch
        verify(mockSealSearchRepository, times(1)).save(testSeal);
    }

    @Test
    @Transactional
    public void createSealWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = sealRepository.findAll().size();

        // Create the Seal with an existing ID
        seal.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restSealMockMvc.perform(post("/api/seals")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(seal)))
            .andExpect(status().isBadRequest());

        // Validate the Seal in the database
        List<Seal> sealList = sealRepository.findAll();
        assertThat(sealList).hasSize(databaseSizeBeforeCreate);

        // Validate the Seal in Elasticsearch
        verify(mockSealSearchRepository, times(0)).save(seal);
    }


    @Test
    @Transactional
    public void checkIssuerIsRequired() throws Exception {
        int databaseSizeBeforeTest = sealRepository.findAll().size();
        // set the field null
        seal.setIssuer(null);

        // Create the Seal, which fails.

        restSealMockMvc.perform(post("/api/seals")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(seal)))
            .andExpect(status().isBadRequest());

        List<Seal> sealList = sealRepository.findAll();
        assertThat(sealList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkUniqueIdIsRequired() throws Exception {
        int databaseSizeBeforeTest = sealRepository.findAll().size();
        // set the field null
        seal.setUniqueId(null);

        // Create the Seal, which fails.

        restSealMockMvc.perform(post("/api/seals")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(seal)))
            .andExpect(status().isBadRequest());

        List<Seal> sealList = sealRepository.findAll();
        assertThat(sealList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllSeals() throws Exception {
        // Initialize the database
        sealRepository.saveAndFlush(seal);

        // Get all the sealList
        restSealMockMvc.perform(get("/api/seals?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(seal.getId().intValue())))
            .andExpect(jsonPath("$.[*].issuer").value(hasItem(DEFAULT_ISSUER.toString())))
            .andExpect(jsonPath("$.[*].uniqueId").value(hasItem(DEFAULT_UNIQUE_ID.toString())));
    }
    
    @Test
    @Transactional
    public void getSeal() throws Exception {
        // Initialize the database
        sealRepository.saveAndFlush(seal);

        // Get the seal
        restSealMockMvc.perform(get("/api/seals/{id}", seal.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(seal.getId().intValue()))
            .andExpect(jsonPath("$.issuer").value(DEFAULT_ISSUER.toString()))
            .andExpect(jsonPath("$.uniqueId").value(DEFAULT_UNIQUE_ID.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingSeal() throws Exception {
        // Get the seal
        restSealMockMvc.perform(get("/api/seals/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateSeal() throws Exception {
        // Initialize the database
        sealRepository.saveAndFlush(seal);

        int databaseSizeBeforeUpdate = sealRepository.findAll().size();

        // Update the seal
        Seal updatedSeal = sealRepository.findById(seal.getId()).get();
        // Disconnect from session so that the updates on updatedSeal are not directly saved in db
        em.detach(updatedSeal);
        updatedSeal
            .issuer(UPDATED_ISSUER)
            .uniqueId(UPDATED_UNIQUE_ID);

        restSealMockMvc.perform(put("/api/seals")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedSeal)))
            .andExpect(status().isOk());

        // Validate the Seal in the database
        List<Seal> sealList = sealRepository.findAll();
        assertThat(sealList).hasSize(databaseSizeBeforeUpdate);
        Seal testSeal = sealList.get(sealList.size() - 1);
        assertThat(testSeal.getIssuer()).isEqualTo(UPDATED_ISSUER);
        assertThat(testSeal.getUniqueId()).isEqualTo(UPDATED_UNIQUE_ID);

        // Validate the Seal in Elasticsearch
        verify(mockSealSearchRepository, times(1)).save(testSeal);
    }

    @Test
    @Transactional
    public void updateNonExistingSeal() throws Exception {
        int databaseSizeBeforeUpdate = sealRepository.findAll().size();

        // Create the Seal

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSealMockMvc.perform(put("/api/seals")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(seal)))
            .andExpect(status().isBadRequest());

        // Validate the Seal in the database
        List<Seal> sealList = sealRepository.findAll();
        assertThat(sealList).hasSize(databaseSizeBeforeUpdate);

        // Validate the Seal in Elasticsearch
        verify(mockSealSearchRepository, times(0)).save(seal);
    }

    @Test
    @Transactional
    public void deleteSeal() throws Exception {
        // Initialize the database
        sealRepository.saveAndFlush(seal);

        int databaseSizeBeforeDelete = sealRepository.findAll().size();

        // Delete the seal
        restSealMockMvc.perform(delete("/api/seals/{id}", seal.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Seal> sealList = sealRepository.findAll();
        assertThat(sealList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the Seal in Elasticsearch
        verify(mockSealSearchRepository, times(1)).deleteById(seal.getId());
    }

    @Test
    @Transactional
    public void searchSeal() throws Exception {
        // Initialize the database
        sealRepository.saveAndFlush(seal);
        when(mockSealSearchRepository.search(queryStringQuery("id:" + seal.getId())))
            .thenReturn(Collections.singletonList(seal));
        // Search the seal
        restSealMockMvc.perform(get("/api/_search/seals?query=id:" + seal.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(seal.getId().intValue())))
            .andExpect(jsonPath("$.[*].issuer").value(hasItem(DEFAULT_ISSUER)))
            .andExpect(jsonPath("$.[*].uniqueId").value(hasItem(DEFAULT_UNIQUE_ID)));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Seal.class);
        Seal seal1 = new Seal();
        seal1.setId(1L);
        Seal seal2 = new Seal();
        seal2.setId(seal1.getId());
        assertThat(seal1).isEqualTo(seal2);
        seal2.setId(2L);
        assertThat(seal1).isNotEqualTo(seal2);
        seal1.setId(null);
        assertThat(seal1).isNotEqualTo(seal2);
    }
}
