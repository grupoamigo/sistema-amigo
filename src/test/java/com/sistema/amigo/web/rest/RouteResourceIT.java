package com.sistema.amigo.web.rest;

import com.sistema.amigo.SistemaAmigoApp;
import com.sistema.amigo.domain.Route;
import com.sistema.amigo.repository.RouteRepository;
import com.sistema.amigo.repository.search.RouteSearchRepository;
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

import com.sistema.amigo.domain.enumeration.CurrencyType;
/**
 * Integration tests for the {@link RouteResource} REST controller.
 */
@SpringBootTest(classes = SistemaAmigoApp.class)
public class RouteResourceIT {

    private static final Float DEFAULT_PRICE = 1F;
    private static final Float UPDATED_PRICE = 2F;
    private static final Float SMALLER_PRICE = 1F - 1F;

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final CurrencyType DEFAULT_CURRENCY = CurrencyType.MXN;
    private static final CurrencyType UPDATED_CURRENCY = CurrencyType.USD;

    @Autowired
    private RouteRepository routeRepository;

    /**
     * This repository is mocked in the com.sistema.amigo.repository.search test package.
     *
     * @see com.sistema.amigo.repository.search.RouteSearchRepositoryMockConfiguration
     */
    @Autowired
    private RouteSearchRepository mockRouteSearchRepository;

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

    private MockMvc restRouteMockMvc;

    private Route route;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final RouteResource routeResource = new RouteResource(routeRepository, mockRouteSearchRepository);
        this.restRouteMockMvc = MockMvcBuilders.standaloneSetup(routeResource)
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
    public static Route createEntity(EntityManager em) {
        Route route = new Route()
            .price(DEFAULT_PRICE)
            .name(DEFAULT_NAME)
            .currency(DEFAULT_CURRENCY);
        return route;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Route createUpdatedEntity(EntityManager em) {
        Route route = new Route()
            .price(UPDATED_PRICE)
            .name(UPDATED_NAME)
            .currency(UPDATED_CURRENCY);
        return route;
    }

    @BeforeEach
    public void initTest() {
        route = createEntity(em);
    }

    @Test
    @Transactional
    public void createRoute() throws Exception {
        int databaseSizeBeforeCreate = routeRepository.findAll().size();

        // Create the Route
        restRouteMockMvc.perform(post("/api/routes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(route)))
            .andExpect(status().isCreated());

        // Validate the Route in the database
        List<Route> routeList = routeRepository.findAll();
        assertThat(routeList).hasSize(databaseSizeBeforeCreate + 1);
        Route testRoute = routeList.get(routeList.size() - 1);
        assertThat(testRoute.getPrice()).isEqualTo(DEFAULT_PRICE);
        assertThat(testRoute.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testRoute.getCurrency()).isEqualTo(DEFAULT_CURRENCY);

        // Validate the Route in Elasticsearch
        verify(mockRouteSearchRepository, times(1)).save(testRoute);
    }

    @Test
    @Transactional
    public void createRouteWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = routeRepository.findAll().size();

        // Create the Route with an existing ID
        route.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restRouteMockMvc.perform(post("/api/routes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(route)))
            .andExpect(status().isBadRequest());

        // Validate the Route in the database
        List<Route> routeList = routeRepository.findAll();
        assertThat(routeList).hasSize(databaseSizeBeforeCreate);

        // Validate the Route in Elasticsearch
        verify(mockRouteSearchRepository, times(0)).save(route);
    }


    @Test
    @Transactional
    public void getAllRoutes() throws Exception {
        // Initialize the database
        routeRepository.saveAndFlush(route);

        // Get all the routeList
        restRouteMockMvc.perform(get("/api/routes?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(route.getId().intValue())))
            .andExpect(jsonPath("$.[*].price").value(hasItem(DEFAULT_PRICE.doubleValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].currency").value(hasItem(DEFAULT_CURRENCY.toString())));
    }
    
    @Test
    @Transactional
    public void getRoute() throws Exception {
        // Initialize the database
        routeRepository.saveAndFlush(route);

        // Get the route
        restRouteMockMvc.perform(get("/api/routes/{id}", route.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(route.getId().intValue()))
            .andExpect(jsonPath("$.price").value(DEFAULT_PRICE.doubleValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()))
            .andExpect(jsonPath("$.currency").value(DEFAULT_CURRENCY.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingRoute() throws Exception {
        // Get the route
        restRouteMockMvc.perform(get("/api/routes/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateRoute() throws Exception {
        // Initialize the database
        routeRepository.saveAndFlush(route);

        int databaseSizeBeforeUpdate = routeRepository.findAll().size();

        // Update the route
        Route updatedRoute = routeRepository.findById(route.getId()).get();
        // Disconnect from session so that the updates on updatedRoute are not directly saved in db
        em.detach(updatedRoute);
        updatedRoute
            .price(UPDATED_PRICE)
            .name(UPDATED_NAME)
            .currency(UPDATED_CURRENCY);

        restRouteMockMvc.perform(put("/api/routes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedRoute)))
            .andExpect(status().isOk());

        // Validate the Route in the database
        List<Route> routeList = routeRepository.findAll();
        assertThat(routeList).hasSize(databaseSizeBeforeUpdate);
        Route testRoute = routeList.get(routeList.size() - 1);
        assertThat(testRoute.getPrice()).isEqualTo(UPDATED_PRICE);
        assertThat(testRoute.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testRoute.getCurrency()).isEqualTo(UPDATED_CURRENCY);

        // Validate the Route in Elasticsearch
        verify(mockRouteSearchRepository, times(1)).save(testRoute);
    }

    @Test
    @Transactional
    public void updateNonExistingRoute() throws Exception {
        int databaseSizeBeforeUpdate = routeRepository.findAll().size();

        // Create the Route

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restRouteMockMvc.perform(put("/api/routes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(route)))
            .andExpect(status().isBadRequest());

        // Validate the Route in the database
        List<Route> routeList = routeRepository.findAll();
        assertThat(routeList).hasSize(databaseSizeBeforeUpdate);

        // Validate the Route in Elasticsearch
        verify(mockRouteSearchRepository, times(0)).save(route);
    }

    @Test
    @Transactional
    public void deleteRoute() throws Exception {
        // Initialize the database
        routeRepository.saveAndFlush(route);

        int databaseSizeBeforeDelete = routeRepository.findAll().size();

        // Delete the route
        restRouteMockMvc.perform(delete("/api/routes/{id}", route.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Route> routeList = routeRepository.findAll();
        assertThat(routeList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the Route in Elasticsearch
        verify(mockRouteSearchRepository, times(1)).deleteById(route.getId());
    }

    @Test
    @Transactional
    public void searchRoute() throws Exception {
        // Initialize the database
        routeRepository.saveAndFlush(route);
        when(mockRouteSearchRepository.search(queryStringQuery("id:" + route.getId())))
            .thenReturn(Collections.singletonList(route));
        // Search the route
        restRouteMockMvc.perform(get("/api/_search/routes?query=id:" + route.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(route.getId().intValue())))
            .andExpect(jsonPath("$.[*].price").value(hasItem(DEFAULT_PRICE.doubleValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].currency").value(hasItem(DEFAULT_CURRENCY.toString())));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Route.class);
        Route route1 = new Route();
        route1.setId(1L);
        Route route2 = new Route();
        route2.setId(route1.getId());
        assertThat(route1).isEqualTo(route2);
        route2.setId(2L);
        assertThat(route1).isNotEqualTo(route2);
        route1.setId(null);
        assertThat(route1).isNotEqualTo(route2);
    }
}
