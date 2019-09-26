package com.sistema.amigo.web.rest;

import com.sistema.amigo.SistemaAmigoApp;
import com.sistema.amigo.domain.ServiceRequest;
import com.sistema.amigo.repository.ServiceRequestRepository;
import com.sistema.amigo.repository.search.ServiceRequestSearchRepository;
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
import java.time.LocalDate;
import java.time.Instant;
import java.time.ZoneId;
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

import com.sistema.amigo.domain.enumeration.StatusType;
/**
 * Integration tests for the {@link ServiceRequestResource} REST controller.
 */
@SpringBootTest(classes = SistemaAmigoApp.class)
public class ServiceRequestResourceIT {

    private static final String DEFAULT_TITLE = "AAAAAAAAAA";
    private static final String UPDATED_TITLE = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final Instant DEFAULT_DATE_REQUESTED = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATE_REQUESTED = Instant.now().truncatedTo(ChronoUnit.MILLIS);
    private static final Instant SMALLER_DATE_REQUESTED = Instant.ofEpochMilli(-1L);

    private static final LocalDate DEFAULT_DATE_BEGIN = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE_BEGIN = LocalDate.now(ZoneId.systemDefault());
    private static final LocalDate SMALLER_DATE_BEGIN = LocalDate.ofEpochDay(-1L);

    private static final LocalDate DEFAULT_DATE_END = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE_END = LocalDate.now(ZoneId.systemDefault());
    private static final LocalDate SMALLER_DATE_END = LocalDate.ofEpochDay(-1L);

    private static final StatusType DEFAULT_STATUS = StatusType.PROCESANDO;
    private static final StatusType UPDATED_STATUS = StatusType.CONFIRMADO;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    /**
     * This repository is mocked in the com.sistema.amigo.repository.search test package.
     *
     * @see com.sistema.amigo.repository.search.ServiceRequestSearchRepositoryMockConfiguration
     */
    @Autowired
    private ServiceRequestSearchRepository mockServiceRequestSearchRepository;

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

    private MockMvc restServiceRequestMockMvc;

    private ServiceRequest serviceRequest;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final ServiceRequestResource serviceRequestResource = new ServiceRequestResource(serviceRequestRepository, mockServiceRequestSearchRepository);
        this.restServiceRequestMockMvc = MockMvcBuilders.standaloneSetup(serviceRequestResource)
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
    public static ServiceRequest createEntity(EntityManager em) {
        ServiceRequest serviceRequest = new ServiceRequest()
            .title(DEFAULT_TITLE)
            .description(DEFAULT_DESCRIPTION)
            .dateRequested(DEFAULT_DATE_REQUESTED)
            .dateBegin(DEFAULT_DATE_BEGIN)
            .dateEnd(DEFAULT_DATE_END)
            .status(DEFAULT_STATUS);
        return serviceRequest;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ServiceRequest createUpdatedEntity(EntityManager em) {
        ServiceRequest serviceRequest = new ServiceRequest()
            .title(UPDATED_TITLE)
            .description(UPDATED_DESCRIPTION)
            .dateRequested(UPDATED_DATE_REQUESTED)
            .dateBegin(UPDATED_DATE_BEGIN)
            .dateEnd(UPDATED_DATE_END)
            .status(UPDATED_STATUS);
        return serviceRequest;
    }

    @BeforeEach
    public void initTest() {
        serviceRequest = createEntity(em);
    }

    @Test
    @Transactional
    public void createServiceRequest() throws Exception {
        int databaseSizeBeforeCreate = serviceRequestRepository.findAll().size();

        // Create the ServiceRequest
        restServiceRequestMockMvc.perform(post("/api/service-requests")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(serviceRequest)))
            .andExpect(status().isCreated());

        // Validate the ServiceRequest in the database
        List<ServiceRequest> serviceRequestList = serviceRequestRepository.findAll();
        assertThat(serviceRequestList).hasSize(databaseSizeBeforeCreate + 1);
        ServiceRequest testServiceRequest = serviceRequestList.get(serviceRequestList.size() - 1);
        assertThat(testServiceRequest.getTitle()).isEqualTo(DEFAULT_TITLE);
        assertThat(testServiceRequest.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testServiceRequest.getDateRequested()).isEqualTo(DEFAULT_DATE_REQUESTED);
        assertThat(testServiceRequest.getDateBegin()).isEqualTo(DEFAULT_DATE_BEGIN);
        assertThat(testServiceRequest.getDateEnd()).isEqualTo(DEFAULT_DATE_END);
        assertThat(testServiceRequest.getStatus()).isEqualTo(DEFAULT_STATUS);

        // Validate the ServiceRequest in Elasticsearch
        verify(mockServiceRequestSearchRepository, times(1)).save(testServiceRequest);
    }

