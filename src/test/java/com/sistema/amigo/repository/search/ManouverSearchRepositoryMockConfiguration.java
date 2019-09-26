package com.sistema.amigo.repository.search;

import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Configuration;

/**
 * Configure a Mock version of {@link ManouverSearchRepository} to test the
 * application without starting Elasticsearch.
 */
@Configuration
public class ManouverSearchRepositoryMockConfiguration {

    @MockBean
    private ManouverSearchRepository mockManouverSearchRepository;

}
