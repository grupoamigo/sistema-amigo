package com.sistema.amigo.web.rest;

import com.sistema.amigo.SistemaAmigoApp;
import com.sistema.amigo.domain.Client;
import com.sistema.amigo.repository.ClientRepository;
import com.sistema.amigo.repository.search.ClientSearchRepository;
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

import com.sistema.amigo.domain.enumeration.ClientStatusType;
/**
 * Integration tests for the {@link ClientResource} REST controller.
 */
@SpringBootTest(classes = SistemaAmigoApp.class)
public class ClientResourceIT {

    private static final Instant DEFAULT_MEMBER_SINCE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_MEMBER_SINCE = Instant.now().truncatedTo(ChronoUnit.MILLIS);
    private static final Instant SMALLER_MEMBER_SINCE = Instant.ofEpochMilli(-1L);

    private static final ClientStatusType DEFAULT_STATUS = ClientStatusType.ACTIVO;
    private static final ClientStatusType UPDATED_STATUS = ClientStatusType.SOLICITUD;

    private static final String DEFAULT_INTERNAL_NOTES = "AAAAAAAAAA";
    private static final String UPDATED_INTERNAL_NOTES = "BBBBBBBBBB";

    private static final String DEFAULT_UNIQUE_ID = "AAAAAAAAAA";
    private static final String UPDATED_UNIQUE_ID = "BBBBBBBBBB";

    @Autowired
    private ClientRepository clientRepository;

    /**
     * This repository is mocked in the com.sistema.amigo.repository.search test package.
     *
     * @see com.sistema.amigo.repository.search.ClientSearchRepositoryMockConfiguration
     */
    @Autowired
    private ClientSearchRepository mockClientSearchRepository;

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

    private MockMvc restClientMockMvc;

    private Client client;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final ClientResource clientResource = new ClientResource(clientRepository, mockClientSearchRepository);
        this.restClientMockMvc = MockMvcBuilders.standaloneSetup(clientResource)
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
    public static Client createEntity(EntityManager em) {
        Client client = new Client()
            .memberSince(DEFAULT_MEMBER_SINCE)
            .status(DEFAULT_STATUS)
            .internalNotes(DEFAULT_INTERNAL_NOTES)
            .uniqueId(DEFAULT_UNIQUE_ID);
        return client;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Client createUpdatedEntity(EntityManager em) {
        Client client = new Client()
            .memberSince(UPDATED_MEMBER_SINCE)
            .status(UPDATED_STATUS)
            .internalNotes(UPDATED_INTERNAL_NOTES)
            .uniqueId(UPDATED_UNIQUE_ID);
        return client;
    }

    @BeforeEach
    public void initTest() {
        client = createEntity(em);
    }

    @Test
    @Transactional
    public void createClient() throws Exception {
        int databaseSizeBeforeCreate = clientRepository.findAll().size();

        // Create the Client
        restClientMockMvc.perform(post("/api/clients")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(client)))
            .andExpect(status().isCreated());

        // Validate the Client in the database
        List<Client> clientList = clientRepository.findAll();
        assertThat(clientList).hasSize(databaseSizeBeforeCreate + 1);
        Client testClient = clientList.get(clientList.size() - 1);
        assertThat(testClient.getMemberSince()).isEqualTo(DEFAULT_MEMBER_SINCE);
        assertThat(testClient.getStatus()).isEqualTo(DEFAULT_STATUS);
        assertThat(testClient.getInternalNotes()).isEqualTo(DEFAULT_INTERNAL_NOTES);
        assertThat(testClient.getUniqueId()).isEqualTo(DEFAULT_UNIQUE_ID);

        // Validate the Client in Elasticsearch
        verify(mockClientSearchRepository, times(1)).save(testClient);
    }

    @Test
    @Transactional
    public void createClientWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = clientRepository.findAll().size();

