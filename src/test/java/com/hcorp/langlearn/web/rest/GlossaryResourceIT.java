package com.hcorp.langlearn.web.rest;

import com.hcorp.langlearn.LangLearnHipsterApp;
import com.hcorp.langlearn.domain.Glossary;
import com.hcorp.langlearn.repository.GlossaryRepository;
import com.hcorp.langlearn.web.rest.errors.ExceptionTranslator;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.Validator;

import javax.persistence.EntityManager;
import java.util.ArrayList;
import java.util.List;

import static com.hcorp.langlearn.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the {@link GlossaryResource} REST controller.
 */
@SpringBootTest(classes = LangLearnHipsterApp.class)
public class GlossaryResourceIT {

    private static final String DEFAULT_GLOS_NAME = "AAAAAAAAAA";
    private static final String UPDATED_GLOS_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_LANG_1 = "AAAAAAAAAA";
    private static final String UPDATED_LANG_1 = "BBBBBBBBBB";

    private static final String DEFAULT_LANG_2 = "AAAAAAAAAA";
    private static final String UPDATED_LANG_2 = "BBBBBBBBBB";

    @Autowired
    private GlossaryRepository glossaryRepository;

    @Mock
    private GlossaryRepository glossaryRepositoryMock;

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

    private MockMvc restGlossaryMockMvc;

    private Glossary glossary;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final GlossaryResource glossaryResource = new GlossaryResource(glossaryRepository);
        this.restGlossaryMockMvc = MockMvcBuilders.standaloneSetup(glossaryResource)
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
    public static Glossary createEntity(EntityManager em) {
        Glossary glossary = new Glossary()
            .glosName(DEFAULT_GLOS_NAME)
            .lang1(DEFAULT_LANG_1)
            .lang2(DEFAULT_LANG_2);
        return glossary;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Glossary createUpdatedEntity(EntityManager em) {
        Glossary glossary = new Glossary()
            .glosName(UPDATED_GLOS_NAME)
            .lang1(UPDATED_LANG_1)
            .lang2(UPDATED_LANG_2);
        return glossary;
    }

    @BeforeEach
    public void initTest() {
        glossary = createEntity(em);
    }

    @Test
    @Transactional
    public void createGlossary() throws Exception {
        int databaseSizeBeforeCreate = glossaryRepository.findAll().size();

        // Create the Glossary
        restGlossaryMockMvc.perform(post("/api/glossaries")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(glossary)))
            .andExpect(status().isCreated());

        // Validate the Glossary in the database
        List<Glossary> glossaryList = glossaryRepository.findAll();
        assertThat(glossaryList).hasSize(databaseSizeBeforeCreate + 1);
        Glossary testGlossary = glossaryList.get(glossaryList.size() - 1);
        assertThat(testGlossary.getGlosName()).isEqualTo(DEFAULT_GLOS_NAME);
        assertThat(testGlossary.getLang1()).isEqualTo(DEFAULT_LANG_1);
        assertThat(testGlossary.getLang2()).isEqualTo(DEFAULT_LANG_2);
    }

    @Test
    @Transactional
    public void createGlossaryWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = glossaryRepository.findAll().size();

