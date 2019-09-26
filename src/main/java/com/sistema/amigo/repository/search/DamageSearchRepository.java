package com.sistema.amigo.repository.search;
import com.sistema.amigo.domain.Damage;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the {@link Damage} entity.
 */
public interface DamageSearchRepository extends ElasticsearchRepository<Damage, Long> {
}
