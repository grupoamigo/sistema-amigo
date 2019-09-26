package com.sistema.amigo.domain;
import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import org.springframework.data.elasticsearch.annotations.FieldType;
import java.io.Serializable;

import com.sistema.amigo.domain.enumeration.ServiceUnitType;

import com.sistema.amigo.domain.enumeration.DivisionType;

import com.sistema.amigo.domain.enumeration.CurrencyType;

/**
 * A Manouver.
 */
@Entity
@Table(name = "manouver")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@org.springframework.data.elasticsearch.annotations.Document(indexName = "manouver")
public class Manouver implements Serializable {

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
    @Enumerated(EnumType.STRING)
    @Column(name = "unit", nullable = false)
    private ServiceUnitType unit;

    @Enumerated(EnumType.STRING)
    @Column(name = "division")
    private DivisionType division;

    @Column(name = "price")
    private Float price;

    @Enumerated(EnumType.STRING)
    @Column(name = "currency")
    private CurrencyType currency;

    @OneToOne
    @JoinColumn(unique = true)
    private Company provider;

    @OneToOne(mappedBy = "manouver")
    @JsonIgnore
    private ManouverRequest manouverRequest;

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

    public Manouver title(String title) {
        this.title = title;
        return this;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public Manouver description(String description) {
        this.description = description;
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public ServiceUnitType getUnit() {
        return unit;
    }

    public Manouver unit(ServiceUnitType unit) {
        this.unit = unit;
        return this;
    }

    public void setUnit(ServiceUnitType unit) {
        this.unit = unit;
    }

    public DivisionType getDivision() {
        return division;
    }

    public Manouver division(DivisionType division) {
        this.division = division;
        return this;
    }

    public void setDivision(DivisionType division) {
        this.division = division;
    }

    public Float getPrice() {
        return price;
    }

    public Manouver price(Float price) {
        this.price = price;
        return this;
    }

    public void setPrice(Float price) {
        this.price = price;
    }

    public CurrencyType getCurrency() {
        return currency;
    }

    public Manouver currency(CurrencyType currency) {
        this.currency = currency;
        return this;
    }

    public void setCurrency(CurrencyType currency) {
        this.currency = currency;
    }

    public Company getProvider() {
        return provider;
    }

    public Manouver provider(Company company) {
        this.provider = company;
        return this;
    }

    public void setProvider(Company company) {
        this.provider = company;
    }

    public ManouverRequest getManouverRequest() {
        return manouverRequest;
    }

    public Manouver manouverRequest(ManouverRequest manouverRequest) {
        this.manouverRequest = manouverRequest;
        return this;
    }

    public void setManouverRequest(ManouverRequest manouverRequest) {
        this.manouverRequest = manouverRequest;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Manouver)) {
            return false;
        }
        return id != null && id.equals(((Manouver) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "Manouver{" +
            "id=" + getId() +
            ", title='" + getTitle() + "'" +
            ", description='" + getDescription() + "'" +
            ", unit='" + getUnit() + "'" +
            ", division='" + getDivision() + "'" +
            ", price=" + getPrice() +
            ", currency='" + getCurrency() + "'" +
            "}";
    }
}
