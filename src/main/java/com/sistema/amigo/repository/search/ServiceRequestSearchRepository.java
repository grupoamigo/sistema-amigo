package com.sistema.amigo.repository.search;
import com.sistema.amigo.domain.ServiceRequest;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the {@link ServiceRequest} entity.
 */
public interface ServiceRequestSearchRepository extends ElasticsearchRepository<ServiceRequest, Long> {
}
