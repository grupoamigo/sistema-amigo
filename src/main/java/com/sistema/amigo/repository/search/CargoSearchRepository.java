package com.sistema.amigo.repository.search;
import com.sistema.amigo.domain.Cargo;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the {@link Cargo} entity.
 */
public interface CargoSearchRepository extends ElasticsearchRepository<Cargo, Long> {
}