        // Create the Glossary with an existing ID
        glossary.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restGlossaryMockMvc.perform(post("/api/glossaries")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(glossary)))
            .andExpect(status().isBadRequest());

        // Validate the Glossary in the database
        List<Glossary> glossaryList = glossaryRepository.findAll();
        assertThat(glossaryList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void getAllGlossaries() throws Exception {
        // Initialize the database
        glossaryRepository.saveAndFlush(glossary);

        // Get all the glossaryList
        restGlossaryMockMvc.perform(get("/api/glossaries?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(glossary.getId().intValue())))
            .andExpect(jsonPath("$.[*].glosName").value(hasItem(DEFAULT_GLOS_NAME)))
            .andExpect(jsonPath("$.[*].lang1").value(hasItem(DEFAULT_LANG_1)))
            .andExpect(jsonPath("$.[*].lang2").value(hasItem(DEFAULT_LANG_2)));
    }
    
    @SuppressWarnings({"unchecked"})
    public void getAllGlossariesWithEagerRelationshipsIsEnabled() throws Exception {
        GlossaryResource glossaryResource = new GlossaryResource(glossaryRepositoryMock);
        when(glossaryRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        MockMvc restGlossaryMockMvc = MockMvcBuilders.standaloneSetup(glossaryResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();

        restGlossaryMockMvc.perform(get("/api/glossaries?eagerload=true"))
        .andExpect(status().isOk());

        verify(glossaryRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({"unchecked"})
    public void getAllGlossariesWithEagerRelationshipsIsNotEnabled() throws Exception {
        GlossaryResource glossaryResource = new GlossaryResource(glossaryRepositoryMock);
            when(glossaryRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));
            MockMvc restGlossaryMockMvc = MockMvcBuilders.standaloneSetup(glossaryResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();

        restGlossaryMockMvc.perform(get("/api/glossaries?eagerload=true"))
        .andExpect(status().isOk());

            verify(glossaryRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @Test
    @Transactional
    public void getGlossary() throws Exception {
        // Initialize the database
        glossaryRepository.saveAndFlush(glossary);

        // Get the glossary
        restGlossaryMockMvc.perform(get("/api/glossaries/{id}", glossary.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(glossary.getId().intValue()))
            .andExpect(jsonPath("$.glosName").value(DEFAULT_GLOS_NAME))
            .andExpect(jsonPath("$.lang1").value(DEFAULT_LANG_1))
            .andExpect(jsonPath("$.lang2").value(DEFAULT_LANG_2));
    }

    @Test
    @Transactional
    public void getNonExistingGlossary() throws Exception {
        // Get the glossary
        restGlossaryMockMvc.perform(get("/api/glossaries/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateGlossary() throws Exception {
        // Initialize the database
        glossaryRepository.saveAndFlush(glossary);

        int databaseSizeBeforeUpdate = glossaryRepository.findAll().size();

        // Update the glossary
        Glossary updatedGlossary = glossaryRepository.findById(glossary.getId()).get();
        // Disconnect from session so that the updates on updatedGlossary are not directly saved in db
        em.detach(updatedGlossary);
        updatedGlossary
            .glosName(UPDATED_GLOS_NAME)
            .lang1(UPDATED_LANG_1)
            .lang2(UPDATED_LANG_2);

        restGlossaryMockMvc.perform(put("/api/glossaries")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedGlossary)))
            .andExpect(status().isOk());

        // Validate the Glossary in the database
        List<Glossary> glossaryList = glossaryRepository.findAll();
        assertThat(glossaryList).hasSize(databaseSizeBeforeUpdate);
        Glossary testGlossary = glossaryList.get(glossaryList.size() - 1);
        assertThat(testGlossary.getGlosName()).isEqualTo(UPDATED_GLOS_NAME);
        assertThat(testGlossary.getLang1()).isEqualTo(UPDATED_LANG_1);
        assertThat(testGlossary.getLang2()).isEqualTo(UPDATED_LANG_2);
    }

    @Test
    @Transactional
    public void updateNonExistingGlossary() throws Exception {
        int databaseSizeBeforeUpdate = glossaryRepository.findAll().size();

        // Create the Glossary

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restGlossaryMockMvc.perform(put("/api/glossaries")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(glossary)))
            .andExpect(status().isBadRequest());

        // Validate the Glossary in the database
        List<Glossary> glossaryList = glossaryRepository.findAll();
        assertThat(glossaryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteGlossary() throws Exception {
        // Initialize the database
        glossaryRepository.saveAndFlush(glossary);

        int databaseSizeBeforeDelete = glossaryRepository.findAll().size();

        // Delete the glossary
        restGlossaryMockMvc.perform(delete("/api/glossaries/{id}", glossary.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Glossary> glossaryList = glossaryRepository.findAll();
        assertThat(glossaryList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Glossary.class);
        Glossary glossary1 = new Glossary();
        glossary1.setId(1L);
        Glossary glossary2 = new Glossary();
        glossary2.setId(glossary1.getId());
        assertThat(glossary1).isEqualTo(glossary2);
        glossary2.setId(2L);
        assertThat(glossary1).isNotEqualTo(glossary2);
        glossary1.setId(null);
        assertThat(glossary1).isNotEqualTo(glossary2);
    }
}
