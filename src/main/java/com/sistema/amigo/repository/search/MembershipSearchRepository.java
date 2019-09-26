package com.sistema.amigo.repository.search;
import com.sistema.amigo.domain.Membership;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the {@link Membership} entity.
 */
public interface MembershipSearchRepository extends ElasticsearchRepository<Membership, Long> {
}
