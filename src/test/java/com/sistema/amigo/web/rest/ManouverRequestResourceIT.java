package com.sistema.amigo.web.rest;

import com.sistema.amigo.SistemaAmigoApp;
import com.sistema.amigo.domain.ManouverRequest;
import com.sistema.amigo.repository.ManouverRequestRepository;
import com.sistema.amigo.repository.search.ManouverRequestSearchRepository;
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
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Collections;
import java.util.List;

import static com.sistema.amigo.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.sistema.amigo.domain.enumeration.TransportType;
/**
 * Integration tests for the {@link ManouverRequestResource} REST controller.
 */
@SpringBootTest(classes = SistemaAmigoApp.class)
public class ManouverRequestResourceIT {

    private static final String DEFAULT_TITLE = "AAAAAAAAAA";
    private static final String UPDATED_TITLE = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE = LocalDate.now(ZoneId.systemDefault());
    private static final LocalDate SMALLER_DATE = LocalDate.ofEpochDay(-1L);

    private static final TransportType DEFAULT_TRANSPORT_TYPE = TransportType.CAMION;
    private static final TransportType UPDATED_TRANSPORT_TYPE = TransportType.FFCC;

    private static final byte[] DEFAULT_QR_CODE = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_QR_CODE = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_QR_CODE_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_QR_CODE_CONTENT_TYPE = "image/png";

    @Autowired
    private ManouverRequestRepository manouverRequestRepository;

    /**
     * This repository is mocked in the com.sistema.amigo.repository.search test package.
     *
     * @see com.sistema.amigo.repository.search.ManouverRequestSearchRepositoryMockConfiguration
     */
    @Autowired
    private ManouverRequestSearchRepository mockManouverRequestSearchRepository;

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

    private MockMvc restManouverRequestMockMvc;

    private ManouverRequest manouverRequest;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final ManouverRequestResource manouverRequestResource = new ManouverRequestResource(manouverRequestRepository, mockManouverRequestSearchRepository);
        this.restManouverRequestMockMvc = MockMvcBuilders.standaloneSetup(manouverRequestResource)
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
    public static ManouverRequest createEntity(EntityManager em) {
        ManouverRequest manouverRequest = new ManouverRequest()
            .title(DEFAULT_TITLE)
            .description(DEFAULT_DESCRIPTION)
            .date(DEFAULT_DATE)
            .transportType(DEFAULT_TRANSPORT_TYPE)
            .qrCode(DEFAULT_QR_CODE)
            .qrCodeContentType(DEFAULT_QR_CODE_CONTENT_TYPE);
        return manouverRequest;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ManouverRequest createUpdatedEntity(EntityManager em) {
        ManouverRequest manouverRequest = new ManouverRequest()
            .title(UPDATED_TITLE)
            .description(UPDATED_DESCRIPTION)
            .date(UPDATED_DATE)
            .transportType(UPDATED_TRANSPORT_TYPE)
            .qrCode(UPDATED_QR_CODE)
            .qrCodeContentType(UPDATED_QR_CODE_CONTENT_TYPE);
        return manouverRequest;
    }

    @BeforeEach
    public void initTest() {
        manouverRequest = createEntity(em);
    }

    @Test
    @Transactional
    public void createManouverRequest() throws Exception {
        int databaseSizeBeforeCreate = manouverRequestRepository.findAll().size();

        // Create the ManouverRequest
        restManouverRequestMockMvc.perform(post("/api/manouver-requests")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(manouverRequest)))
            .andExpect(status().isCreated());

        // Validate the ManouverRequest in the database
        List<ManouverRequest> manouverRequestList = manouverRequestRepository.findAll();
        assertThat(manouverRequestList).hasSize(databaseSizeBeforeCreate + 1);
        ManouverRequest testManouverRequest = manouverRequestList.get(manouverRequestList.size() - 1);
        assertThat(testManouverRequest.getTitle()).isEqualTo(DEFAULT_TITLE);
        assertThat(testManouverRequest.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testManouverRequest.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testManouverRequest.getTransportType()).isEqualTo(DEFAULT_TRANSPORT_TYPE);
        assertThat(testManouverRequest.getQrCode()).isEqualTo(DEFAULT_QR_CODE);
        assertThat(testManouverRequest.getQrCodeContentType()).isEqualTo(DEFAULT_QR_CODE_CONTENT_TYPE);

        // Validate the ManouverRequest in Elasticsearch
        verify(mockManouverRequestSearchRepository, times(1)).save(testManouverRequest);
    }

