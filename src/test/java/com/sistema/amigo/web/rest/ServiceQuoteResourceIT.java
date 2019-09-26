package com.sistema.amigo.web.rest;

import com.sistema.amigo.SistemaAmigoApp;
import com.sistema.amigo.domain.ServiceQuote;
import com.sistema.amigo.repository.ServiceQuoteRepository;
import com.sistema.amigo.repository.search.ServiceQuoteSearchRepository;
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

import com.sistema.amigo.domain.enumeration.ServiceUnitType;
import com.sistema.amigo.domain.enumeration.StatusType;
import com.sistema.amigo.domain.enumeration.CurrencyType;
/**
 * Integration tests for the {@link ServiceQuoteResource} REST controller.
 */
@SpringBootTest(classes = SistemaAmigoApp.class)
public class ServiceQuoteResourceIT {

    private static final String DEFAULT_TITLE = "AAAAAAAAAA";
    private static final String UPDATED_TITLE = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final Integer DEFAULT_QUANTITY = 1;
    private static final Integer UPDATED_QUANTITY = 2;
    private static final Integer SMALLER_QUANTITY = 1 - 1;

    private static final Float DEFAULT_PRICE = 1F;
    private static final Float UPDATED_PRICE = 2F;
    private static final Float SMALLER_PRICE = 1F - 1F;

    private static final ServiceUnitType DEFAULT_UNIT = ServiceUnitType.TM;
    private static final ServiceUnitType UPDATED_UNIT = ServiceUnitType.KG;

