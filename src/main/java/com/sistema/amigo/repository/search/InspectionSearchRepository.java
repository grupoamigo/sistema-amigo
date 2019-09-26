package com.sistema.amigo.repository.search;
import com.sistema.amigo.domain.Inspection;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the {@link Inspection} entity.
 */
public interface InspectionSearchRepository extends ElasticsearchRepository<Inspection, Long> {
}
