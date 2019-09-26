package com.sistema.amigo.web.rest;

import com.sistema.amigo.SistemaAmigoApp;
import com.sistema.amigo.domain.Damage;
import com.sistema.amigo.repository.DamageRepository;
import com.sistema.amigo.repository.search.DamageSearchRepository;
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

/**
 * Integration tests for the {@link DamageResource} REST controller.
 */
@SpringBootTest(classes = SistemaAmigoApp.class)
public class DamageResourceIT {

    private static final Instant DEFAULT_REPORT_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_REPORT_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);
    private static final Instant SMALLER_REPORT_DATE = Instant.ofEpochMilli(-1L);

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    @Autowired
    private DamageRepository damageRepository;

    /**
     * This repository is mocked in the com.sistema.amigo.repository.search test package.
     *
     * @see com.sistema.amigo.repository.search.DamageSearchRepositoryMockConfiguration
     */
    @Autowired
    private DamageSearchRepository mockDamageSearchRepository;

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

    private MockMvc restDamageMockMvc;

    private Damage damage;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final DamageResource damageResource = new DamageResource(damageRepository, mockDamageSearchRepository);
        this.restDamageMockMvc = MockMvcBuilders.standaloneSetup(damageResource)
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
    public static Damage createEntity(EntityManager em) {
        Damage damage = new Damage()
            .reportDate(DEFAULT_REPORT_DATE)
            .description(DEFAULT_DESCRIPTION);
        return damage;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Damage createUpdatedEntity(EntityManager em) {
        Damage damage = new Damage()
            .reportDate(UPDATED_REPORT_DATE)
            .description(UPDATED_DESCRIPTION);
        return damage;
    }

    @BeforeEach
    public void initTest() {
        damage = createEntity(em);
    }

    @Test
    @Transactional
    public void createDamage() throws Exception {
        int databaseSizeBeforeCreate = damageRepository.findAll().size();

        // Create the Damage
        restDamageMockMvc.perform(post("/api/damages")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(damage)))
            .andExpect(status().isCreated());

        // Validate the Damage in the database
        List<Damage> damageList = damageRepository.findAll();
        assertThat(damageList).hasSize(databaseSizeBeforeCreate + 1);
        Damage testDamage = damageList.get(damageList.size() - 1);
        assertThat(testDamage.getReportDate()).isEqualTo(DEFAULT_REPORT_DATE);
        assertThat(testDamage.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);

        // Validate the Damage in Elasticsearch
        verify(mockDamageSearchRepository, times(1)).save(testDamage);
    }

    @Test
    @Transactional
    public void createDamageWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = damageRepository.findAll().size();

        // Create the Damage with an existing ID
        damage.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restDamageMockMvc.perform(post("/api/damages")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(damage)))
            .andExpect(status().isBadRequest());

        // Validate the Damage in the database
        List<Damage> damageList = damageRepository.findAll();
        assertThat(damageList).hasSize(databaseSizeBeforeCreate);

        // Validate the Damage in Elasticsearch
        verify(mockDamageSearchRepository, times(0)).save(damage);
    }


    @Test
    @Transactional
    public void getAllDamages() throws Exception {
        // Initialize the database
        damageRepository.saveAndFlush(damage);

        // Get all the damageList
        restDamageMockMvc.perform(get("/api/damages?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(damage.getId().intValue())))
            .andExpect(jsonPath("$.[*].reportDate").value(hasItem(DEFAULT_REPORT_DATE.toString())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())));
    }
    
    @Test
    @Transactional
    public void getDamage() throws Exception {
        // Initialize the database
        damageRepository.saveAndFlush(damage);

        // Get the damage
        restDamageMockMvc.perform(get("/api/damages/{id}", damage.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(damage.getId().intValue()))
            .andExpect(jsonPath("$.reportDate").value(DEFAULT_REPORT_DATE.toString()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingDamage() throws Exception {
        // Get the damage
        restDamageMockMvc.perform(get("/api/damages/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateDamage() throws Exception {
        // Initialize the database
        damageRepository.saveAndFlush(damage);

        int databaseSizeBeforeUpdate = damageRepository.findAll().size();

        // Update the damage
        Damage updatedDamage = damageRepository.findById(damage.getId()).get();
        // Disconnect from session so that the updates on updatedDamage are not directly saved in db
        em.detach(updatedDamage);
        updatedDamage
            .reportDate(UPDATED_REPORT_DATE)
            .description(UPDATED_DESCRIPTION);

        restDamageMockMvc.perform(put("/api/damages")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedDamage)))
            .andExpect(status().isOk());

        // Validate the Damage in the database
        List<Damage> damageList = damageRepository.findAll();
        assertThat(damageList).hasSize(databaseSizeBeforeUpdate);
        Damage testDamage = damageList.get(damageList.size() - 1);
        assertThat(testDamage.getReportDate()).isEqualTo(UPDATED_REPORT_DATE);
        assertThat(testDamage.getDescription()).isEqualTo(UPDATED_DESCRIPTION);

        // Validate the Damage in Elasticsearch
        verify(mockDamageSearchRepository, times(1)).save(testDamage);
    }

    @Test
    @Transactional
    public void updateNonExistingDamage() throws Exception {
        int databaseSizeBeforeUpdate = damageRepository.findAll().size();

        // Create the Damage

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDamageMockMvc.perform(put("/api/damages")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(damage)))
            .andExpect(status().isBadRequest());

        // Validate the Damage in the database
        List<Damage> damageList = damageRepository.findAll();
        assertThat(damageList).hasSize(databaseSizeBeforeUpdate);

        // Validate the Damage in Elasticsearch
        verify(mockDamageSearchRepository, times(0)).save(damage);
    }

    @Test
    @Transactional
    public void deleteDamage() throws Exception {
        // Initialize the database
        damageRepository.saveAndFlush(damage);

        int databaseSizeBeforeDelete = damageRepository.findAll().size();

        // Delete the damage
        restDamageMockMvc.perform(delete("/api/damages/{id}", damage.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Damage> damageList = damageRepository.findAll();
        assertThat(damageList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the Damage in Elasticsearch
        verify(mockDamageSearchRepository, times(1)).deleteById(damage.getId());
    }

    @Test
    @Transactional
    public void searchDamage() throws Exception {
        // Initialize the database
        damageRepository.saveAndFlush(damage);
        when(mockDamageSearchRepository.search(queryStringQuery("id:" + damage.getId())))
            .thenReturn(Collections.singletonList(damage));
        // Search the damage
        restDamageMockMvc.perform(get("/api/_search/damages?query=id:" + damage.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(damage.getId().intValue())))
            .andExpect(jsonPath("$.[*].reportDate").value(hasItem(DEFAULT_REPORT_DATE.toString())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Damage.class);
        Damage damage1 = new Damage();
        damage1.setId(1L);
        Damage damage2 = new Damage();
        damage2.setId(damage1.getId());
        assertThat(damage1).isEqualTo(damage2);
        damage2.setId(2L);
        assertThat(damage1).isNotEqualTo(damage2);
        damage1.setId(null);
        assertThat(damage1).isNotEqualTo(damage2);
    }
}