    private static final Instant DEFAULT_EXPEDITION_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_EXPEDITION_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);
    private static final Instant SMALLER_EXPEDITION_DATE = Instant.ofEpochMilli(-1L);

    private static final LocalDate DEFAULT_EXPIRATION_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_EXPIRATION_DATE = LocalDate.now(ZoneId.systemDefault());
    private static final LocalDate SMALLER_EXPIRATION_DATE = LocalDate.ofEpochDay(-1L);

    private static final StatusType DEFAULT_STATUS = StatusType.PROCESANDO;
    private static final StatusType UPDATED_STATUS = StatusType.CONFIRMADO;

    private static final CurrencyType DEFAULT_CURRENCY = CurrencyType.MXN;
    private static final CurrencyType UPDATED_CURRENCY = CurrencyType.USD;

    private static final String DEFAULT_APPROVED_BY = "AAAAAAAAAA";
    private static final String UPDATED_APPROVED_BY = "BBBBBBBBBB";

    private static final byte[] DEFAULT_QR_CODE = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_QR_CODE = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_QR_CODE_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_QR_CODE_CONTENT_TYPE = "image/png";

    @Autowired
    private ServiceQuoteRepository serviceQuoteRepository;

    /**
     * This repository is mocked in the com.sistema.amigo.repository.search test package.
     *
     * @see com.sistema.amigo.repository.search.ServiceQuoteSearchRepositoryMockConfiguration
     */
    @Autowired
    private ServiceQuoteSearchRepository mockServiceQuoteSearchRepository;

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

    private MockMvc restServiceQuoteMockMvc;

    private ServiceQuote serviceQuote;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final ServiceQuoteResource serviceQuoteResource = new ServiceQuoteResource(serviceQuoteRepository, mockServiceQuoteSearchRepository);
        this.restServiceQuoteMockMvc = MockMvcBuilders.standaloneSetup(serviceQuoteResource)
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
    public static ServiceQuote createEntity(EntityManager em) {
        ServiceQuote serviceQuote = new ServiceQuote()
            .title(DEFAULT_TITLE)
            .description(DEFAULT_DESCRIPTION)
            .quantity(DEFAULT_QUANTITY)
            .price(DEFAULT_PRICE)
            .unit(DEFAULT_UNIT)
            .expeditionDate(DEFAULT_EXPEDITION_DATE)
            .expirationDate(DEFAULT_EXPIRATION_DATE)
            .status(DEFAULT_STATUS)
            .currency(DEFAULT_CURRENCY)
            .approvedBy(DEFAULT_APPROVED_BY)
            .qrCode(DEFAULT_QR_CODE)
            .qrCodeContentType(DEFAULT_QR_CODE_CONTENT_TYPE);
        return serviceQuote;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ServiceQuote createUpdatedEntity(EntityManager em) {
        ServiceQuote serviceQuote = new ServiceQuote()
            .title(UPDATED_TITLE)
            .description(UPDATED_DESCRIPTION)
            .quantity(UPDATED_QUANTITY)
            .price(UPDATED_PRICE)
            .unit(UPDATED_UNIT)
            .expeditionDate(UPDATED_EXPEDITION_DATE)
            .expirationDate(UPDATED_EXPIRATION_DATE)
            .status(UPDATED_STATUS)
            .currency(UPDATED_CURRENCY)
            .approvedBy(UPDATED_APPROVED_BY)
            .qrCode(UPDATED_QR_CODE)
            .qrCodeContentType(UPDATED_QR_CODE_CONTENT_TYPE);
        return serviceQuote;
    }

    @BeforeEach
    public void initTest() {
        serviceQuote = createEntity(em);
    }

    @Test
    @Transactional
    public void createServiceQuote() throws Exception {
        int databaseSizeBeforeCreate = serviceQuoteRepository.findAll().size();

        // Create the ServiceQuote
        restServiceQuoteMockMvc.perform(post("/api/service-quotes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(serviceQuote)))
            .andExpect(status().isCreated());

        // Validate the ServiceQuote in the database
        List<ServiceQuote> serviceQuoteList = serviceQuoteRepository.findAll();
        assertThat(serviceQuoteList).hasSize(databaseSizeBeforeCreate + 1);
        ServiceQuote testServiceQuote = serviceQuoteList.get(serviceQuoteList.size() - 1);
        assertThat(testServiceQuote.getTitle()).isEqualTo(DEFAULT_TITLE);
        assertThat(testServiceQuote.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testServiceQuote.getQuantity()).isEqualTo(DEFAULT_QUANTITY);
        assertThat(testServiceQuote.getPrice()).isEqualTo(DEFAULT_PRICE);
        assertThat(testServiceQuote.getUnit()).isEqualTo(DEFAULT_UNIT);
        assertThat(testServiceQuote.getExpeditionDate()).isEqualTo(DEFAULT_EXPEDITION_DATE);
        assertThat(testServiceQuote.getExpirationDate()).isEqualTo(DEFAULT_EXPIRATION_DATE);
        assertThat(testServiceQuote.getStatus()).isEqualTo(DEFAULT_STATUS);
        assertThat(testServiceQuote.getCurrency()).isEqualTo(DEFAULT_CURRENCY);
        assertThat(testServiceQuote.getApprovedBy()).isEqualTo(DEFAULT_APPROVED_BY);
        assertThat(testServiceQuote.getQrCode()).isEqualTo(DEFAULT_QR_CODE);
        assertThat(testServiceQuote.getQrCodeContentType()).isEqualTo(DEFAULT_QR_CODE_CONTENT_TYPE);

        // Validate the ServiceQuote in Elasticsearch
        verify(mockServiceQuoteSearchRepository, times(1)).save(testServiceQuote);
    }

    @Test
    @Transactional
    public void createServiceQuoteWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = serviceQuoteRepository.findAll().size();

        // Create the ServiceQuote with an existing ID
        serviceQuote.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restServiceQuoteMockMvc.perform(post("/api/service-quotes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(serviceQuote)))
            .andExpect(status().isBadRequest());

        // Validate the ServiceQuote in the database
        List<ServiceQuote> serviceQuoteList = serviceQuoteRepository.findAll();
        assertThat(serviceQuoteList).hasSize(databaseSizeBeforeCreate);

        // Validate the ServiceQuote in Elasticsearch
        verify(mockServiceQuoteSearchRepository, times(0)).save(serviceQuote);
    }


    @Test
    @Transactional
    public void checkTitleIsRequired() throws Exception {
        int databaseSizeBeforeTest = serviceQuoteRepository.findAll().size();
        // set the field null
        serviceQuote.setTitle(null);

        // Create the ServiceQuote, which fails.

        restServiceQuoteMockMvc.perform(post("/api/service-quotes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(serviceQuote)))
            .andExpect(status().isBadRequest());

        List<ServiceQuote> serviceQuoteList = serviceQuoteRepository.findAll();
        assertThat(serviceQuoteList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkDescriptionIsRequired() throws Exception {
        int databaseSizeBeforeTest = serviceQuoteRepository.findAll().size();
        // set the field null
        serviceQuote.setDescription(null);

        // Create the ServiceQuote, which fails.

        restServiceQuoteMockMvc.perform(post("/api/service-quotes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(serviceQuote)))
            .andExpect(status().isBadRequest());

        List<ServiceQuote> serviceQuoteList = serviceQuoteRepository.findAll();
        assertThat(serviceQuoteList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkUnitIsRequired() throws Exception {
        int databaseSizeBeforeTest = serviceQuoteRepository.findAll().size();
        // set the field null
        serviceQuote.setUnit(null);

        // Create the ServiceQuote, which fails.

        restServiceQuoteMockMvc.perform(post("/api/service-quotes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(serviceQuote)))
            .andExpect(status().isBadRequest());

        List<ServiceQuote> serviceQuoteList = serviceQuoteRepository.findAll();
        assertThat(serviceQuoteList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkCurrencyIsRequired() throws Exception {
        int databaseSizeBeforeTest = serviceQuoteRepository.findAll().size();
        // set the field null
        serviceQuote.setCurrency(null);

        // Create the ServiceQuote, which fails.

        restServiceQuoteMockMvc.perform(post("/api/service-quotes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(serviceQuote)))
            .andExpect(status().isBadRequest());

        List<ServiceQuote> serviceQuoteList = serviceQuoteRepository.findAll();
        assertThat(serviceQuoteList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllServiceQuotes() throws Exception {
        // Initialize the database
        serviceQuoteRepository.saveAndFlush(serviceQuote);

        // Get all the serviceQuoteList
        restServiceQuoteMockMvc.perform(get("/api/service-quotes?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(serviceQuote.getId().intValue())))
            .andExpect(jsonPath("$.[*].title").value(hasItem(DEFAULT_TITLE.toString())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())))
            .andExpect(jsonPath("$.[*].quantity").value(hasItem(DEFAULT_QUANTITY)))
            .andExpect(jsonPath("$.[*].price").value(hasItem(DEFAULT_PRICE.doubleValue())))
            .andExpect(jsonPath("$.[*].unit").value(hasItem(DEFAULT_UNIT.toString())))
            .andExpect(jsonPath("$.[*].expeditionDate").value(hasItem(DEFAULT_EXPEDITION_DATE.toString())))
            .andExpect(jsonPath("$.[*].expirationDate").value(hasItem(DEFAULT_EXPIRATION_DATE.toString())))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())))
            .andExpect(jsonPath("$.[*].currency").value(hasItem(DEFAULT_CURRENCY.toString())))
            .andExpect(jsonPath("$.[*].approvedBy").value(hasItem(DEFAULT_APPROVED_BY.toString())))
            .andExpect(jsonPath("$.[*].qrCodeContentType").value(hasItem(DEFAULT_QR_CODE_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].qrCode").value(hasItem(Base64Utils.encodeToString(DEFAULT_QR_CODE))));
    }
    
    @Test
    @Transactional
    public void getServiceQuote() throws Exception {
        // Initialize the database
        serviceQuoteRepository.saveAndFlush(serviceQuote);

        // Get the serviceQuote
        restServiceQuoteMockMvc.perform(get("/api/service-quotes/{id}", serviceQuote.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(serviceQuote.getId().intValue()))
            .andExpect(jsonPath("$.title").value(DEFAULT_TITLE.toString()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION.toString()))
            .andExpect(jsonPath("$.quantity").value(DEFAULT_QUANTITY))
            .andExpect(jsonPath("$.price").value(DEFAULT_PRICE.doubleValue()))
            .andExpect(jsonPath("$.unit").value(DEFAULT_UNIT.toString()))
            .andExpect(jsonPath("$.expeditionDate").value(DEFAULT_EXPEDITION_DATE.toString()))
            .andExpect(jsonPath("$.expirationDate").value(DEFAULT_EXPIRATION_DATE.toString()))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS.toString()))
            .andExpect(jsonPath("$.currency").value(DEFAULT_CURRENCY.toString()))
            .andExpect(jsonPath("$.approvedBy").value(DEFAULT_APPROVED_BY.toString()))
            .andExpect(jsonPath("$.qrCodeContentType").value(DEFAULT_QR_CODE_CONTENT_TYPE))
            .andExpect(jsonPath("$.qrCode").value(Base64Utils.encodeToString(DEFAULT_QR_CODE)));
    }

    @Test
    @Transactional
    public void getNonExistingServiceQuote() throws Exception {
        // Get the serviceQuote
        restServiceQuoteMockMvc.perform(get("/api/service-quotes/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateServiceQuote() throws Exception {
        // Initialize the database
        serviceQuoteRepository.saveAndFlush(serviceQuote);

        int databaseSizeBeforeUpdate = serviceQuoteRepository.findAll().size();

        // Update the serviceQuote
        ServiceQuote updatedServiceQuote = serviceQuoteRepository.findById(serviceQuote.getId()).get();
        // Disconnect from session so that the updates on updatedServiceQuote are not directly saved in db
        em.detach(updatedServiceQuote);
        updatedServiceQuote
            .title(UPDATED_TITLE)
            .description(UPDATED_DESCRIPTION)
            .quantity(UPDATED_QUANTITY)
            .price(UPDATED_PRICE)
            .unit(UPDATED_UNIT)
            .expeditionDate(UPDATED_EXPEDITION_DATE)
            .expirationDate(UPDATED_EXPIRATION_DATE)
            .status(UPDATED_STATUS)
            .currency(UPDATED_CURRENCY)
            .approvedBy(UPDATED_APPROVED_BY)
            .qrCode(UPDATED_QR_CODE)
            .qrCodeContentType(UPDATED_QR_CODE_CONTENT_TYPE);

        restServiceQuoteMockMvc.perform(put("/api/service-quotes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedServiceQuote)))
            .andExpect(status().isOk());

        // Validate the ServiceQuote in the database
        List<ServiceQuote> serviceQuoteList = serviceQuoteRepository.findAll();
        assertThat(serviceQuoteList).hasSize(databaseSizeBeforeUpdate);
        ServiceQuote testServiceQuote = serviceQuoteList.get(serviceQuoteList.size() - 1);
        assertThat(testServiceQuote.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testServiceQuote.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testServiceQuote.getQuantity()).isEqualTo(UPDATED_QUANTITY);
        assertThat(testServiceQuote.getPrice()).isEqualTo(UPDATED_PRICE);
        assertThat(testServiceQuote.getUnit()).isEqualTo(UPDATED_UNIT);
        assertThat(testServiceQuote.getExpeditionDate()).isEqualTo(UPDATED_EXPEDITION_DATE);
        assertThat(testServiceQuote.getExpirationDate()).isEqualTo(UPDATED_EXPIRATION_DATE);
        assertThat(testServiceQuote.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testServiceQuote.getCurrency()).isEqualTo(UPDATED_CURRENCY);
        assertThat(testServiceQuote.getApprovedBy()).isEqualTo(UPDATED_APPROVED_BY);
        assertThat(testServiceQuote.getQrCode()).isEqualTo(UPDATED_QR_CODE);
        assertThat(testServiceQuote.getQrCodeContentType()).isEqualTo(UPDATED_QR_CODE_CONTENT_TYPE);

        // Validate the ServiceQuote in Elasticsearch
        verify(mockServiceQuoteSearchRepository, times(1)).save(testServiceQuote);
    }

    @Test
    @Transactional
    public void updateNonExistingServiceQuote() throws Exception {
        int databaseSizeBeforeUpdate = serviceQuoteRepository.findAll().size();

        // Create the ServiceQuote

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restServiceQuoteMockMvc.perform(put("/api/service-quotes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(serviceQuote)))
            .andExpect(status().isBadRequest());

        // Validate the ServiceQuote in the database
        List<ServiceQuote> serviceQuoteList = serviceQuoteRepository.findAll();
        assertThat(serviceQuoteList).hasSize(databaseSizeBeforeUpdate);

        // Validate the ServiceQuote in Elasticsearch
        verify(mockServiceQuoteSearchRepository, times(0)).save(serviceQuote);
    }

    @Test
    @Transactional
    public void deleteServiceQuote() throws Exception {
        // Initialize the database
        serviceQuoteRepository.saveAndFlush(serviceQuote);

        int databaseSizeBeforeDelete = serviceQuoteRepository.findAll().size();

        // Delete the serviceQuote
        restServiceQuoteMockMvc.perform(delete("/api/service-quotes/{id}", serviceQuote.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ServiceQuote> serviceQuoteList = serviceQuoteRepository.findAll();
        assertThat(serviceQuoteList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the ServiceQuote in Elasticsearch
        verify(mockServiceQuoteSearchRepository, times(1)).deleteById(serviceQuote.getId());
    }

    @Test
    @Transactional
    public void searchServiceQuote() throws Exception {
        // Initialize the database
        serviceQuoteRepository.saveAndFlush(serviceQuote);
        when(mockServiceQuoteSearchRepository.search(queryStringQuery("id:" + serviceQuote.getId())))
            .thenReturn(Collections.singletonList(serviceQuote));
        // Search the serviceQuote
        restServiceQuoteMockMvc.perform(get("/api/_search/service-quotes?query=id:" + serviceQuote.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(serviceQuote.getId().intValue())))
            .andExpect(jsonPath("$.[*].title").value(hasItem(DEFAULT_TITLE)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].quantity").value(hasItem(DEFAULT_QUANTITY)))
            .andExpect(jsonPath("$.[*].price").value(hasItem(DEFAULT_PRICE.doubleValue())))
            .andExpect(jsonPath("$.[*].unit").value(hasItem(DEFAULT_UNIT.toString())))
            .andExpect(jsonPath("$.[*].expeditionDate").value(hasItem(DEFAULT_EXPEDITION_DATE.toString())))
            .andExpect(jsonPath("$.[*].expirationDate").value(hasItem(DEFAULT_EXPIRATION_DATE.toString())))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())))
            .andExpect(jsonPath("$.[*].currency").value(hasItem(DEFAULT_CURRENCY.toString())))
            .andExpect(jsonPath("$.[*].approvedBy").value(hasItem(DEFAULT_APPROVED_BY)))
            .andExpect(jsonPath("$.[*].qrCodeContentType").value(hasItem(DEFAULT_QR_CODE_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].qrCode").value(hasItem(Base64Utils.encodeToString(DEFAULT_QR_CODE))));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ServiceQuote.class);
        ServiceQuote serviceQuote1 = new ServiceQuote();
        serviceQuote1.setId(1L);
        ServiceQuote serviceQuote2 = new ServiceQuote();
        serviceQuote2.setId(serviceQuote1.getId());
        assertThat(serviceQuote1).isEqualTo(serviceQuote2);
        serviceQuote2.setId(2L);
        assertThat(serviceQuote1).isNotEqualTo(serviceQuote2);
        serviceQuote1.setId(null);
        assertThat(serviceQuote1).isNotEqualTo(serviceQuote2);
    }
}
