package com.hcorp.langlearn.domain;
import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

/**
 * A Words.
 */
@Entity
@Table(name = "words")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class Words implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "word_lang_1")
    private String wordLang1;

    @Column(name = "word_lang_2")
    private String wordLang2;

    @ManyToMany(mappedBy = "words")
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    @JsonIgnore
    private Set<Glossary> glossaries = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getWordLang1() {
        return wordLang1;
    }

    public Words wordLang1(String wordLang1) {
        this.wordLang1 = wordLang1;
        return this;
    }

    public void setWordLang1(String wordLang1) {
        this.wordLang1 = wordLang1;
    }

    public String getWordLang2() {
        return wordLang2;
    }

    public Words wordLang2(String wordLang2) {
        this.wordLang2 = wordLang2;
        return this;
    }

    public void setWordLang2(String wordLang2) {
        this.wordLang2 = wordLang2;
    }

    public Set<Glossary> getGlossaries() {
        return glossaries;
    }

    public Words glossaries(Set<Glossary> glossaries) {
        this.glossaries = glossaries;
        return this;
    }

    public Words addGlossary(Glossary glossary) {
        this.glossaries.add(glossary);
        glossary.getWords().add(this);
        return this;
    }

    public Words removeGlossary(Glossary glossary) {
        this.glossaries.remove(glossary);
        glossary.getWords().remove(this);
        return this;
    }

    public void setGlossaries(Set<Glossary> glossaries) {
        this.glossaries = glossaries;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Words)) {
            return false;
        }
        return id != null && id.equals(((Words) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "Words{" +
            "id=" + getId() +
            ", wordLang1='" + getWordLang1() + "'" +
            ", wordLang2='" + getWordLang2() + "'" +
            "}";
    }
}