    @Test
    @Transactional
    public void createServiceRequestWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = serviceRequestRepository.findAll().size();

        // Create the ServiceRequest with an existing ID
        serviceRequest.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restServiceRequestMockMvc.perform(post("/api/service-requests")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(serviceRequest)))
            .andExpect(status().isBadRequest());

        // Validate the ServiceRequest in the database
        List<ServiceRequest> serviceRequestList = serviceRequestRepository.findAll();
        assertThat(serviceRequestList).hasSize(databaseSizeBeforeCreate);

        // Validate the ServiceRequest in Elasticsearch
        verify(mockServiceRequestSearchRepository, times(0)).save(serviceRequest);
    }


    @Test
    @Transactional
    public void checkTitleIsRequired() throws Exception {
        int databaseSizeBeforeTest = serviceRequestRepository.findAll().size();
        // set the field null
        serviceRequest.setTitle(null);

        // Create the ServiceRequest, which fails.

        restServiceRequestMockMvc.perform(post("/api/service-requests")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(serviceRequest)))
            .andExpect(status().isBadRequest());

        List<ServiceRequest> serviceRequestList = serviceRequestRepository.findAll();
        assertThat(serviceRequestList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkDescriptionIsRequired() throws Exception {
        int databaseSizeBeforeTest = serviceRequestRepository.findAll().size();
        // set the field null
        serviceRequest.setDescription(null);

        // Create the ServiceRequest, which fails.

        restServiceRequestMockMvc.perform(post("/api/service-requests")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(serviceRequest)))
            .andExpect(status().isBadRequest());

        List<ServiceRequest> serviceRequestList = serviceRequestRepository.findAll();
        assertThat(serviceRequestList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkDateRequestedIsRequired() throws Exception {
        int databaseSizeBeforeTest = serviceRequestRepository.findAll().size();
        // set the field null
        serviceRequest.setDateRequested(null);

        // Create the ServiceRequest, which fails.

        restServiceRequestMockMvc.perform(post("/api/service-requests")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(serviceRequest)))
            .andExpect(status().isBadRequest());

        List<ServiceRequest> serviceRequestList = serviceRequestRepository.findAll();
        assertThat(serviceRequestList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkDateBeginIsRequired() throws Exception {
        int databaseSizeBeforeTest = serviceRequestRepository.findAll().size();
        // set the field null
        serviceRequest.setDateBegin(null);

        // Create the ServiceRequest, which fails.

        restServiceRequestMockMvc.perform(post("/api/service-requests")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(serviceRequest)))
            .andExpect(status().isBadRequest());

        List<ServiceRequest> serviceRequestList = serviceRequestRepository.findAll();
        assertThat(serviceRequestList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllServiceRequests() throws Exception {
        // Initialize the database
        serviceRequestRepository.saveAndFlush(serviceRequest);

        // Get all the serviceRequestList
        restServiceRequestMockMvc.perform(get("/api/service-requests?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(serviceRequest.getId().intValue())))
            .andExpect(jsonPath("$.[*].title").value(hasItem(DEFAULT_TITLE.toString())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())))
            .andExpect(jsonPath("$.[*].dateRequested").value(hasItem(DEFAULT_DATE_REQUESTED.toString())))
            .andExpect(jsonPath("$.[*].dateBegin").value(hasItem(DEFAULT_DATE_BEGIN.toString())))
            .andExpect(jsonPath("$.[*].dateEnd").value(hasItem(DEFAULT_DATE_END.toString())))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())));
    }
    
    @Test
    @Transactional
    public void getServiceRequest() throws Exception {
        // Initialize the database
        serviceRequestRepository.saveAndFlush(serviceRequest);

        // Get the serviceRequest
        restServiceRequestMockMvc.perform(get("/api/service-requests/{id}", serviceRequest.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(serviceRequest.getId().intValue()))
            .andExpect(jsonPath("$.title").value(DEFAULT_TITLE.toString()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION.toString()))
            .andExpect(jsonPath("$.dateRequested").value(DEFAULT_DATE_REQUESTED.toString()))
            .andExpect(jsonPath("$.dateBegin").value(DEFAULT_DATE_BEGIN.toString()))
            .andExpect(jsonPath("$.dateEnd").value(DEFAULT_DATE_END.toString()))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingServiceRequest() throws Exception {
        // Get the serviceRequest
        restServiceRequestMockMvc.perform(get("/api/service-requests/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateServiceRequest() throws Exception {
        // Initialize the database
        serviceRequestRepository.saveAndFlush(serviceRequest);

        int databaseSizeBeforeUpdate = serviceRequestRepository.findAll().size();

        // Update the serviceRequest
        ServiceRequest updatedServiceRequest = serviceRequestRepository.findById(serviceRequest.getId()).get();
        // Disconnect from session so that the updates on updatedServiceRequest are not directly saved in db
        em.detach(updatedServiceRequest);
        updatedServiceRequest
            .title(UPDATED_TITLE)
            .description(UPDATED_DESCRIPTION)
            .dateRequested(UPDATED_DATE_REQUESTED)
            .dateBegin(UPDATED_DATE_BEGIN)
            .dateEnd(UPDATED_DATE_END)
            .status(UPDATED_STATUS);

        restServiceRequestMockMvc.perform(put("/api/service-requests")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedServiceRequest)))
            .andExpect(status().isOk());

        // Validate the ServiceRequest in the database
        List<ServiceRequest> serviceRequestList = serviceRequestRepository.findAll();
        assertThat(serviceRequestList).hasSize(databaseSizeBeforeUpdate);
        ServiceRequest testServiceRequest = serviceRequestList.get(serviceRequestList.size() - 1);
        assertThat(testServiceRequest.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testServiceRequest.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testServiceRequest.getDateRequested()).isEqualTo(UPDATED_DATE_REQUESTED);
        assertThat(testServiceRequest.getDateBegin()).isEqualTo(UPDATED_DATE_BEGIN);
        assertThat(testServiceRequest.getDateEnd()).isEqualTo(UPDATED_DATE_END);
        assertThat(testServiceRequest.getStatus()).isEqualTo(UPDATED_STATUS);

        // Validate the ServiceRequest in Elasticsearch
        verify(mockServiceRequestSearchRepository, times(1)).save(testServiceRequest);
    }

    @Test
    @Transactional
    public void updateNonExistingServiceRequest() throws Exception {
        int databaseSizeBeforeUpdate = serviceRequestRepository.findAll().size();

        // Create the ServiceRequest

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restServiceRequestMockMvc.perform(put("/api/service-requests")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(serviceRequest)))
            .andExpect(status().isBadRequest());

        // Validate the ServiceRequest in the database
        List<ServiceRequest> serviceRequestList = serviceRequestRepository.findAll();
        assertThat(serviceRequestList).hasSize(databaseSizeBeforeUpdate);

        // Validate the ServiceRequest in Elasticsearch
        verify(mockServiceRequestSearchRepository, times(0)).save(serviceRequest);
    }

    @Test
    @Transactional
    public void deleteServiceRequest() throws Exception {
        // Initialize the database
        serviceRequestRepository.saveAndFlush(serviceRequest);

        int databaseSizeBeforeDelete = serviceRequestRepository.findAll().size();

        // Delete the serviceRequest
        restServiceRequestMockMvc.perform(delete("/api/service-requests/{id}", serviceRequest.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ServiceRequest> serviceRequestList = serviceRequestRepository.findAll();
        assertThat(serviceRequestList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the ServiceRequest in Elasticsearch
        verify(mockServiceRequestSearchRepository, times(1)).deleteById(serviceRequest.getId());
    }

    @Test
    @Transactional
    public void searchServiceRequest() throws Exception {
        // Initialize the database
        serviceRequestRepository.saveAndFlush(serviceRequest);
        when(mockServiceRequestSearchRepository.search(queryStringQuery("id:" + serviceRequest.getId())))
            .thenReturn(Collections.singletonList(serviceRequest));
        // Search the serviceRequest
        restServiceRequestMockMvc.perform(get("/api/_search/service-requests?query=id:" + serviceRequest.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(serviceRequest.getId().intValue())))
            .andExpect(jsonPath("$.[*].title").value(hasItem(DEFAULT_TITLE)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].dateRequested").value(hasItem(DEFAULT_DATE_REQUESTED.toString())))
            .andExpect(jsonPath("$.[*].dateBegin").value(hasItem(DEFAULT_DATE_BEGIN.toString())))
            .andExpect(jsonPath("$.[*].dateEnd").value(hasItem(DEFAULT_DATE_END.toString())))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ServiceRequest.class);
        ServiceRequest serviceRequest1 = new ServiceRequest();
        serviceRequest1.setId(1L);
        ServiceRequest serviceRequest2 = new ServiceRequest();
        serviceRequest2.setId(serviceRequest1.getId());
        assertThat(serviceRequest1).isEqualTo(serviceRequest2);
        serviceRequest2.setId(2L);
        assertThat(serviceRequest1).isNotEqualTo(serviceRequest2);
        serviceRequest1.setId(null);
        assertThat(serviceRequest1).isNotEqualTo(serviceRequest2);
    }
}
