package com.hcorp.langlearn.domain;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

/**
 * A Glossary.
 */
@Entity
@Table(name = "glossary")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class Glossary implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "glos_name")
    private String glosName;

    @Column(name = "lang_1")
    private String lang1;

    @Column(name = "lang_2")
    private String lang2;

    @ManyToOne
    @JsonIgnoreProperties("glossaries")
    private User user;

    @ManyToMany
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    @JoinTable(name = "glossary_words",
               joinColumns = @JoinColumn(name = "glossary_id", referencedColumnName = "id"),
               inverseJoinColumns = @JoinColumn(name = "words_id", referencedColumnName = "id"))
    private Set<Words> words = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getGlosName() {
        return glosName;
    }

    public Glossary glosName(String glosName) {
        this.glosName = glosName;
        return this;
    }

    public void setGlosName(String glosName) {
        this.glosName = glosName;
    }

    public String getLang1() {
        return lang1;
    }

    public Glossary lang1(String lang1) {
        this.lang1 = lang1;
        return this;
    }

    public void setLang1(String lang1) {
        this.lang1 = lang1;
    }

    public String getLang2() {
        return lang2;
    }

    public Glossary lang2(String lang2) {
        this.lang2 = lang2;
        return this;
    }

    public void setLang2(String lang2) {
        this.lang2 = lang2;
    }

    public User getUser() {
        return user;
    }

    public Glossary user(User user) {
        this.user = user;
        return this;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Set<Words> getWords() {
        return words;
    }

    public Glossary words(Set<Words> words) {
        this.words = words;
        return this;
    }

    public Glossary addWords(Words words) {
        this.words.add(words);
        words.getGlossaries().add(this);
        return this;
    }

    public Glossary removeWords(Words words) {
        this.words.remove(words);
        words.getGlossaries().remove(this);
        return this;
    }

    public void setWords(Set<Words> words) {
        this.words = words;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Glossary)) {
            return false;
        }
        return id != null && id.equals(((Glossary) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "Glossary{" +
            "id=" + getId() +
            ", glosName='" + getGlosName() + "'" +
            ", lang1='" + getLang1() + "'" +
            ", lang2='" + getLang2() + "'" +
            "}";
    }
}
