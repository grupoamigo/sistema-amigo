package com.sistema.amigo.repository.search;
import com.sistema.amigo.domain.ContactCard;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the {@link ContactCard} entity.
 */
public interface ContactCardSearchRepository extends ElasticsearchRepository<ContactCard, Long> {
}
