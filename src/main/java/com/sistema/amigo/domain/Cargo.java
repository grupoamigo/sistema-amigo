package com.sistema.amigo.domain;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import org.springframework.data.elasticsearch.annotations.FieldType;
import java.io.Serializable;

import com.sistema.amigo.domain.enumeration.CargoType;

import com.sistema.amigo.domain.enumeration.CargoStatusType;

/**
 * A Cargo.
 */
@Entity
@Table(name = "cargo")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@org.springframework.data.elasticsearch.annotations.Document(indexName = "cargo")
public class Cargo implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @org.springframework.data.elasticsearch.annotations.Field(type = FieldType.Keyword)
    private Long id;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private CargoType type;

    @NotNull
    @Column(name = "unique_id", nullable = false)
    private String uniqueId;

    @Column(name = "description")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private CargoStatusType status;

    @OneToOne
    @JoinColumn(unique = true)
    private Warehouse warehouse;

    @ManyToOne
    @JsonIgnoreProperties("cargoSeals")
    private Seal seals;

    @ManyToOne
    @JsonIgnoreProperties("cargos")
    private Client client;

    @ManyToOne
    @JsonIgnoreProperties("cargoLists")
    private Warehouse warehouses;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public CargoType getType() {
        return type;
    }

    public Cargo type(CargoType type) {
        this.type = type;
        return this;
    }

    public void setType(CargoType type) {
        this.type = type;
    }

    public String getUniqueId() {
        return uniqueId;
    }

    public Cargo uniqueId(String uniqueId) {
        this.uniqueId = uniqueId;
        return this;
    }

    public void setUniqueId(String uniqueId) {
        this.uniqueId = uniqueId;
    }

    public String getDescription() {
        return description;
    }

    public Cargo description(String description) {
        this.description = description;
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public CargoStatusType getStatus() {
        return status;
    }

    public Cargo status(CargoStatusType status) {
        this.status = status;
        return this;
    }

    public void setStatus(CargoStatusType status) {
        this.status = status;
    }

    public Warehouse getWarehouse() {
        return warehouse;
    }

    public Cargo warehouse(Warehouse warehouse) {
        this.warehouse = warehouse;
        return this;
    }

    public void setWarehouse(Warehouse warehouse) {
        this.warehouse = warehouse;
    }

    public Seal getSeals() {
        return seals;
    }

    public Cargo seals(Seal seal) {
        this.seals = seal;
        return this;
    }

    public void setSeals(Seal seal) {
        this.seals = seal;
    }

    public Client getClient() {
        return client;
    }

    public Cargo client(Client client) {
        this.client = client;
        return this;
    }

    public void setClient(Client client) {
        this.client = client;
    }

    public Warehouse getWarehouses() {
        return warehouses;
    }

    public Cargo warehouses(Warehouse warehouse) {
        this.warehouses = warehouse;
        return this;
    }

    public void setWarehouses(Warehouse warehouse) {
        this.warehouses = warehouse;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Cargo)) {
            return false;
        }
        return id != null && id.equals(((Cargo) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "Cargo{" +
            "id=" + getId() +
            ", type='" + getType() + "'" +
            ", uniqueId='" + getUniqueId() + "'" +
            ", description='" + getDescription() + "'" +
            ", status='" + getStatus() + "'" +
            "}";
    }
}
