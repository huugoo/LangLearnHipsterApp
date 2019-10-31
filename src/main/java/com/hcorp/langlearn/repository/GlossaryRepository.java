package com.hcorp.langlearn.repository;
import com.hcorp.langlearn.domain.Glossary;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data  repository for the Glossary entity.
 */
@Repository
public interface GlossaryRepository extends JpaRepository<Glossary, Long> {

    @Query("select glossary from Glossary glossary where glossary.user.login = ?#{principal.username}")
    List<Glossary> findByUserIsCurrentUser();

    @Query(value = "select distinct glossary from Glossary glossary left join fetch glossary.words",
        countQuery = "select count(distinct glossary) from Glossary glossary")
    Page<Glossary> findAllWithEagerRelationships(Pageable pageable);

    @Query("select distinct glossary from Glossary glossary left join fetch glossary.words")
    List<Glossary> findAllWithEagerRelationships();

    @Query("select glossary from Glossary glossary left join fetch glossary.words where glossary.id =:id")
    Optional<Glossary> findOneWithEagerRelationships(@Param("id") Long id);

}
