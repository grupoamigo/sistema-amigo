package com.sistema.amigo.repository.search;
import com.sistema.amigo.domain.ExtraField;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the {@link ExtraField} entity.
 */
public interface ExtraFieldSearchRepository extends ElasticsearchRepository<ExtraField, Long> {
}
