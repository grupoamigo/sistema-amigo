package com.sistema.amigo.repository.search;
import com.sistema.amigo.domain.Warehouse;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the {@link Warehouse} entity.
 */
public interface WarehouseSearchRepository extends ElasticsearchRepository<Warehouse, Long> {
}
