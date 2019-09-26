package com.sistema.amigo.repository.search;
import com.sistema.amigo.domain.Seal;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the {@link Seal} entity.
 */
public interface SealSearchRepository extends ElasticsearchRepository<Seal, Long> {
}
