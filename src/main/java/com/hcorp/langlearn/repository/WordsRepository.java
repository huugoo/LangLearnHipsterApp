package com.hcorp.langlearn.repository;
import com.hcorp.langlearn.domain.Words;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the Words entity.
 */
@SuppressWarnings("unused")
@Repository
public interface WordsRepository extends JpaRepository<Words, Long> {

}