    @Test
    @Transactional
    public void createManouverRequestWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = manouverRequestRepository.findAll().size();

        // Create the ManouverRequest with an existing ID
        manouverRequest.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restManouverRequestMockMvc.perform(post("/api/manouver-requests")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(manouverRequest)))
            .andExpect(status().isBadRequest());

        // Validate the ManouverRequest in the database
        List<ManouverRequest> manouverRequestList = manouverRequestRepository.findAll();
        assertThat(manouverRequestList).hasSize(databaseSizeBeforeCreate);

        // Validate the ManouverRequest in Elasticsearch
        verify(mockManouverRequestSearchRepository, times(0)).save(manouverRequest);
    }


    @Test
    @Transactional
    public void checkTitleIsRequired() throws Exception {
        int databaseSizeBeforeTest = manouverRequestRepository.findAll().size();
        // set the field null
        manouverRequest.setTitle(null);

        // Create the ManouverRequest, which fails.

        restManouverRequestMockMvc.perform(post("/api/manouver-requests")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(manouverRequest)))
            .andExpect(status().isBadRequest());

        List<ManouverRequest> manouverRequestList = manouverRequestRepository.findAll();
        assertThat(manouverRequestList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkDescriptionIsRequired() throws Exception {
        int databaseSizeBeforeTest = manouverRequestRepository.findAll().size();
        // set the field null
        manouverRequest.setDescription(null);

        // Create the ManouverRequest, which fails.

        restManouverRequestMockMvc.perform(post("/api/manouver-requests")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(manouverRequest)))
            .andExpect(status().isBadRequest());

        List<ManouverRequest> manouverRequestList = manouverRequestRepository.findAll();
        assertThat(manouverRequestList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkDateIsRequired() throws Exception {
        int databaseSizeBeforeTest = manouverRequestRepository.findAll().size();
        // set the field null
        manouverRequest.setDate(null);

        // Create the ManouverRequest, which fails.

        restManouverRequestMockMvc.perform(post("/api/manouver-requests")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(manouverRequest)))
            .andExpect(status().isBadRequest());

        List<ManouverRequest> manouverRequestList = manouverRequestRepository.findAll();
        assertThat(manouverRequestList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllManouverRequests() throws Exception {
        // Initialize the database
        manouverRequestRepository.saveAndFlush(manouverRequest);

        // Get all the manouverRequestList
        restManouverRequestMockMvc.perform(get("/api/manouver-requests?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(manouverRequest.getId().intValue())))
            .andExpect(jsonPath("$.[*].title").value(hasItem(DEFAULT_TITLE.toString())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())))
            .andExpect(jsonPath("$.[*].date").value(hasItem(DEFAULT_DATE.toString())))
            .andExpect(jsonPath("$.[*].transportType").value(hasItem(DEFAULT_TRANSPORT_TYPE.toString())))
            .andExpect(jsonPath("$.[*].qrCodeContentType").value(hasItem(DEFAULT_QR_CODE_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].qrCode").value(hasItem(Base64Utils.encodeToString(DEFAULT_QR_CODE))));
    }
    
    @Test
    @Transactional
    public void getManouverRequest() throws Exception {
        // Initialize the database
        manouverRequestRepository.saveAndFlush(manouverRequest);

        // Get the manouverRequest
        restManouverRequestMockMvc.perform(get("/api/manouver-requests/{id}", manouverRequest.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(manouverRequest.getId().intValue()))
            .andExpect(jsonPath("$.title").value(DEFAULT_TITLE.toString()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION.toString()))
            .andExpect(jsonPath("$.date").value(DEFAULT_DATE.toString()))
            .andExpect(jsonPath("$.transportType").value(DEFAULT_TRANSPORT_TYPE.toString()))
            .andExpect(jsonPath("$.qrCodeContentType").value(DEFAULT_QR_CODE_CONTENT_TYPE))
            .andExpect(jsonPath("$.qrCode").value(Base64Utils.encodeToString(DEFAULT_QR_CODE)));
    }

    @Test
    @Transactional
    public void getNonExistingManouverRequest() throws Exception {
        // Get the manouverRequest
        restManouverRequestMockMvc.perform(get("/api/manouver-requests/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateManouverRequest() throws Exception {
        // Initialize the database
        manouverRequestRepository.saveAndFlush(manouverRequest);

        int databaseSizeBeforeUpdate = manouverRequestRepository.findAll().size();

        // Update the manouverRequest
        ManouverRequest updatedManouverRequest = manouverRequestRepository.findById(manouverRequest.getId()).get();
        // Disconnect from session so that the updates on updatedManouverRequest are not directly saved in db
        em.detach(updatedManouverRequest);
        updatedManouverRequest
            .title(UPDATED_TITLE)
            .description(UPDATED_DESCRIPTION)
            .date(UPDATED_DATE)
            .transportType(UPDATED_TRANSPORT_TYPE)
            .qrCode(UPDATED_QR_CODE)
            .qrCodeContentType(UPDATED_QR_CODE_CONTENT_TYPE);

        restManouverRequestMockMvc.perform(put("/api/manouver-requests")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedManouverRequest)))
            .andExpect(status().isOk());

        // Validate the ManouverRequest in the database
        List<ManouverRequest> manouverRequestList = manouverRequestRepository.findAll();
        assertThat(manouverRequestList).hasSize(databaseSizeBeforeUpdate);
        ManouverRequest testManouverRequest = manouverRequestList.get(manouverRequestList.size() - 1);
        assertThat(testManouverRequest.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testManouverRequest.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testManouverRequest.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testManouverRequest.getTransportType()).isEqualTo(UPDATED_TRANSPORT_TYPE);
        assertThat(testManouverRequest.getQrCode()).isEqualTo(UPDATED_QR_CODE);
        assertThat(testManouverRequest.getQrCodeContentType()).isEqualTo(UPDATED_QR_CODE_CONTENT_TYPE);

        // Validate the ManouverRequest in Elasticsearch
        verify(mockManouverRequestSearchRepository, times(1)).save(testManouverRequest);
    }

    @Test
    @Transactional
    public void updateNonExistingManouverRequest() throws Exception {
        int databaseSizeBeforeUpdate = manouverRequestRepository.findAll().size();

        // Create the ManouverRequest

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restManouverRequestMockMvc.perform(put("/api/manouver-requests")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(manouverRequest)))
            .andExpect(status().isBadRequest());

        // Validate the ManouverRequest in the database
        List<ManouverRequest> manouverRequestList = manouverRequestRepository.findAll();
        assertThat(manouverRequestList).hasSize(databaseSizeBeforeUpdate);

        // Validate the ManouverRequest in Elasticsearch
        verify(mockManouverRequestSearchRepository, times(0)).save(manouverRequest);
    }

    @Test
    @Transactional
    public void deleteManouverRequest() throws Exception {
        // Initialize the database
        manouverRequestRepository.saveAndFlush(manouverRequest);

        int databaseSizeBeforeDelete = manouverRequestRepository.findAll().size();

        // Delete the manouverRequest
        restManouverRequestMockMvc.perform(delete("/api/manouver-requests/{id}", manouverRequest.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ManouverRequest> manouverRequestList = manouverRequestRepository.findAll();
        assertThat(manouverRequestList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the ManouverRequest in Elasticsearch
        verify(mockManouverRequestSearchRepository, times(1)).deleteById(manouverRequest.getId());
    }

    @Test
    @Transactional
    public void searchManouverRequest() throws Exception {
        // Initialize the database
        manouverRequestRepository.saveAndFlush(manouverRequest);
        when(mockManouverRequestSearchRepository.search(queryStringQuery("id:" + manouverRequest.getId())))
            .thenReturn(Collections.singletonList(manouverRequest));
        // Search the manouverRequest
        restManouverRequestMockMvc.perform(get("/api/_search/manouver-requests?query=id:" + manouverRequest.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(manouverRequest.getId().intValue())))
            .andExpect(jsonPath("$.[*].title").value(hasItem(DEFAULT_TITLE)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].date").value(hasItem(DEFAULT_DATE.toString())))
            .andExpect(jsonPath("$.[*].transportType").value(hasItem(DEFAULT_TRANSPORT_TYPE.toString())))
            .andExpect(jsonPath("$.[*].qrCodeContentType").value(hasItem(DEFAULT_QR_CODE_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].qrCode").value(hasItem(Base64Utils.encodeToString(DEFAULT_QR_CODE))));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ManouverRequest.class);
        ManouverRequest manouverRequest1 = new ManouverRequest();
        manouverRequest1.setId(1L);
        ManouverRequest manouverRequest2 = new ManouverRequest();
        manouverRequest2.setId(manouverRequest1.getId());
        assertThat(manouverRequest1).isEqualTo(manouverRequest2);
        manouverRequest2.setId(2L);
        assertThat(manouverRequest1).isNotEqualTo(manouverRequest2);
        manouverRequest1.setId(null);
        assertThat(manouverRequest1).isNotEqualTo(manouverRequest2);
    }
}
