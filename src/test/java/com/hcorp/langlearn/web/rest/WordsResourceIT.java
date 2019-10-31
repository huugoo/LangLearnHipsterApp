package com.hcorp.langlearn.web.rest;

import com.hcorp.langlearn.LangLearnHipsterApp;
import com.hcorp.langlearn.domain.Words;
import com.hcorp.langlearn.repository.WordsRepository;
import com.hcorp.langlearn.web.rest.errors.ExceptionTranslator;

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
import java.util.List;

import static com.hcorp.langlearn.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the {@link WordsResource} REST controller.
 */
@SpringBootTest(classes = LangLearnHipsterApp.class)
public class WordsResourceIT {

    private static final String DEFAULT_WORD_LANG_1 = "AAAAAAAAAA";
    private static final String UPDATED_WORD_LANG_1 = "BBBBBBBBBB";

    private static final String DEFAULT_WORD_LANG_2 = "AAAAAAAAAA";
    private static final String UPDATED_WORD_LANG_2 = "BBBBBBBBBB";

    @Autowired
    private WordsRepository wordsRepository;

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

    private MockMvc restWordsMockMvc;

    private Words words;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final WordsResource wordsResource = new WordsResource(wordsRepository);
        this.restWordsMockMvc = MockMvcBuilders.standaloneSetup(wordsResource)
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
    public static Words createEntity(EntityManager em) {
        Words words = new Words()
            .wordLang1(DEFAULT_WORD_LANG_1)
            .wordLang2(DEFAULT_WORD_LANG_2);
        return words;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Words createUpdatedEntity(EntityManager em) {
        Words words = new Words()
            .wordLang1(UPDATED_WORD_LANG_1)
            .wordLang2(UPDATED_WORD_LANG_2);
        return words;
    }

    @BeforeEach
    public void initTest() {
        words = createEntity(em);
    }

    @Test
    @Transactional
    public void createWords() throws Exception {
        int databaseSizeBeforeCreate = wordsRepository.findAll().size();

        // Create the Words
        restWordsMockMvc.perform(post("/api/words")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(words)))
            .andExpect(status().isCreated());

        // Validate the Words in the database
        List<Words> wordsList = wordsRepository.findAll();
        assertThat(wordsList).hasSize(databaseSizeBeforeCreate + 1);
        Words testWords = wordsList.get(wordsList.size() - 1);
        assertThat(testWords.getWordLang1()).isEqualTo(DEFAULT_WORD_LANG_1);
        assertThat(testWords.getWordLang2()).isEqualTo(DEFAULT_WORD_LANG_2);
    }

    @Test
    @Transactional
    public void createWordsWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = wordsRepository.findAll().size();

        // Create the Words with an existing ID
        words.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restWordsMockMvc.perform(post("/api/words")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(words)))
            .andExpect(status().isBadRequest());

        // Validate the Words in the database
        List<Words> wordsList = wordsRepository.findAll();
        assertThat(wordsList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void getAllWords() throws Exception {
        // Initialize the database
        wordsRepository.saveAndFlush(words);

        // Get all the wordsList
        restWordsMockMvc.perform(get("/api/words?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(words.getId().intValue())))
            .andExpect(jsonPath("$.[*].wordLang1").value(hasItem(DEFAULT_WORD_LANG_1)))
            .andExpect(jsonPath("$.[*].wordLang2").value(hasItem(DEFAULT_WORD_LANG_2)));
    }
    
    @Test
    @Transactional
    public void getWords() throws Exception {
        // Initialize the database
        wordsRepository.saveAndFlush(words);

        // Get the words
        restWordsMockMvc.perform(get("/api/words/{id}", words.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(words.getId().intValue()))
            .andExpect(jsonPath("$.wordLang1").value(DEFAULT_WORD_LANG_1))
            .andExpect(jsonPath("$.wordLang2").value(DEFAULT_WORD_LANG_2));
    }

    @Test
    @Transactional
    public void getNonExistingWords() throws Exception {
        // Get the words
        restWordsMockMvc.perform(get("/api/words/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateWords() throws Exception {
        // Initialize the database
        wordsRepository.saveAndFlush(words);

        int databaseSizeBeforeUpdate = wordsRepository.findAll().size();

        // Update the words
        Words updatedWords = wordsRepository.findById(words.getId()).get();
        // Disconnect from session so that the updates on updatedWords are not directly saved in db
        em.detach(updatedWords);
        updatedWords
            .wordLang1(UPDATED_WORD_LANG_1)
            .wordLang2(UPDATED_WORD_LANG_2);

        restWordsMockMvc.perform(put("/api/words")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedWords)))
            .andExpect(status().isOk());

        // Validate the Words in the database
        List<Words> wordsList = wordsRepository.findAll();
        assertThat(wordsList).hasSize(databaseSizeBeforeUpdate);
        Words testWords = wordsList.get(wordsList.size() - 1);
        assertThat(testWords.getWordLang1()).isEqualTo(UPDATED_WORD_LANG_1);
        assertThat(testWords.getWordLang2()).isEqualTo(UPDATED_WORD_LANG_2);
    }

    @Test
    @Transactional
    public void updateNonExistingWords() throws Exception {
        int databaseSizeBeforeUpdate = wordsRepository.findAll().size();

        // Create the Words

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restWordsMockMvc.perform(put("/api/words")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(words)))
            .andExpect(status().isBadRequest());

        // Validate the Words in the database
        List<Words> wordsList = wordsRepository.findAll();
        assertThat(wordsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteWords() throws Exception {
        // Initialize the database
        wordsRepository.saveAndFlush(words);

        int databaseSizeBeforeDelete = wordsRepository.findAll().size();

        // Delete the words
        restWordsMockMvc.perform(delete("/api/words/{id}", words.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Words> wordsList = wordsRepository.findAll();
        assertThat(wordsList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Words.class);
        Words words1 = new Words();
        words1.setId(1L);
        Words words2 = new Words();
        words2.setId(words1.getId());
        assertThat(words1).isEqualTo(words2);
        words2.setId(2L);
        assertThat(words1).isNotEqualTo(words2);
        words1.setId(null);
        assertThat(words1).isNotEqualTo(words2);
    }
}
