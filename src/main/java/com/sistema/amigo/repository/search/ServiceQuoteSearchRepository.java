package com.sistema.amigo.repository.search;
import com.sistema.amigo.domain.ServiceQuote;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the {@link ServiceQuote} entity.
 */
public interface ServiceQuoteSearchRepository extends ElasticsearchRepository<ServiceQuote, Long> {
}
