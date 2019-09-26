package com.sistema.amigo.domain;
import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import org.springframework.data.elasticsearch.annotations.FieldType;
import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

import com.sistema.amigo.domain.enumeration.ClientStatusType;

/**
 * A Client.
 */
@Entity
@Table(name = "client")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@org.springframework.data.elasticsearch.annotations.Document(indexName = "client")
public class Client implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @org.springframework.data.elasticsearch.annotations.Field(type = FieldType.Keyword)
    private Long id;

    @Column(name = "member_since")
    private Instant memberSince;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private ClientStatusType status;

    @Column(name = "internal_notes")
    private String internalNotes;

    @Column(name = "unique_id")
    private String uniqueId;

    @OneToOne(mappedBy = "client")
    @JsonIgnore
    private ServiceRequest serviceRequest;

    @OneToMany(mappedBy = "client")
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<Cargo> cargos = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Instant getMemberSince() {
        return memberSince;
    }

    public Client memberSince(Instant memberSince) {
        this.memberSince = memberSince;
        return this;
    }

    public void setMemberSince(Instant memberSince) {
        this.memberSince = memberSince;
    }

    public ClientStatusType getStatus() {
        return status;
    }

    public Client status(ClientStatusType status) {
        this.status = status;
        return this;
    }

    public void setStatus(ClientStatusType status) {
        this.status = status;
    }

    public String getInternalNotes() {
        return internalNotes;
    }

    public Client internalNotes(String internalNotes) {
        this.internalNotes = internalNotes;
        return this;
    }

    public void setInternalNotes(String internalNotes) {
        this.internalNotes = internalNotes;
    }

    public String getUniqueId() {
        return uniqueId;
    }

    public Client uniqueId(String uniqueId) {
        this.uniqueId = uniqueId;
        return this;
    }

    public void setUniqueId(String uniqueId) {
        this.uniqueId = uniqueId;
    }

    public ServiceRequest getServiceRequest() {
        return serviceRequest;
    }

    public Client serviceRequest(ServiceRequest serviceRequest) {
        this.serviceRequest = serviceRequest;
        return this;
    }

    public void setServiceRequest(ServiceRequest serviceRequest) {
        this.serviceRequest = serviceRequest;
    }

    public Set<Cargo> getCargos() {
        return cargos;
    }

    public Client cargos(Set<Cargo> cargos) {
        this.cargos = cargos;
        return this;
    }

    public Client addCargo(Cargo cargo) {
        this.cargos.add(cargo);
        cargo.setClient(this);
        return this;
    }

    public Client removeCargo(Cargo cargo) {
        this.cargos.remove(cargo);
        cargo.setClient(null);
        return this;
    }

    public void setCargos(Set<Cargo> cargos) {
        this.cargos = cargos;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Client)) {
            return false;
        }
        return id != null && id.equals(((Client) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "Client{" +
            "id=" + getId() +
            ", memberSince='" + getMemberSince() + "'" +
            ", status='" + getStatus() + "'" +
            ", internalNotes='" + getInternalNotes() + "'" +
            ", uniqueId='" + getUniqueId() + "'" +
            "}";
    }
}
