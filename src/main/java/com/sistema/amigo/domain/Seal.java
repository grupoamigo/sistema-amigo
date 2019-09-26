package com.sistema.amigo.domain;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import org.springframework.data.elasticsearch.annotations.FieldType;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

/**
 * A Seal.
 */
@Entity
@Table(name = "seal")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@org.springframework.data.elasticsearch.annotations.Document(indexName = "seal")
public class Seal implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @org.springframework.data.elasticsearch.annotations.Field(type = FieldType.Keyword)
    private Long id;

    @NotNull
    @Column(name = "issuer", nullable = false)
    private String issuer;

    @NotNull
    @Column(name = "unique_id", nullable = false)
    private String uniqueId;

    @OneToMany(mappedBy = "seals")
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<Cargo> cargoSeals = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getIssuer() {
        return issuer;
    }

    public Seal issuer(String issuer) {
        this.issuer = issuer;
        return this;
    }

    public void setIssuer(String issuer) {
        this.issuer = issuer;
    }

    public String getUniqueId() {
        return uniqueId;
    }

    public Seal uniqueId(String uniqueId) {
        this.uniqueId = uniqueId;
        return this;
    }

    public void setUniqueId(String uniqueId) {
        this.uniqueId = uniqueId;
    }

    public Set<Cargo> getCargoSeals() {
        return cargoSeals;
    }

    public Seal cargoSeals(Set<Cargo> cargos) {
        this.cargoSeals = cargos;
        return this;
    }

    public Seal addCargoSeal(Cargo cargo) {
        this.cargoSeals.add(cargo);
        cargo.setSeals(this);
        return this;
    }

    public Seal removeCargoSeal(Cargo cargo) {
        this.cargoSeals.remove(cargo);
        cargo.setSeals(null);
        return this;
    }

    public void setCargoSeals(Set<Cargo> cargos) {
        this.cargoSeals = cargos;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Seal)) {
            return false;
        }
        return id != null && id.equals(((Seal) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "Seal{" +
            "id=" + getId() +
            ", issuer='" + getIssuer() + "'" +
            ", uniqueId='" + getUniqueId() + "'" +
            "}";
    }
}
