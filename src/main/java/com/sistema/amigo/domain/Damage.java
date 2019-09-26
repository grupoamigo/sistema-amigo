package com.sistema.amigo.domain;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import org.springframework.data.elasticsearch.annotations.FieldType;
import java.io.Serializable;
import java.time.Instant;

/**
 * A Damage.
 */
@Entity
@Table(name = "damage")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@org.springframework.data.elasticsearch.annotations.Document(indexName = "damage")
public class Damage implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @org.springframework.data.elasticsearch.annotations.Field(type = FieldType.Keyword)
    private Long id;

    @Column(name = "report_date")
    private Instant reportDate;

    @Column(name = "description")
    private String description;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Instant getReportDate() {
        return reportDate;
    }

    public Damage reportDate(Instant reportDate) {
        this.reportDate = reportDate;
        return this;
    }

    public void setReportDate(Instant reportDate) {
        this.reportDate = reportDate;
    }

    public String getDescription() {
        return description;
    }

    public Damage description(String description) {
        this.description = description;
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Damage)) {
            return false;
        }
        return id != null && id.equals(((Damage) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "Damage{" +
            "id=" + getId() +
            ", reportDate='" + getReportDate() + "'" +
            ", description='" + getDescription() + "'" +
            "}";
    }
}
