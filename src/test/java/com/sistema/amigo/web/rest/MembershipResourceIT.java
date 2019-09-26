package com.sistema.amigo.web.rest;

import com.sistema.amigo.SistemaAmigoApp;
import com.sistema.amigo.domain.Membership;
import com.sistema.amigo.repository.MembershipRepository;
import com.sistema.amigo.repository.search.MembershipSearchRepository;
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

import com.sistema.amigo.domain.enumeration.MembershipRole;
import com.sistema.amigo.domain.enumeration.MembershipLevelType;
/**
 * Integration tests for the {@link MembershipResource} REST controller.
 */
@SpringBootTest(classes = SistemaAmigoApp.class)
public class MembershipResourceIT {

    private static final String DEFAULT_PHONE = "AAAAAAAAAA";
    private static final String UPDATED_PHONE = "BBBBBBBBBB";

    private static final MembershipRole DEFAULT_ROLE = MembershipRole.CEO;
    private static final MembershipRole UPDATED_ROLE = MembershipRole.VP;

    private static final byte[] DEFAULT_PROFILE_PICTURE = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_PROFILE_PICTURE = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_PROFILE_PICTURE_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_PROFILE_PICTURE_CONTENT_TYPE = "image/png";

    private static final Instant DEFAULT_CREATED = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_CREATED = Instant.now().truncatedTo(ChronoUnit.MILLIS);
    private static final Instant SMALLER_CREATED = Instant.ofEpochMilli(-1L);

    private static final LocalDate DEFAULT_EXPIRES = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_EXPIRES = LocalDate.now(ZoneId.systemDefault());
    private static final LocalDate SMALLER_EXPIRES = LocalDate.ofEpochDay(-1L);

    private static final MembershipLevelType DEFAULT_ACCOUNT_LEVEL = MembershipLevelType.FREE;
    private static final MembershipLevelType UPDATED_ACCOUNT_LEVEL = MembershipLevelType.BASIC;

    private static final Boolean DEFAULT_VERIFIED = false;
    private static final Boolean UPDATED_VERIFIED = true;

    @Autowired
    private MembershipRepository membershipRepository;

    /**
     * This repository is mocked in the com.sistema.amigo.repository.search test package.
     *
     * @see com.sistema.amigo.repository.search.MembershipSearchRepositoryMockConfiguration
     */
    @Autowired
    private MembershipSearchRepository mockMembershipSearchRepository;

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

    private MockMvc restMembershipMockMvc;

    private Membership membership;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final MembershipResource membershipResource = new MembershipResource(membershipRepository, mockMembershipSearchRepository);
        this.restMembershipMockMvc = MockMvcBuilders.standaloneSetup(membershipResource)
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
    public static Membership createEntity(EntityManager em) {
        Membership membership = new Membership()
            .phone(DEFAULT_PHONE)
            .role(DEFAULT_ROLE)
            .profilePicture(DEFAULT_PROFILE_PICTURE)
            .profilePictureContentType(DEFAULT_PROFILE_PICTURE_CONTENT_TYPE)
            .created(DEFAULT_CREATED)
            .expires(DEFAULT_EXPIRES)
            .accountLevel(DEFAULT_ACCOUNT_LEVEL)
            .verified(DEFAULT_VERIFIED);
        return membership;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Membership createUpdatedEntity(EntityManager em) {
        Membership membership = new Membership()
            .phone(UPDATED_PHONE)
            .role(UPDATED_ROLE)
            .profilePicture(UPDATED_PROFILE_PICTURE)
            .profilePictureContentType(UPDATED_PROFILE_PICTURE_CONTENT_TYPE)
            .created(UPDATED_CREATED)
            .expires(UPDATED_EXPIRES)
            .accountLevel(UPDATED_ACCOUNT_LEVEL)
            .verified(UPDATED_VERIFIED);
        return membership;
    }

    @BeforeEach
    public void initTest() {
        membership = createEntity(em);
    }

    @Test
    @Transactional
    public void createMembership() throws Exception {
        int databaseSizeBeforeCreate = membershipRepository.findAll().size();

        // Create the Membership
        restMembershipMockMvc.perform(post("/api/memberships")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(membership)))
            .andExpect(status().isCreated());

        // Validate the Membership in the database
        List<Membership> membershipList = membershipRepository.findAll();
        assertThat(membershipList).hasSize(databaseSizeBeforeCreate + 1);
        Membership testMembership = membershipList.get(membershipList.size() - 1);
        assertThat(testMembership.getPhone()).isEqualTo(DEFAULT_PHONE);
        assertThat(testMembership.getRole()).isEqualTo(DEFAULT_ROLE);
        assertThat(testMembership.getProfilePicture()).isEqualTo(DEFAULT_PROFILE_PICTURE);
        assertThat(testMembership.getProfilePictureContentType()).isEqualTo(DEFAULT_PROFILE_PICTURE_CONTENT_TYPE);
        assertThat(testMembership.getCreated()).isEqualTo(DEFAULT_CREATED);
        assertThat(testMembership.getExpires()).isEqualTo(DEFAULT_EXPIRES);
        assertThat(testMembership.getAccountLevel()).isEqualTo(DEFAULT_ACCOUNT_LEVEL);
        assertThat(testMembership.isVerified()).isEqualTo(DEFAULT_VERIFIED);

        // Validate the Membership in Elasticsearch
        verify(mockMembershipSearchRepository, times(1)).save(testMembership);
    }

