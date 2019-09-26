package com.sistema.amigo.repository.search;
import com.sistema.amigo.domain.Contract;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the {@link Contract} entity.
 */
public interface ContractSearchRepository extends ElasticsearchRepository<Contract, Long> {
}
