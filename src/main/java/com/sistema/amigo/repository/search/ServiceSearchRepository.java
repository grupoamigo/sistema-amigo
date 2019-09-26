package com.sistema.amigo.repository.search;
import com.sistema.amigo.domain.Service;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the {@link Service} entity.
 */
public interface ServiceSearchRepository extends ElasticsearchRepository<Service, Long> {
}
