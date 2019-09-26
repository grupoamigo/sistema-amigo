package com.sistema.amigo.repository.search;
import com.sistema.amigo.domain.Transport;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the {@link Transport} entity.
 */
public interface TransportSearchRepository extends ElasticsearchRepository<Transport, Long> {
}
