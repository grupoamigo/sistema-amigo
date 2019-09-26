package com.sistema.amigo.repository.search;

import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Configuration;

/**
 * Configure a Mock version of {@link ManouverRequestSearchRepository} to test the
 * application without starting Elasticsearch.
 */
@Configuration
public class ManouverRequestSearchRepositoryMockConfiguration {

    @MockBean
    private ManouverRequestSearchRepository mockManouverRequestSearchRepository;

}
