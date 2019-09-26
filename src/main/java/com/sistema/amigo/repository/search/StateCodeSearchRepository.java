package com.sistema.amigo.repository.search;
import com.sistema.amigo.domain.StateCode;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the {@link StateCode} entity.
 */
public interface StateCodeSearchRepository extends ElasticsearchRepository<StateCode, Long> {
}
