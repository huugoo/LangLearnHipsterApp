package com.hcorp.langlearn.web.rest;

import com.hcorp.langlearn.domain.Words;
import com.hcorp.langlearn.repository.WordsRepository;
import com.hcorp.langlearn.web.rest.errors.BadRequestAlertException;

import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing {@link com.hcorp.langlearn.domain.Words}.
 */
@RestController
@RequestMapping("/api")
public class WordsResource {

    private final Logger log = LoggerFactory.getLogger(WordsResource.class);

    private static final String ENTITY_NAME = "words";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final WordsRepository wordsRepository;

    public WordsResource(WordsRepository wordsRepository) {
        this.wordsRepository = wordsRepository;
    }

    /**
     * {@code POST  /words} : Create a new words.
     *
     * @param words the words to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new words, or with status {@code 400 (Bad Request)} if the words has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/words")
    public ResponseEntity<Words> createWords(@RequestBody Words words) throws URISyntaxException {
        log.debug("REST request to save Words : {}", words);
        if (words.getId() != null) {
            throw new BadRequestAlertException("A new words cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Words result = wordsRepository.save(words);
        return ResponseEntity.created(new URI("/api/words/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /words} : Updates an existing words.
     *
     * @param words the words to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated words,
     * or with status {@code 400 (Bad Request)} if the words is not valid,
     * or with status {@code 500 (Internal Server Error)} if the words couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/words")
    public ResponseEntity<Words> updateWords(@RequestBody Words words) throws URISyntaxException {
        log.debug("REST request to update Words : {}", words);
        if (words.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Words result = wordsRepository.save(words);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, words.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /words} : get all the words.
     *

     * @param pageable the pagination information.

     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of words in body.
     */
    @GetMapping("/words")
    public ResponseEntity<List<Words>> getAllWords(Pageable pageable) {
        log.debug("REST request to get a page of Words");
        Page<Words> page = wordsRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /words/:id} : get the "id" words.
     *
     * @param id the id of the words to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the words, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/words/{id}")
    public ResponseEntity<Words> getWords(@PathVariable Long id) {
        log.debug("REST request to get Words : {}", id);
        Optional<Words> words = wordsRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(words);
    }

    /**
     * {@code DELETE  /words/:id} : delete the "id" words.
     *
     * @param id the id of the words to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/words/{id}")
    public ResponseEntity<Void> deleteWords(@PathVariable Long id) {
        log.debug("REST request to delete Words : {}", id);
        wordsRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }
}
