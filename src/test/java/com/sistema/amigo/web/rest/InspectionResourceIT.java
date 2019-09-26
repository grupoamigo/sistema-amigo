package com.sistema.amigo.web.rest;

import com.sistema.amigo.SistemaAmigoApp;
import com.sistema.amigo.domain.Inspection;
import com.sistema.amigo.repository.InspectionRepository;
import com.sistema.amigo.repository.search.InspectionSearchRepository;
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
import java.time.Instant;
import java.time.temporal.ChronoUnit;
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
 * Integration tests for the {@link InspectionResource} REST controller.
 */
@SpringBootTest(classes = SistemaAmigoApp.class)
public class InspectionResourceIT {

    private static final Instant DEFAULT_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);
    private static final Instant SMALLER_DATE = Instant.ofEpochMilli(-1L);

    private static final byte[] DEFAULT_SIGNATURE = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_SIGNATURE = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_SIGNATURE_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_SIGNATURE_CONTENT_TYPE = "image/png";

    @Autowired
    private InspectionRepository inspectionRepository;

    /**
     * This repository is mocked in the com.sistema.amigo.repository.search test package.
     *
     * @see com.sistema.amigo.repository.search.InspectionSearchRepositoryMockConfiguration
     */
    @Autowired
    private InspectionSearchRepository mockInspectionSearchRepository;

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

    private MockMvc restInspectionMockMvc;

    private Inspection inspection;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final InspectionResource inspectionResource = new InspectionResource(inspectionRepository, mockInspectionSearchRepository);
        this.restInspectionMockMvc = MockMvcBuilders.standaloneSetup(inspectionResource)
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
    public static Inspection createEntity(EntityManager em) {
        Inspection inspection = new Inspection()
            .date(DEFAULT_DATE)
            .signature(DEFAULT_SIGNATURE)
            .signatureContentType(DEFAULT_SIGNATURE_CONTENT_TYPE);
        return inspection;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Inspection createUpdatedEntity(EntityManager em) {
        Inspection inspection = new Inspection()
            .date(UPDATED_DATE)
            .signature(UPDATED_SIGNATURE)
            .signatureContentType(UPDATED_SIGNATURE_CONTENT_TYPE);
        return inspection;
    }

    @BeforeEach
    public void initTest() {
        inspection = createEntity(em);
    }

    @Test
    @Transactional
    public void createInspection() throws Exception {
        int databaseSizeBeforeCreate = inspectionRepository.findAll().size();

        // Create the Inspection
        restInspectionMockMvc.perform(post("/api/inspections")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(inspection)))
            .andExpect(status().isCreated());

        // Validate the Inspection in the database
        List<Inspection> inspectionList = inspectionRepository.findAll();
        assertThat(inspectionList).hasSize(databaseSizeBeforeCreate + 1);
        Inspection testInspection = inspectionList.get(inspectionList.size() - 1);
        assertThat(testInspection.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testInspection.getSignature()).isEqualTo(DEFAULT_SIGNATURE);
        assertThat(testInspection.getSignatureContentType()).isEqualTo(DEFAULT_SIGNATURE_CONTENT_TYPE);

        // Validate the Inspection in Elasticsearch
        verify(mockInspectionSearchRepository, times(1)).save(testInspection);
    }

    @Test
    @Transactional
    public void createInspectionWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = inspectionRepository.findAll().size();

        // Create the Inspection with an existing ID
        inspection.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restInspectionMockMvc.perform(post("/api/inspections")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(inspection)))
            .andExpect(status().isBadRequest());

        // Validate the Inspection in the database
        List<Inspection> inspectionList = inspectionRepository.findAll();
        assertThat(inspectionList).hasSize(databaseSizeBeforeCreate);

        // Validate the Inspection in Elasticsearch
        verify(mockInspectionSearchRepository, times(0)).save(inspection);
    }


    @Test
    @Transactional
    public void checkDateIsRequired() throws Exception {
        int databaseSizeBeforeTest = inspectionRepository.findAll().size();
        // set the field null
        inspection.setDate(null);

        // Create the Inspection, which fails.

        restInspectionMockMvc.perform(post("/api/inspections")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(inspection)))
            .andExpect(status().isBadRequest());

        List<Inspection> inspectionList = inspectionRepository.findAll();
        assertThat(inspectionList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllInspections() throws Exception {
        // Initialize the database
        inspectionRepository.saveAndFlush(inspection);

        // Get all the inspectionList
        restInspectionMockMvc.perform(get("/api/inspections?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(inspection.getId().intValue())))
            .andExpect(jsonPath("$.[*].date").value(hasItem(DEFAULT_DATE.toString())))
            .andExpect(jsonPath("$.[*].signatureContentType").value(hasItem(DEFAULT_SIGNATURE_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].signature").value(hasItem(Base64Utils.encodeToString(DEFAULT_SIGNATURE))));
    }
    
    @Test
    @Transactional
    public void getInspection() throws Exception {
        // Initialize the database
        inspectionRepository.saveAndFlush(inspection);

        // Get the inspection
        restInspectionMockMvc.perform(get("/api/inspections/{id}", inspection.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(inspection.getId().intValue()))
            .andExpect(jsonPath("$.date").value(DEFAULT_DATE.toString()))
            .andExpect(jsonPath("$.signatureContentType").value(DEFAULT_SIGNATURE_CONTENT_TYPE))
            .andExpect(jsonPath("$.signature").value(Base64Utils.encodeToString(DEFAULT_SIGNATURE)));
    }

    @Test
    @Transactional
    public void getNonExistingInspection() throws Exception {
        // Get the inspection
        restInspectionMockMvc.perform(get("/api/inspections/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateInspection() throws Exception {
        // Initialize the database
        inspectionRepository.saveAndFlush(inspection);

        int databaseSizeBeforeUpdate = inspectionRepository.findAll().size();

        // Update the inspection
        Inspection updatedInspection = inspectionRepository.findById(inspection.getId()).get();
        // Disconnect from session so that the updates on updatedInspection are not directly saved in db
        em.detach(updatedInspection);
        updatedInspection
            .date(UPDATED_DATE)
            .signature(UPDATED_SIGNATURE)
            .signatureContentType(UPDATED_SIGNATURE_CONTENT_TYPE);

        restInspectionMockMvc.perform(put("/api/inspections")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedInspection)))
            .andExpect(status().isOk());

        // Validate the Inspection in the database
        List<Inspection> inspectionList = inspectionRepository.findAll();
        assertThat(inspectionList).hasSize(databaseSizeBeforeUpdate);
        Inspection testInspection = inspectionList.get(inspectionList.size() - 1);
        assertThat(testInspection.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testInspection.getSignature()).isEqualTo(UPDATED_SIGNATURE);
        assertThat(testInspection.getSignatureContentType()).isEqualTo(UPDATED_SIGNATURE_CONTENT_TYPE);

        // Validate the Inspection in Elasticsearch
        verify(mockInspectionSearchRepository, times(1)).save(testInspection);
    }

    @Test
    @Transactional
    public void updateNonExistingInspection() throws Exception {
        int databaseSizeBeforeUpdate = inspectionRepository.findAll().size();

        // Create the Inspection

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restInspectionMockMvc.perform(put("/api/inspections")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(inspection)))
            .andExpect(status().isBadRequest());

        // Validate the Inspection in the database
        List<Inspection> inspectionList = inspectionRepository.findAll();
        assertThat(inspectionList).hasSize(databaseSizeBeforeUpdate);

        // Validate the Inspection in Elasticsearch
        verify(mockInspectionSearchRepository, times(0)).save(inspection);
    }

    @Test
    @Transactional
    public void deleteInspection() throws Exception {
        // Initialize the database
        inspectionRepository.saveAndFlush(inspection);

        int databaseSizeBeforeDelete = inspectionRepository.findAll().size();

        // Delete the inspection
        restInspectionMockMvc.perform(delete("/api/inspections/{id}", inspection.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Inspection> inspectionList = inspectionRepository.findAll();
        assertThat(inspectionList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the Inspection in Elasticsearch
        verify(mockInspectionSearchRepository, times(1)).deleteById(inspection.getId());
    }

    @Test
    @Transactional
    public void searchInspection() throws Exception {
        // Initialize the database
        inspectionRepository.saveAndFlush(inspection);
        when(mockInspectionSearchRepository.search(queryStringQuery("id:" + inspection.getId())))
            .thenReturn(Collections.singletonList(inspection));
        // Search the inspection
        restInspectionMockMvc.perform(get("/api/_search/inspections?query=id:" + inspection.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(inspection.getId().intValue())))
            .andExpect(jsonPath("$.[*].date").value(hasItem(DEFAULT_DATE.toString())))
            .andExpect(jsonPath("$.[*].signatureContentType").value(hasItem(DEFAULT_SIGNATURE_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].signature").value(hasItem(Base64Utils.encodeToString(DEFAULT_SIGNATURE))));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Inspection.class);
        Inspection inspection1 = new Inspection();
        inspection1.setId(1L);
        Inspection inspection2 = new Inspection();
        inspection2.setId(inspection1.getId());
        assertThat(inspection1).isEqualTo(inspection2);
        inspection2.setId(2L);
        assertThat(inspection1).isNotEqualTo(inspection2);
        inspection1.setId(null);
        assertThat(inspection1).isNotEqualTo(inspection2);
    }
}