        // Create the Client with an existing ID
        client.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restClientMockMvc.perform(post("/api/clients")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(client)))
            .andExpect(status().isBadRequest());

        // Validate the Client in the database
        List<Client> clientList = clientRepository.findAll();
        assertThat(clientList).hasSize(databaseSizeBeforeCreate);

        // Validate the Client in Elasticsearch
        verify(mockClientSearchRepository, times(0)).save(client);
    }


    @Test
    @Transactional
    public void getAllClients() throws Exception {
        // Initialize the database
        clientRepository.saveAndFlush(client);

        // Get all the clientList
        restClientMockMvc.perform(get("/api/clients?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(client.getId().intValue())))
            .andExpect(jsonPath("$.[*].memberSince").value(hasItem(DEFAULT_MEMBER_SINCE.toString())))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())))
            .andExpect(jsonPath("$.[*].internalNotes").value(hasItem(DEFAULT_INTERNAL_NOTES.toString())))
            .andExpect(jsonPath("$.[*].uniqueId").value(hasItem(DEFAULT_UNIQUE_ID.toString())));
    }
    
    @Test
    @Transactional
    public void getClient() throws Exception {
        // Initialize the database
        clientRepository.saveAndFlush(client);

        // Get the client
        restClientMockMvc.perform(get("/api/clients/{id}", client.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(client.getId().intValue()))
            .andExpect(jsonPath("$.memberSince").value(DEFAULT_MEMBER_SINCE.toString()))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS.toString()))
            .andExpect(jsonPath("$.internalNotes").value(DEFAULT_INTERNAL_NOTES.toString()))
            .andExpect(jsonPath("$.uniqueId").value(DEFAULT_UNIQUE_ID.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingClient() throws Exception {
        // Get the client
        restClientMockMvc.perform(get("/api/clients/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateClient() throws Exception {
        // Initialize the database
        clientRepository.saveAndFlush(client);

        int databaseSizeBeforeUpdate = clientRepository.findAll().size();

        // Update the client
        Client updatedClient = clientRepository.findById(client.getId()).get();
        // Disconnect from session so that the updates on updatedClient are not directly saved in db
        em.detach(updatedClient);
        updatedClient
            .memberSince(UPDATED_MEMBER_SINCE)
            .status(UPDATED_STATUS)
            .internalNotes(UPDATED_INTERNAL_NOTES)
            .uniqueId(UPDATED_UNIQUE_ID);

        restClientMockMvc.perform(put("/api/clients")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedClient)))
            .andExpect(status().isOk());

        // Validate the Client in the database
        List<Client> clientList = clientRepository.findAll();
        assertThat(clientList).hasSize(databaseSizeBeforeUpdate);
        Client testClient = clientList.get(clientList.size() - 1);
        assertThat(testClient.getMemberSince()).isEqualTo(UPDATED_MEMBER_SINCE);
        assertThat(testClient.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testClient.getInternalNotes()).isEqualTo(UPDATED_INTERNAL_NOTES);
        assertThat(testClient.getUniqueId()).isEqualTo(UPDATED_UNIQUE_ID);

        // Validate the Client in Elasticsearch
        verify(mockClientSearchRepository, times(1)).save(testClient);
    }

    @Test
    @Transactional
    public void updateNonExistingClient() throws Exception {
        int databaseSizeBeforeUpdate = clientRepository.findAll().size();

        // Create the Client

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restClientMockMvc.perform(put("/api/clients")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(client)))
            .andExpect(status().isBadRequest());

        // Validate the Client in the database
        List<Client> clientList = clientRepository.findAll();
        assertThat(clientList).hasSize(databaseSizeBeforeUpdate);

        // Validate the Client in Elasticsearch
        verify(mockClientSearchRepository, times(0)).save(client);
    }

    @Test
    @Transactional
    public void deleteClient() throws Exception {
        // Initialize the database
        clientRepository.saveAndFlush(client);

        int databaseSizeBeforeDelete = clientRepository.findAll().size();

        // Delete the client
        restClientMockMvc.perform(delete("/api/clients/{id}", client.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Client> clientList = clientRepository.findAll();
        assertThat(clientList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the Client in Elasticsearch
        verify(mockClientSearchRepository, times(1)).deleteById(client.getId());
    }

    @Test
    @Transactional
    public void searchClient() throws Exception {
        // Initialize the database
        clientRepository.saveAndFlush(client);
        when(mockClientSearchRepository.search(queryStringQuery("id:" + client.getId())))
            .thenReturn(Collections.singletonList(client));
        // Search the client
        restClientMockMvc.perform(get("/api/_search/clients?query=id:" + client.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(client.getId().intValue())))
            .andExpect(jsonPath("$.[*].memberSince").value(hasItem(DEFAULT_MEMBER_SINCE.toString())))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())))
            .andExpect(jsonPath("$.[*].internalNotes").value(hasItem(DEFAULT_INTERNAL_NOTES)))
            .andExpect(jsonPath("$.[*].uniqueId").value(hasItem(DEFAULT_UNIQUE_ID)));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Client.class);
        Client client1 = new Client();
        client1.setId(1L);
        Client client2 = new Client();
        client2.setId(client1.getId());
        assertThat(client1).isEqualTo(client2);
        client2.setId(2L);
        assertThat(client1).isNotEqualTo(client2);
        client1.setId(null);
        assertThat(client1).isNotEqualTo(client2);
    }
}
