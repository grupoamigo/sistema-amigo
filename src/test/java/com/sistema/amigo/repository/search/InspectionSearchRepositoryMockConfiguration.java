package com.sistema.amigo.repository.search;

import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Configuration;

/**
 * Configure a Mock version of {@link InspectionSearchRepository} to test the
 * application without starting Elasticsearch.
 */
@Configuration
public class InspectionSearchRepositoryMockConfiguration {

    @MockBean
    private InspectionSearchRepository mockInspectionSearchRepository;

}
