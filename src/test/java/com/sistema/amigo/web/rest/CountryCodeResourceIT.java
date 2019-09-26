package com.sistema.amigo.web.rest;

import com.sistema.amigo.SistemaAmigoApp;
import com.sistema.amigo.domain.CountryCode;
import com.sistema.amigo.repository.CountryCodeRepository;
import com.sistema.amigo.repository.search.CountryCodeSearchRepository;
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
 * Integration tests for the {@link CountryCodeResource} REST controller.
 */
@SpringBootTest(classes = SistemaAmigoApp.class)
public class CountryCodeResourceIT {

    private static final String DEFAULT_CODE = "AAAAAAAAAA";
    private static final String UPDATED_CODE = "BBBBBBBBBB";

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    @Autowired
    private CountryCodeRepository countryCodeRepository;

    /**
     * This repository is mocked in the com.sistema.amigo.repository.search test package.
     *
     * @see com.sistema.amigo.repository.search.CountryCodeSearchRepositoryMockConfiguration
     */
    @Autowired
    private CountryCodeSearchRepository mockCountryCodeSearchRepository;

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

    private MockMvc restCountryCodeMockMvc;

    private CountryCode countryCode;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final CountryCodeResource countryCodeResource = new CountryCodeResource(countryCodeRepository, mockCountryCodeSearchRepository);
        this.restCountryCodeMockMvc = MockMvcBuilders.standaloneSetup(countryCodeResource)
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
    public static CountryCode createEntity(EntityManager em) {
        CountryCode countryCode = new CountryCode()
            .code(DEFAULT_CODE)
            .name(DEFAULT_NAME);
        return countryCode;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CountryCode createUpdatedEntity(EntityManager em) {
        CountryCode countryCode = new CountryCode()
            .code(UPDATED_CODE)
            .name(UPDATED_NAME);
        return countryCode;
    }

    @BeforeEach
    public void initTest() {
        countryCode = createEntity(em);
    }

    @Test
    @Transactional
    public void createCountryCode() throws Exception {
        int databaseSizeBeforeCreate = countryCodeRepository.findAll().size();

        // Create the CountryCode
        restCountryCodeMockMvc.perform(post("/api/country-codes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(countryCode)))
            .andExpect(status().isCreated());

        // Validate the CountryCode in the database
        List<CountryCode> countryCodeList = countryCodeRepository.findAll();
        assertThat(countryCodeList).hasSize(databaseSizeBeforeCreate + 1);
        CountryCode testCountryCode = countryCodeList.get(countryCodeList.size() - 1);
        assertThat(testCountryCode.getCode()).isEqualTo(DEFAULT_CODE);
        assertThat(testCountryCode.getName()).isEqualTo(DEFAULT_NAME);

        // Validate the CountryCode in Elasticsearch
        verify(mockCountryCodeSearchRepository, times(1)).save(testCountryCode);
    }

    @Test
    @Transactional
    public void createCountryCodeWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = countryCodeRepository.findAll().size();

        // Create the CountryCode with an existing ID
        countryCode.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restCountryCodeMockMvc.perform(post("/api/country-codes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(countryCode)))
            .andExpect(status().isBadRequest());

        // Validate the CountryCode in the database
        List<CountryCode> countryCodeList = countryCodeRepository.findAll();
        assertThat(countryCodeList).hasSize(databaseSizeBeforeCreate);

        // Validate the CountryCode in Elasticsearch
        verify(mockCountryCodeSearchRepository, times(0)).save(countryCode);
    }


    @Test
    @Transactional
    public void checkCodeIsRequired() throws Exception {
        int databaseSizeBeforeTest = countryCodeRepository.findAll().size();
        // set the field null
        countryCode.setCode(null);

        // Create the CountryCode, which fails.

        restCountryCodeMockMvc.perform(post("/api/country-codes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(countryCode)))
            .andExpect(status().isBadRequest());

        List<CountryCode> countryCodeList = countryCodeRepository.findAll();
        assertThat(countryCodeList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllCountryCodes() throws Exception {
        // Initialize the database
        countryCodeRepository.saveAndFlush(countryCode);

        // Get all the countryCodeList
        restCountryCodeMockMvc.perform(get("/api/country-codes?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(countryCode.getId().intValue())))
            .andExpect(jsonPath("$.[*].code").value(hasItem(DEFAULT_CODE.toString())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())));
    }
    
    @Test
    @Transactional
    public void getCountryCode() throws Exception {
        // Initialize the database
        countryCodeRepository.saveAndFlush(countryCode);

        // Get the countryCode
        restCountryCodeMockMvc.perform(get("/api/country-codes/{id}", countryCode.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(countryCode.getId().intValue()))
            .andExpect(jsonPath("$.code").value(DEFAULT_CODE.toString()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingCountryCode() throws Exception {
        // Get the countryCode
        restCountryCodeMockMvc.perform(get("/api/country-codes/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateCountryCode() throws Exception {
        // Initialize the database
        countryCodeRepository.saveAndFlush(countryCode);

        int databaseSizeBeforeUpdate = countryCodeRepository.findAll().size();

        // Update the countryCode
        CountryCode updatedCountryCode = countryCodeRepository.findById(countryCode.getId()).get();
        // Disconnect from session so that the updates on updatedCountryCode are not directly saved in db
        em.detach(updatedCountryCode);
        updatedCountryCode
            .code(UPDATED_CODE)
            .name(UPDATED_NAME);

        restCountryCodeMockMvc.perform(put("/api/country-codes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedCountryCode)))
            .andExpect(status().isOk());

        // Validate the CountryCode in the database
        List<CountryCode> countryCodeList = countryCodeRepository.findAll();
        assertThat(countryCodeList).hasSize(databaseSizeBeforeUpdate);
        CountryCode testCountryCode = countryCodeList.get(countryCodeList.size() - 1);
        assertThat(testCountryCode.getCode()).isEqualTo(UPDATED_CODE);
        assertThat(testCountryCode.getName()).isEqualTo(UPDATED_NAME);

        // Validate the CountryCode in Elasticsearch
        verify(mockCountryCodeSearchRepository, times(1)).save(testCountryCode);
    }

    @Test
    @Transactional
    public void updateNonExistingCountryCode() throws Exception {
        int databaseSizeBeforeUpdate = countryCodeRepository.findAll().size();

        // Create the CountryCode

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCountryCodeMockMvc.perform(put("/api/country-codes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(countryCode)))
            .andExpect(status().isBadRequest());

        // Validate the CountryCode in the database
        List<CountryCode> countryCodeList = countryCodeRepository.findAll();
        assertThat(countryCodeList).hasSize(databaseSizeBeforeUpdate);

        // Validate the CountryCode in Elasticsearch
        verify(mockCountryCodeSearchRepository, times(0)).save(countryCode);
    }

    @Test
    @Transactional
    public void deleteCountryCode() throws Exception {
        // Initialize the database
        countryCodeRepository.saveAndFlush(countryCode);

        int databaseSizeBeforeDelete = countryCodeRepository.findAll().size();

        // Delete the countryCode
        restCountryCodeMockMvc.perform(delete("/api/country-codes/{id}", countryCode.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<CountryCode> countryCodeList = countryCodeRepository.findAll();
        assertThat(countryCodeList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the CountryCode in Elasticsearch
        verify(mockCountryCodeSearchRepository, times(1)).deleteById(countryCode.getId());
    }

    @Test
    @Transactional
    public void searchCountryCode() throws Exception {
        // Initialize the database
        countryCodeRepository.saveAndFlush(countryCode);
        when(mockCountryCodeSearchRepository.search(queryStringQuery("id:" + countryCode.getId())))
            .thenReturn(Collections.singletonList(countryCode));
        // Search the countryCode
        restCountryCodeMockMvc.perform(get("/api/_search/country-codes?query=id:" + countryCode.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(countryCode.getId().intValue())))
            .andExpect(jsonPath("$.[*].code").value(hasItem(DEFAULT_CODE)))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(CountryCode.class);
        CountryCode countryCode1 = new CountryCode();
        countryCode1.setId(1L);
        CountryCode countryCode2 = new CountryCode();
        countryCode2.setId(countryCode1.getId());
        assertThat(countryCode1).isEqualTo(countryCode2);
        countryCode2.setId(2L);
        assertThat(countryCode1).isNotEqualTo(countryCode2);
        countryCode1.setId(null);
        assertThat(countryCode1).isNotEqualTo(countryCode2);
    }
}
