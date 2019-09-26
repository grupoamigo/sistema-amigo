package com.sistema.amigo.web.rest;

import com.sistema.amigo.SistemaAmigoApp;
import com.sistema.amigo.domain.Transport;
import com.sistema.amigo.repository.TransportRepository;
import com.sistema.amigo.repository.search.TransportSearchRepository;
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

import com.sistema.amigo.domain.enumeration.TransportType;
/**
 * Integration tests for the {@link TransportResource} REST controller.
 */
@SpringBootTest(classes = SistemaAmigoApp.class)
public class TransportResourceIT {

    private static final String DEFAULT_PLATE_ID = "AAAAAAAAAA";
    private static final String UPDATED_PLATE_ID = "BBBBBBBBBB";

    private static final TransportType DEFAULT_TYPE = TransportType.CAMION;
    private static final TransportType UPDATED_TYPE = TransportType.FFCC;

    @Autowired
    private TransportRepository transportRepository;

    /**
     * This repository is mocked in the com.sistema.amigo.repository.search test package.
     *
     * @see com.sistema.amigo.repository.search.TransportSearchRepositoryMockConfiguration
     */
    @Autowired
    private TransportSearchRepository mockTransportSearchRepository;

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

    private MockMvc restTransportMockMvc;

    private Transport transport;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final TransportResource transportResource = new TransportResource(transportRepository, mockTransportSearchRepository);
        this.restTransportMockMvc = MockMvcBuilders.standaloneSetup(transportResource)
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
    public static Transport createEntity(EntityManager em) {
        Transport transport = new Transport()
            .plateId(DEFAULT_PLATE_ID)
            .type(DEFAULT_TYPE);
        return transport;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Transport createUpdatedEntity(EntityManager em) {
        Transport transport = new Transport()
            .plateId(UPDATED_PLATE_ID)
            .type(UPDATED_TYPE);
        return transport;
    }

    @BeforeEach
    public void initTest() {
        transport = createEntity(em);
    }

    @Test
    @Transactional
    public void createTransport() throws Exception {
        int databaseSizeBeforeCreate = transportRepository.findAll().size();

        // Create the Transport
        restTransportMockMvc.perform(post("/api/transports")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(transport)))
            .andExpect(status().isCreated());

        // Validate the Transport in the database
        List<Transport> transportList = transportRepository.findAll();
        assertThat(transportList).hasSize(databaseSizeBeforeCreate + 1);
        Transport testTransport = transportList.get(transportList.size() - 1);
        assertThat(testTransport.getPlateId()).isEqualTo(DEFAULT_PLATE_ID);
        assertThat(testTransport.getType()).isEqualTo(DEFAULT_TYPE);

        // Validate the Transport in Elasticsearch
        verify(mockTransportSearchRepository, times(1)).save(testTransport);
    }

    @Test
    @Transactional
    public void createTransportWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = transportRepository.findAll().size();

