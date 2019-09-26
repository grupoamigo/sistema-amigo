package com.sistema.amigo.web.rest;

import com.sistema.amigo.SistemaAmigoApp;
import com.sistema.amigo.domain.Evidence;
import com.sistema.amigo.repository.EvidenceRepository;
import com.sistema.amigo.repository.search.EvidenceSearchRepository;
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
import org.springframework.util.Base64Utils;
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
 * Integration tests for the {@link EvidenceResource} REST controller.
 */
@SpringBootTest(classes = SistemaAmigoApp.class)
public class EvidenceResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final byte[] DEFAULT_FILE = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_FILE = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_FILE_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_FILE_CONTENT_TYPE = "image/png";

    @Autowired
    private EvidenceRepository evidenceRepository;

    /**
     * This repository is mocked in the com.sistema.amigo.repository.search test package.
     *
     * @see com.sistema.amigo.repository.search.EvidenceSearchRepositoryMockConfiguration
     */
    @Autowired
    private EvidenceSearchRepository mockEvidenceSearchRepository;

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

    private MockMvc restEvidenceMockMvc;

    private Evidence evidence;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final EvidenceResource evidenceResource = new EvidenceResource(evidenceRepository, mockEvidenceSearchRepository);
        this.restEvidenceMockMvc = MockMvcBuilders.standaloneSetup(evidenceResource)
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
    public static Evidence createEntity(EntityManager em) {
        Evidence evidence = new Evidence()
            .name(DEFAULT_NAME)
            .file(DEFAULT_FILE)
            .fileContentType(DEFAULT_FILE_CONTENT_TYPE);
        return evidence;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Evidence createUpdatedEntity(EntityManager em) {
        Evidence evidence = new Evidence()
            .name(UPDATED_NAME)
            .file(UPDATED_FILE)
            .fileContentType(UPDATED_FILE_CONTENT_TYPE);
        return evidence;
    }

    @BeforeEach
    public void initTest() {
        evidence = createEntity(em);
    }

    @Test
    @Transactional
    public void createEvidence() throws Exception {
        int databaseSizeBeforeCreate = evidenceRepository.findAll().size();

        // Create the Evidence
        restEvidenceMockMvc.perform(post("/api/evidences")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(evidence)))
            .andExpect(status().isCreated());

        // Validate the Evidence in the database
        List<Evidence> evidenceList = evidenceRepository.findAll();
        assertThat(evidenceList).hasSize(databaseSizeBeforeCreate + 1);
        Evidence testEvidence = evidenceList.get(evidenceList.size() - 1);
        assertThat(testEvidence.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testEvidence.getFile()).isEqualTo(DEFAULT_FILE);
        assertThat(testEvidence.getFileContentType()).isEqualTo(DEFAULT_FILE_CONTENT_TYPE);

        // Validate the Evidence in Elasticsearch
        verify(mockEvidenceSearchRepository, times(1)).save(testEvidence);
    }

    @Test
    @Transactional
    public void createEvidenceWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = evidenceRepository.findAll().size();

        // Create the Evidence with an existing ID
        evidence.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restEvidenceMockMvc.perform(post("/api/evidences")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(evidence)))
            .andExpect(status().isBadRequest());

        // Validate the Evidence in the database
        List<Evidence> evidenceList = evidenceRepository.findAll();
        assertThat(evidenceList).hasSize(databaseSizeBeforeCreate);

        // Validate the Evidence in Elasticsearch
        verify(mockEvidenceSearchRepository, times(0)).save(evidence);
    }


    @Test
    @Transactional
    public void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = evidenceRepository.findAll().size();
        // set the field null
        evidence.setName(null);

        // Create the Evidence, which fails.

        restEvidenceMockMvc.perform(post("/api/evidences")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(evidence)))
            .andExpect(status().isBadRequest());

        List<Evidence> evidenceList = evidenceRepository.findAll();
        assertThat(evidenceList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllEvidences() throws Exception {
        // Initialize the database
        evidenceRepository.saveAndFlush(evidence);

        // Get all the evidenceList
        restEvidenceMockMvc.perform(get("/api/evidences?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(evidence.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].fileContentType").value(hasItem(DEFAULT_FILE_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].file").value(hasItem(Base64Utils.encodeToString(DEFAULT_FILE))));
    }
    
    @Test
    @Transactional
    public void getEvidence() throws Exception {
        // Initialize the database
        evidenceRepository.saveAndFlush(evidence);

        // Get the evidence
        restEvidenceMockMvc.perform(get("/api/evidences/{id}", evidence.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(evidence.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()))
            .andExpect(jsonPath("$.fileContentType").value(DEFAULT_FILE_CONTENT_TYPE))
            .andExpect(jsonPath("$.file").value(Base64Utils.encodeToString(DEFAULT_FILE)));
    }

    @Test
    @Transactional
    public void getNonExistingEvidence() throws Exception {
        // Get the evidence
        restEvidenceMockMvc.perform(get("/api/evidences/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateEvidence() throws Exception {
        // Initialize the database
        evidenceRepository.saveAndFlush(evidence);

        int databaseSizeBeforeUpdate = evidenceRepository.findAll().size();

        // Update the evidence
        Evidence updatedEvidence = evidenceRepository.findById(evidence.getId()).get();
        // Disconnect from session so that the updates on updatedEvidence are not directly saved in db
        em.detach(updatedEvidence);
        updatedEvidence
            .name(UPDATED_NAME)
            .file(UPDATED_FILE)
            .fileContentType(UPDATED_FILE_CONTENT_TYPE);

        restEvidenceMockMvc.perform(put("/api/evidences")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedEvidence)))
            .andExpect(status().isOk());

        // Validate the Evidence in the database
        List<Evidence> evidenceList = evidenceRepository.findAll();
        assertThat(evidenceList).hasSize(databaseSizeBeforeUpdate);
        Evidence testEvidence = evidenceList.get(evidenceList.size() - 1);
        assertThat(testEvidence.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testEvidence.getFile()).isEqualTo(UPDATED_FILE);
        assertThat(testEvidence.getFileContentType()).isEqualTo(UPDATED_FILE_CONTENT_TYPE);

        // Validate the Evidence in Elasticsearch
        verify(mockEvidenceSearchRepository, times(1)).save(testEvidence);
    }

    @Test
    @Transactional
    public void updateNonExistingEvidence() throws Exception {
        int databaseSizeBeforeUpdate = evidenceRepository.findAll().size();

        // Create the Evidence

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEvidenceMockMvc.perform(put("/api/evidences")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(evidence)))
            .andExpect(status().isBadRequest());

        // Validate the Evidence in the database
        List<Evidence> evidenceList = evidenceRepository.findAll();
        assertThat(evidenceList).hasSize(databaseSizeBeforeUpdate);

        // Validate the Evidence in Elasticsearch
        verify(mockEvidenceSearchRepository, times(0)).save(evidence);
    }

    @Test
    @Transactional
    public void deleteEvidence() throws Exception {
        // Initialize the database
        evidenceRepository.saveAndFlush(evidence);

        int databaseSizeBeforeDelete = evidenceRepository.findAll().size();

        // Delete the evidence
        restEvidenceMockMvc.perform(delete("/api/evidences/{id}", evidence.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Evidence> evidenceList = evidenceRepository.findAll();
        assertThat(evidenceList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the Evidence in Elasticsearch
        verify(mockEvidenceSearchRepository, times(1)).deleteById(evidence.getId());
    }

    @Test
    @Transactional
    public void searchEvidence() throws Exception {
        // Initialize the database
        evidenceRepository.saveAndFlush(evidence);
        when(mockEvidenceSearchRepository.search(queryStringQuery("id:" + evidence.getId())))
            .thenReturn(Collections.singletonList(evidence));
        // Search the evidence
        restEvidenceMockMvc.perform(get("/api/_search/evidences?query=id:" + evidence.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(evidence.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].fileContentType").value(hasItem(DEFAULT_FILE_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].file").value(hasItem(Base64Utils.encodeToString(DEFAULT_FILE))));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Evidence.class);
        Evidence evidence1 = new Evidence();
        evidence1.setId(1L);
        Evidence evidence2 = new Evidence();
        evidence2.setId(evidence1.getId());
        assertThat(evidence1).isEqualTo(evidence2);
        evidence2.setId(2L);
        assertThat(evidence1).isNotEqualTo(evidence2);
        evidence1.setId(null);
        assertThat(evidence1).isNotEqualTo(evidence2);
    }
}
