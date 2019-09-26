package com.sistema.amigo.domain;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import org.springframework.data.elasticsearch.annotations.FieldType;
import java.io.Serializable;
import java.time.Instant;
import java.time.LocalDate;

import com.sistema.amigo.domain.enumeration.StatusType;

/**
 * A ServiceRequest.
 */
@Entity
@Table(name = "service_request")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@org.springframework.data.elasticsearch.annotations.Document(indexName = "servicerequest")
public class ServiceRequest implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @org.springframework.data.elasticsearch.annotations.Field(type = FieldType.Keyword)
    private Long id;

    @NotNull
    @Column(name = "title", nullable = false)
    private String title;

    @NotNull
    @Column(name = "description", nullable = false)
    private String description;

    @NotNull
    @Column(name = "date_requested", nullable = false)
    private Instant dateRequested;

    @NotNull
    @Column(name = "date_begin", nullable = false)
    private LocalDate dateBegin;

    @Column(name = "date_end")
    private LocalDate dateEnd;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private StatusType status;

    @OneToOne
    @JoinColumn(unique = true)
    private Client client;

    @ManyToOne
    @JsonIgnoreProperties("serviceRequests")
    private ServiceQuote serviceQuote;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public ServiceRequest title(String title) {
        this.title = title;
        return this;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public ServiceRequest description(String description) {
        this.description = description;
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Instant getDateRequested() {
        return dateRequested;
    }

    public ServiceRequest dateRequested(Instant dateRequested) {
        this.dateRequested = dateRequested;
        return this;
    }

    public void setDateRequested(Instant dateRequested) {
        this.dateRequested = dateRequested;
    }

    public LocalDate getDateBegin() {
        return dateBegin;
    }

    public ServiceRequest dateBegin(LocalDate dateBegin) {
        this.dateBegin = dateBegin;
        return this;
    }

    public void setDateBegin(LocalDate dateBegin) {
        this.dateBegin = dateBegin;
    }

    public LocalDate getDateEnd() {
        return dateEnd;
    }

    public ServiceRequest dateEnd(LocalDate dateEnd) {
        this.dateEnd = dateEnd;
        return this;
    }

    public void setDateEnd(LocalDate dateEnd) {
        this.dateEnd = dateEnd;
    }

    public StatusType getStatus() {
        return status;
    }

    public ServiceRequest status(StatusType status) {
        this.status = status;
        return this;
    }

    public void setStatus(StatusType status) {
        this.status = status;
    }

    public Client getClient() {
        return client;
    }

    public ServiceRequest client(Client client) {
        this.client = client;
        return this;
    }

    public void setClient(Client client) {
        this.client = client;
    }

    public ServiceQuote getServiceQuote() {
        return serviceQuote;
    }

    public ServiceRequest serviceQuote(ServiceQuote serviceQuote) {
        this.serviceQuote = serviceQuote;
        return this;
    }

    public void setServiceQuote(ServiceQuote serviceQuote) {
        this.serviceQuote = serviceQuote;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ServiceRequest)) {
            return false;
        }
        return id != null && id.equals(((ServiceRequest) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "ServiceRequest{" +
            "id=" + getId() +
            ", title='" + getTitle() + "'" +
            ", description='" + getDescription() + "'" +
            ", dateRequested='" + getDateRequested() + "'" +
            ", dateBegin='" + getDateBegin() + "'" +
            ", dateEnd='" + getDateEnd() + "'" +
            ", status='" + getStatus() + "'" +
            "}";
    }
}