        // Create the Transport with an existing ID
        transport.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restTransportMockMvc.perform(post("/api/transports")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(transport)))
            .andExpect(status().isBadRequest());

        // Validate the Transport in the database
        List<Transport> transportList = transportRepository.findAll();
        assertThat(transportList).hasSize(databaseSizeBeforeCreate);

        // Validate the Transport in Elasticsearch
        verify(mockTransportSearchRepository, times(0)).save(transport);
    }


    @Test
    @Transactional
    public void checkPlateIdIsRequired() throws Exception {
        int databaseSizeBeforeTest = transportRepository.findAll().size();
        // set the field null
        transport.setPlateId(null);

        // Create the Transport, which fails.

        restTransportMockMvc.perform(post("/api/transports")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(transport)))
            .andExpect(status().isBadRequest());

        List<Transport> transportList = transportRepository.findAll();
        assertThat(transportList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllTransports() throws Exception {
        // Initialize the database
        transportRepository.saveAndFlush(transport);

        // Get all the transportList
        restTransportMockMvc.perform(get("/api/transports?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(transport.getId().intValue())))
            .andExpect(jsonPath("$.[*].plateId").value(hasItem(DEFAULT_PLATE_ID.toString())))
            .andExpect(jsonPath("$.[*].type").value(hasItem(DEFAULT_TYPE.toString())));
    }
    
    @Test
    @Transactional
    public void getTransport() throws Exception {
        // Initialize the database
        transportRepository.saveAndFlush(transport);

        // Get the transport
        restTransportMockMvc.perform(get("/api/transports/{id}", transport.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(transport.getId().intValue()))
            .andExpect(jsonPath("$.plateId").value(DEFAULT_PLATE_ID.toString()))
            .andExpect(jsonPath("$.type").value(DEFAULT_TYPE.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingTransport() throws Exception {
        // Get the transport
        restTransportMockMvc.perform(get("/api/transports/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateTransport() throws Exception {
        // Initialize the database
        transportRepository.saveAndFlush(transport);

        int databaseSizeBeforeUpdate = transportRepository.findAll().size();

        // Update the transport
        Transport updatedTransport = transportRepository.findById(transport.getId()).get();
        // Disconnect from session so that the updates on updatedTransport are not directly saved in db
        em.detach(updatedTransport);
        updatedTransport
            .plateId(UPDATED_PLATE_ID)
            .type(UPDATED_TYPE);

        restTransportMockMvc.perform(put("/api/transports")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedTransport)))
            .andExpect(status().isOk());

        // Validate the Transport in the database
        List<Transport> transportList = transportRepository.findAll();
        assertThat(transportList).hasSize(databaseSizeBeforeUpdate);
        Transport testTransport = transportList.get(transportList.size() - 1);
        assertThat(testTransport.getPlateId()).isEqualTo(UPDATED_PLATE_ID);
        assertThat(testTransport.getType()).isEqualTo(UPDATED_TYPE);

        // Validate the Transport in Elasticsearch
        verify(mockTransportSearchRepository, times(1)).save(testTransport);
    }

    @Test
    @Transactional
    public void updateNonExistingTransport() throws Exception {
        int databaseSizeBeforeUpdate = transportRepository.findAll().size();

        // Create the Transport

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTransportMockMvc.perform(put("/api/transports")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(transport)))
            .andExpect(status().isBadRequest());

        // Validate the Transport in the database
        List<Transport> transportList = transportRepository.findAll();
        assertThat(transportList).hasSize(databaseSizeBeforeUpdate);

        // Validate the Transport in Elasticsearch
        verify(mockTransportSearchRepository, times(0)).save(transport);
    }

    @Test
    @Transactional
    public void deleteTransport() throws Exception {
        // Initialize the database
        transportRepository.saveAndFlush(transport);

        int databaseSizeBeforeDelete = transportRepository.findAll().size();

        // Delete the transport
        restTransportMockMvc.perform(delete("/api/transports/{id}", transport.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Transport> transportList = transportRepository.findAll();
        assertThat(transportList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the Transport in Elasticsearch
        verify(mockTransportSearchRepository, times(1)).deleteById(transport.getId());
    }

    @Test
    @Transactional
    public void searchTransport() throws Exception {
        // Initialize the database
        transportRepository.saveAndFlush(transport);
        when(mockTransportSearchRepository.search(queryStringQuery("id:" + transport.getId())))
            .thenReturn(Collections.singletonList(transport));
        // Search the transport
        restTransportMockMvc.perform(get("/api/_search/transports?query=id:" + transport.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(transport.getId().intValue())))
            .andExpect(jsonPath("$.[*].plateId").value(hasItem(DEFAULT_PLATE_ID)))
            .andExpect(jsonPath("$.[*].type").value(hasItem(DEFAULT_TYPE.toString())));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Transport.class);
        Transport transport1 = new Transport();
        transport1.setId(1L);
        Transport transport2 = new Transport();
        transport2.setId(transport1.getId());
        assertThat(transport1).isEqualTo(transport2);
        transport2.setId(2L);
        assertThat(transport1).isNotEqualTo(transport2);
        transport1.setId(null);
        assertThat(transport1).isNotEqualTo(transport2);
    }
}
