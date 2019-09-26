package com.sistema.amigo.config;

import java.time.Duration;

import org.ehcache.config.builders.*;
import org.ehcache.jsr107.Eh107Configuration;

import org.hibernate.cache.jcache.ConfigSettings;
import io.github.jhipster.config.JHipsterProperties;

import org.springframework.boot.autoconfigure.cache.JCacheManagerCustomizer;
import org.springframework.boot.autoconfigure.orm.jpa.HibernatePropertiesCustomizer;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.*;

@Configuration
@EnableCaching
public class CacheConfiguration {

    private final javax.cache.configuration.Configuration<Object, Object> jcacheConfiguration;

    public CacheConfiguration(JHipsterProperties jHipsterProperties) {
        JHipsterProperties.Cache.Ehcache ehcache = jHipsterProperties.getCache().getEhcache();

        jcacheConfiguration = Eh107Configuration.fromEhcacheCacheConfiguration(
            CacheConfigurationBuilder.newCacheConfigurationBuilder(Object.class, Object.class,
                ResourcePoolsBuilder.heap(ehcache.getMaxEntries()))
                .withExpiry(ExpiryPolicyBuilder.timeToLiveExpiration(Duration.ofSeconds(ehcache.getTimeToLiveSeconds())))
                .build());
    }

    @Bean
    public HibernatePropertiesCustomizer hibernatePropertiesCustomizer(javax.cache.CacheManager cacheManager) {
        return hibernateProperties -> hibernateProperties.put(ConfigSettings.CACHE_MANAGER, cacheManager);
    }

    @Bean
    public JCacheManagerCustomizer cacheManagerCustomizer() {
        return cm -> {
            createCache(cm, com.sistema.amigo.repository.UserRepository.USERS_BY_LOGIN_CACHE);
            createCache(cm, com.sistema.amigo.repository.UserRepository.USERS_BY_EMAIL_CACHE);
            createCache(cm, com.sistema.amigo.domain.User.class.getName());
            createCache(cm, com.sistema.amigo.domain.Authority.class.getName());
            createCache(cm, com.sistema.amigo.domain.User.class.getName() + ".authorities");
            createCache(cm, com.sistema.amigo.domain.Company.class.getName());
            createCache(cm, com.sistema.amigo.domain.Company.class.getName() + ".memberships");
            createCache(cm, com.sistema.amigo.domain.Company.class.getName() + ".contracts");
            createCache(cm, com.sistema.amigo.domain.Company.class.getName() + ".transportOwners");
            createCache(cm, com.sistema.amigo.domain.Membership.class.getName());
            createCache(cm, com.sistema.amigo.domain.Client.class.getName());
            createCache(cm, com.sistema.amigo.domain.Client.class.getName() + ".cargos");
            createCache(cm, com.sistema.amigo.domain.Manouver.class.getName());
            createCache(cm, com.sistema.amigo.domain.ManouverRequest.class.getName());
            createCache(cm, com.sistema.amigo.domain.Cargo.class.getName());
            createCache(cm, com.sistema.amigo.domain.Seal.class.getName());
            createCache(cm, com.sistema.amigo.domain.Seal.class.getName() + ".cargoSeals");
            createCache(cm, com.sistema.amigo.domain.ExtraField.class.getName());
            createCache(cm, com.sistema.amigo.domain.Location.class.getName());
            createCache(cm, com.sistema.amigo.domain.CountryCode.class.getName());
            createCache(cm, com.sistema.amigo.domain.StateCode.class.getName());
            createCache(cm, com.sistema.amigo.domain.ContactCard.class.getName());
            createCache(cm, com.sistema.amigo.domain.Service.class.getName());
            createCache(cm, com.sistema.amigo.domain.ServiceQuote.class.getName());
            createCache(cm, com.sistema.amigo.domain.ServiceQuote.class.getName() + ".serviceRequests");
            createCache(cm, com.sistema.amigo.domain.ServiceRequest.class.getName());
            createCache(cm, com.sistema.amigo.domain.Contract.class.getName());
            createCache(cm, com.sistema.amigo.domain.Inspection.class.getName());
            createCache(cm, com.sistema.amigo.domain.Evidence.class.getName());
            createCache(cm, com.sistema.amigo.domain.Damage.class.getName());
            createCache(cm, com.sistema.amigo.domain.Driver.class.getName());
            createCache(cm, com.sistema.amigo.domain.Transport.class.getName());
            createCache(cm, com.sistema.amigo.domain.Warehouse.class.getName());
            createCache(cm, com.sistema.amigo.domain.Warehouse.class.getName() + ".cargoLists");
            createCache(cm, com.sistema.amigo.domain.Route.class.getName());
            // jhipster-needle-ehcache-add-entry
        };
    }

    private void createCache(javax.cache.CacheManager cm, String cacheName) {
        javax.cache.Cache<Object, Object> cache = cm.getCache(cacheName);
        if (cache != null) {
            cm.destroyCache(cacheName);
        }
        cm.createCache(cacheName, jcacheConfiguration);
    }
}
