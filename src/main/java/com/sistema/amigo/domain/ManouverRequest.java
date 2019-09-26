package com.sistema.amigo.domain;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import org.springframework.data.elasticsearch.annotations.FieldType;
import java.io.Serializable;
import java.time.LocalDate;

import com.sistema.amigo.domain.enumeration.TransportType;

/**
 * A ManouverRequest.
 */
@Entity
@Table(name = "manouver_request")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@org.springframework.data.elasticsearch.annotations.Document(indexName = "manouverrequest")
public class ManouverRequest implements Serializable {

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
    @Column(name = "date", nullable = false)
    private LocalDate date;

    @Enumerated(EnumType.STRING)
    @Column(name = "transport_type")
    private TransportType transportType;

    @Lob
    @Column(name = "qr_code")
    private byte[] qrCode;

    @Column(name = "qr_code_content_type")
    private String qrCodeContentType;

    @OneToOne
    @JoinColumn(unique = true)
    private Location origin;

    @OneToOne
    @JoinColumn(unique = true)
    private Location destiny;

    @OneToOne
    @JoinColumn(unique = true)
    private Manouver manouver;

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

    public ManouverRequest title(String title) {
        this.title = title;
        return this;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public ManouverRequest description(String description) {
        this.description = description;
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getDate() {
        return date;
    }

    public ManouverRequest date(LocalDate date) {
        this.date = date;
        return this;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public TransportType getTransportType() {
        return transportType;
    }

    public ManouverRequest transportType(TransportType transportType) {
        this.transportType = transportType;
        return this;
    }

    public void setTransportType(TransportType transportType) {
        this.transportType = transportType;
    }

    public byte[] getQrCode() {
        return qrCode;
    }

    public ManouverRequest qrCode(byte[] qrCode) {
        this.qrCode = qrCode;
        return this;
    }

    public void setQrCode(byte[] qrCode) {
        this.qrCode = qrCode;
    }

    public String getQrCodeContentType() {
        return qrCodeContentType;
    }

    public ManouverRequest qrCodeContentType(String qrCodeContentType) {
        this.qrCodeContentType = qrCodeContentType;
        return this;
    }

    public void setQrCodeContentType(String qrCodeContentType) {
        this.qrCodeContentType = qrCodeContentType;
    }

    public Location getOrigin() {
        return origin;
    }

    public ManouverRequest origin(Location location) {
        this.origin = location;
        return this;
    }

    public void setOrigin(Location location) {
        this.origin = location;
    }

    public Location getDestiny() {
        return destiny;
    }

    public ManouverRequest destiny(Location location) {
        this.destiny = location;
        return this;
    }

    public void setDestiny(Location location) {
        this.destiny = location;
    }

    public Manouver getManouver() {
        return manouver;
    }

    public ManouverRequest manouver(Manouver manouver) {
        this.manouver = manouver;
        return this;
    }

    public void setManouver(Manouver manouver) {
        this.manouver = manouver;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ManouverRequest)) {
            return false;
        }
        return id != null && id.equals(((ManouverRequest) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "ManouverRequest{" +
            "id=" + getId() +
            ", title='" + getTitle() + "'" +
            ", description='" + getDescription() + "'" +
            ", date='" + getDate() + "'" +
            ", transportType='" + getTransportType() + "'" +
            ", qrCode='" + getQrCode() + "'" +
            ", qrCodeContentType='" + getQrCodeContentType() + "'" +
            "}";
    }
}