    @Test
    @Transactional
    public void createMembershipWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = membershipRepository.findAll().size();

        // Create the Membership with an existing ID
        membership.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restMembershipMockMvc.perform(post("/api/memberships")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(membership)))
            .andExpect(status().isBadRequest());

        // Validate the Membership in the database
        List<Membership> membershipList = membershipRepository.findAll();
        assertThat(membershipList).hasSize(databaseSizeBeforeCreate);

        // Validate the Membership in Elasticsearch
        verify(mockMembershipSearchRepository, times(0)).save(membership);
    }


    @Test
    @Transactional
    public void getAllMemberships() throws Exception {
        // Initialize the database
        membershipRepository.saveAndFlush(membership);

        // Get all the membershipList
        restMembershipMockMvc.perform(get("/api/memberships?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(membership.getId().intValue())))
            .andExpect(jsonPath("$.[*].phone").value(hasItem(DEFAULT_PHONE.toString())))
            .andExpect(jsonPath("$.[*].role").value(hasItem(DEFAULT_ROLE.toString())))
            .andExpect(jsonPath("$.[*].profilePictureContentType").value(hasItem(DEFAULT_PROFILE_PICTURE_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].profilePicture").value(hasItem(Base64Utils.encodeToString(DEFAULT_PROFILE_PICTURE))))
            .andExpect(jsonPath("$.[*].created").value(hasItem(DEFAULT_CREATED.toString())))
            .andExpect(jsonPath("$.[*].expires").value(hasItem(DEFAULT_EXPIRES.toString())))
            .andExpect(jsonPath("$.[*].accountLevel").value(hasItem(DEFAULT_ACCOUNT_LEVEL.toString())))
            .andExpect(jsonPath("$.[*].verified").value(hasItem(DEFAULT_VERIFIED.booleanValue())));
    }
    
    @Test
    @Transactional
    public void getMembership() throws Exception {
        // Initialize the database
        membershipRepository.saveAndFlush(membership);

        // Get the membership
        restMembershipMockMvc.perform(get("/api/memberships/{id}", membership.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(membership.getId().intValue()))
            .andExpect(jsonPath("$.phone").value(DEFAULT_PHONE.toString()))
            .andExpect(jsonPath("$.role").value(DEFAULT_ROLE.toString()))
            .andExpect(jsonPath("$.profilePictureContentType").value(DEFAULT_PROFILE_PICTURE_CONTENT_TYPE))
            .andExpect(jsonPath("$.profilePicture").value(Base64Utils.encodeToString(DEFAULT_PROFILE_PICTURE)))
            .andExpect(jsonPath("$.created").value(DEFAULT_CREATED.toString()))
            .andExpect(jsonPath("$.expires").value(DEFAULT_EXPIRES.toString()))
            .andExpect(jsonPath("$.accountLevel").value(DEFAULT_ACCOUNT_LEVEL.toString()))
            .andExpect(jsonPath("$.verified").value(DEFAULT_VERIFIED.booleanValue()));
    }

    @Test
    @Transactional
    public void getNonExistingMembership() throws Exception {
        // Get the membership
        restMembershipMockMvc.perform(get("/api/memberships/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateMembership() throws Exception {
        // Initialize the database
        membershipRepository.saveAndFlush(membership);

        int databaseSizeBeforeUpdate = membershipRepository.findAll().size();

        // Update the membership
        Membership updatedMembership = membershipRepository.findById(membership.getId()).get();
        // Disconnect from session so that the updates on updatedMembership are not directly saved in db
        em.detach(updatedMembership);
        updatedMembership
            .phone(UPDATED_PHONE)
            .role(UPDATED_ROLE)
            .profilePicture(UPDATED_PROFILE_PICTURE)
            .profilePictureContentType(UPDATED_PROFILE_PICTURE_CONTENT_TYPE)
            .created(UPDATED_CREATED)
            .expires(UPDATED_EXPIRES)
            .accountLevel(UPDATED_ACCOUNT_LEVEL)
            .verified(UPDATED_VERIFIED);

        restMembershipMockMvc.perform(put("/api/memberships")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedMembership)))
            .andExpect(status().isOk());

        // Validate the Membership in the database
        List<Membership> membershipList = membershipRepository.findAll();
        assertThat(membershipList).hasSize(databaseSizeBeforeUpdate);
        Membership testMembership = membershipList.get(membershipList.size() - 1);
        assertThat(testMembership.getPhone()).isEqualTo(UPDATED_PHONE);
        assertThat(testMembership.getRole()).isEqualTo(UPDATED_ROLE);
        assertThat(testMembership.getProfilePicture()).isEqualTo(UPDATED_PROFILE_PICTURE);
        assertThat(testMembership.getProfilePictureContentType()).isEqualTo(UPDATED_PROFILE_PICTURE_CONTENT_TYPE);
        assertThat(testMembership.getCreated()).isEqualTo(UPDATED_CREATED);
        assertThat(testMembership.getExpires()).isEqualTo(UPDATED_EXPIRES);
        assertThat(testMembership.getAccountLevel()).isEqualTo(UPDATED_ACCOUNT_LEVEL);
        assertThat(testMembership.isVerified()).isEqualTo(UPDATED_VERIFIED);

        // Validate the Membership in Elasticsearch
        verify(mockMembershipSearchRepository, times(1)).save(testMembership);
    }

    @Test
    @Transactional
    public void updateNonExistingMembership() throws Exception {
        int databaseSizeBeforeUpdate = membershipRepository.findAll().size();

        // Create the Membership

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMembershipMockMvc.perform(put("/api/memberships")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(membership)))
            .andExpect(status().isBadRequest());

        // Validate the Membership in the database
        List<Membership> membershipList = membershipRepository.findAll();
        assertThat(membershipList).hasSize(databaseSizeBeforeUpdate);

        // Validate the Membership in Elasticsearch
        verify(mockMembershipSearchRepository, times(0)).save(membership);
    }

    @Test
    @Transactional
    public void deleteMembership() throws Exception {
        // Initialize the database
        membershipRepository.saveAndFlush(membership);

        int databaseSizeBeforeDelete = membershipRepository.findAll().size();

        // Delete the membership
        restMembershipMockMvc.perform(delete("/api/memberships/{id}", membership.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Membership> membershipList = membershipRepository.findAll();
        assertThat(membershipList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the Membership in Elasticsearch
        verify(mockMembershipSearchRepository, times(1)).deleteById(membership.getId());
    }

    @Test
    @Transactional
    public void searchMembership() throws Exception {
        // Initialize the database
        membershipRepository.saveAndFlush(membership);
        when(mockMembershipSearchRepository.search(queryStringQuery("id:" + membership.getId())))
            .thenReturn(Collections.singletonList(membership));
        // Search the membership
        restMembershipMockMvc.perform(get("/api/_search/memberships?query=id:" + membership.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(membership.getId().intValue())))
            .andExpect(jsonPath("$.[*].phone").value(hasItem(DEFAULT_PHONE)))
            .andExpect(jsonPath("$.[*].role").value(hasItem(DEFAULT_ROLE.toString())))
            .andExpect(jsonPath("$.[*].profilePictureContentType").value(hasItem(DEFAULT_PROFILE_PICTURE_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].profilePicture").value(hasItem(Base64Utils.encodeToString(DEFAULT_PROFILE_PICTURE))))
            .andExpect(jsonPath("$.[*].created").value(hasItem(DEFAULT_CREATED.toString())))
            .andExpect(jsonPath("$.[*].expires").value(hasItem(DEFAULT_EXPIRES.toString())))
            .andExpect(jsonPath("$.[*].accountLevel").value(hasItem(DEFAULT_ACCOUNT_LEVEL.toString())))
            .andExpect(jsonPath("$.[*].verified").value(hasItem(DEFAULT_VERIFIED.booleanValue())));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Membership.class);
        Membership membership1 = new Membership();
        membership1.setId(1L);
        Membership membership2 = new Membership();
        membership2.setId(membership1.getId());
        assertThat(membership1).isEqualTo(membership2);
        membership2.setId(2L);
        assertThat(membership1).isNotEqualTo(membership2);
        membership1.setId(null);
        assertThat(membership1).isNotEqualTo(membership2);
    }
}
