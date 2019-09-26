package com.sistema.amigo.web.rest;

import com.sistema.amigo.SistemaAmigoApp;
import com.sistema.amigo.domain.StateCode;
import com.sistema.amigo.repository.StateCodeRepository;
import com.sistema.amigo.repository.search.StateCodeSearchRepository;
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
 * Integration tests for the {@link StateCodeResource} REST controller.
 */
@SpringBootTest(classes = SistemaAmigoApp.class)
public class StateCodeResourceIT {

    private static final String DEFAULT_CODE = "AAAAAAAAAA";
    private static final String UPDATED_CODE = "BBBBBBBBBB";

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    @Autowired
    private StateCodeRepository stateCodeRepository;

    /**
     * This repository is mocked in the com.sistema.amigo.repository.search test package.
     *
     * @see com.sistema.amigo.repository.search.StateCodeSearchRepositoryMockConfiguration
     */
    @Autowired
    private StateCodeSearchRepository mockStateCodeSearchRepository;

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

    private MockMvc restStateCodeMockMvc;

    private StateCode stateCode;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final StateCodeResource stateCodeResource = new StateCodeResource(stateCodeRepository, mockStateCodeSearchRepository);
        this.restStateCodeMockMvc = MockMvcBuilders.standaloneSetup(stateCodeResource)
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
    public static StateCode createEntity(EntityManager em) {
        StateCode stateCode = new StateCode()
            .code(DEFAULT_CODE)
            .name(DEFAULT_NAME);
        return stateCode;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static StateCode createUpdatedEntity(EntityManager em) {
        StateCode stateCode = new StateCode()
            .code(UPDATED_CODE)
            .name(UPDATED_NAME);
        return stateCode;
    }

    @BeforeEach
    public void initTest() {
        stateCode = createEntity(em);
    }

    @Test
    @Transactional
    public void createStateCode() throws Exception {
        int databaseSizeBeforeCreate = stateCodeRepository.findAll().size();

        // Create the StateCode
        restStateCodeMockMvc.perform(post("/api/state-codes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(stateCode)))
            .andExpect(status().isCreated());

        // Validate the StateCode in the database
        List<StateCode> stateCodeList = stateCodeRepository.findAll();
        assertThat(stateCodeList).hasSize(databaseSizeBeforeCreate + 1);
        StateCode testStateCode = stateCodeList.get(stateCodeList.size() - 1);
        assertThat(testStateCode.getCode()).isEqualTo(DEFAULT_CODE);
        assertThat(testStateCode.getName()).isEqualTo(DEFAULT_NAME);

        // Validate the StateCode in Elasticsearch
        verify(mockStateCodeSearchRepository, times(1)).save(testStateCode);
    }

    @Test
    @Transactional
    public void createStateCodeWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = stateCodeRepository.findAll().size();

        // Create the StateCode with an existing ID
        stateCode.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restStateCodeMockMvc.perform(post("/api/state-codes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(stateCode)))
            .andExpect(status().isBadRequest());

        // Validate the StateCode in the database
        List<StateCode> stateCodeList = stateCodeRepository.findAll();
        assertThat(stateCodeList).hasSize(databaseSizeBeforeCreate);

        // Validate the StateCode in Elasticsearch
        verify(mockStateCodeSearchRepository, times(0)).save(stateCode);
    }


    @Test
    @Transactional
    public void checkCodeIsRequired() throws Exception {
        int databaseSizeBeforeTest = stateCodeRepository.findAll().size();
        // set the field null
        stateCode.setCode(null);

        // Create the StateCode, which fails.

        restStateCodeMockMvc.perform(post("/api/state-codes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(stateCode)))
            .andExpect(status().isBadRequest());

        List<StateCode> stateCodeList = stateCodeRepository.findAll();
        assertThat(stateCodeList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllStateCodes() throws Exception {
        // Initialize the database
        stateCodeRepository.saveAndFlush(stateCode);

        // Get all the stateCodeList
        restStateCodeMockMvc.perform(get("/api/state-codes?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(stateCode.getId().intValue())))
            .andExpect(jsonPath("$.[*].code").value(hasItem(DEFAULT_CODE.toString())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())));
    }
    
    @Test
    @Transactional
    public void getStateCode() throws Exception {
        // Initialize the database
        stateCodeRepository.saveAndFlush(stateCode);

        // Get the stateCode
        restStateCodeMockMvc.perform(get("/api/state-codes/{id}", stateCode.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(stateCode.getId().intValue()))
            .andExpect(jsonPath("$.code").value(DEFAULT_CODE.toString()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingStateCode() throws Exception {
        // Get the stateCode
        restStateCodeMockMvc.perform(get("/api/state-codes/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateStateCode() throws Exception {
        // Initialize the database
        stateCodeRepository.saveAndFlush(stateCode);

        int databaseSizeBeforeUpdate = stateCodeRepository.findAll().size();

        // Update the stateCode
        StateCode updatedStateCode = stateCodeRepository.findById(stateCode.getId()).get();
        // Disconnect from session so that the updates on updatedStateCode are not directly saved in db
        em.detach(updatedStateCode);
        updatedStateCode
            .code(UPDATED_CODE)
            .name(UPDATED_NAME);

        restStateCodeMockMvc.perform(put("/api/state-codes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedStateCode)))
            .andExpect(status().isOk());

        // Validate the StateCode in the database
        List<StateCode> stateCodeList = stateCodeRepository.findAll();
        assertThat(stateCodeList).hasSize(databaseSizeBeforeUpdate);
        StateCode testStateCode = stateCodeList.get(stateCodeList.size() - 1);
        assertThat(testStateCode.getCode()).isEqualTo(UPDATED_CODE);
        assertThat(testStateCode.getName()).isEqualTo(UPDATED_NAME);

        // Validate the StateCode in Elasticsearch
        verify(mockStateCodeSearchRepository, times(1)).save(testStateCode);
    }

    @Test
    @Transactional
    public void updateNonExistingStateCode() throws Exception {
        int databaseSizeBeforeUpdate = stateCodeRepository.findAll().size();

        // Create the StateCode

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restStateCodeMockMvc.perform(put("/api/state-codes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(stateCode)))
            .andExpect(status().isBadRequest());

        // Validate the StateCode in the database
        List<StateCode> stateCodeList = stateCodeRepository.findAll();
        assertThat(stateCodeList).hasSize(databaseSizeBeforeUpdate);

        // Validate the StateCode in Elasticsearch
        verify(mockStateCodeSearchRepository, times(0)).save(stateCode);
    }

    @Test
    @Transactional
    public void deleteStateCode() throws Exception {
        // Initialize the database
        stateCodeRepository.saveAndFlush(stateCode);

        int databaseSizeBeforeDelete = stateCodeRepository.findAll().size();

        // Delete the stateCode
        restStateCodeMockMvc.perform(delete("/api/state-codes/{id}", stateCode.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<StateCode> stateCodeList = stateCodeRepository.findAll();
        assertThat(stateCodeList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the StateCode in Elasticsearch
        verify(mockStateCodeSearchRepository, times(1)).deleteById(stateCode.getId());
    }

    @Test
    @Transactional
    public void searchStateCode() throws Exception {
        // Initialize the database
        stateCodeRepository.saveAndFlush(stateCode);
        when(mockStateCodeSearchRepository.search(queryStringQuery("id:" + stateCode.getId())))
            .thenReturn(Collections.singletonList(stateCode));
        // Search the stateCode
        restStateCodeMockMvc.perform(get("/api/_search/state-codes?query=id:" + stateCode.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(stateCode.getId().intValue())))
            .andExpect(jsonPath("$.[*].code").value(hasItem(DEFAULT_CODE)))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(StateCode.class);
        StateCode stateCode1 = new StateCode();
        stateCode1.setId(1L);
        StateCode stateCode2 = new StateCode();
        stateCode2.setId(stateCode1.getId());
        assertThat(stateCode1).isEqualTo(stateCode2);
        stateCode2.setId(2L);
        assertThat(stateCode1).isNotEqualTo(stateCode2);
        stateCode1.setId(null);
        assertThat(stateCode1).isNotEqualTo(stateCode2);
    }
}
