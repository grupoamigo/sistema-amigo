package com.sistema.amigo.repository.search;
import com.sistema.amigo.domain.ManouverRequest;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the {@link ManouverRequest} entity.
 */
public interface ManouverRequestSearchRepository extends ElasticsearchRepository<ManouverRequest, Long> {
}
