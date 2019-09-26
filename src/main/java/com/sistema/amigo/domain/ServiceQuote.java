package com.sistema.amigo.domain;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import org.springframework.data.elasticsearch.annotations.FieldType;
import java.io.Serializable;
import java.time.Instant;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

import com.sistema.amigo.domain.enumeration.ServiceUnitType;

import com.sistema.amigo.domain.enumeration.StatusType;

import com.sistema.amigo.domain.enumeration.CurrencyType;

/**
 * A ServiceQuote.
 */
@Entity
@Table(name = "service_quote")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@org.springframework.data.elasticsearch.annotations.Document(indexName = "servicequote")
public class ServiceQuote implements Serializable {

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

    @Column(name = "quantity")
    private Integer quantity;

    @Column(name = "price")
    private Float price;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "unit", nullable = false)
    private ServiceUnitType unit;

    @Column(name = "expedition_date")
    private Instant expeditionDate;

    @Column(name = "expiration_date")
    private LocalDate expirationDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private StatusType status;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "currency", nullable = false)
    private CurrencyType currency;

    @Column(name = "approved_by")
    private String approvedBy;

    @Lob
    @Column(name = "qr_code")
    private byte[] qrCode;

    @Column(name = "qr_code_content_type")
    private String qrCodeContentType;

    @OneToOne
    @JoinColumn(unique = true)
    private Contract contract;

    @OneToMany(mappedBy = "serviceQuote")
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<ServiceRequest> serviceRequests = new HashSet<>();

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

    public ServiceQuote title(String title) {
        this.title = title;
        return this;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public ServiceQuote description(String description) {
        this.description = description;
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public ServiceQuote quantity(Integer quantity) {
        this.quantity = quantity;
        return this;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public Float getPrice() {
        return price;
    }

    public ServiceQuote price(Float price) {
        this.price = price;
        return this;
    }

    public void setPrice(Float price) {
        this.price = price;
    }

    public ServiceUnitType getUnit() {
        return unit;
    }

    public ServiceQuote unit(ServiceUnitType unit) {
        this.unit = unit;
        return this;
    }

    public void setUnit(ServiceUnitType unit) {
        this.unit = unit;
    }

    public Instant getExpeditionDate() {
        return expeditionDate;
    }

    public ServiceQuote expeditionDate(Instant expeditionDate) {
        this.expeditionDate = expeditionDate;
        return this;
    }

    public void setExpeditionDate(Instant expeditionDate) {
        this.expeditionDate = expeditionDate;
    }

    public LocalDate getExpirationDate() {
        return expirationDate;
    }

    public ServiceQuote expirationDate(LocalDate expirationDate) {
        this.expirationDate = expirationDate;
        return this;
    }

    public void setExpirationDate(LocalDate expirationDate) {
        this.expirationDate = expirationDate;
    }

    public StatusType getStatus() {
        return status;
    }

    public ServiceQuote status(StatusType status) {
        this.status = status;
        return this;
    }

    public void setStatus(StatusType status) {
        this.status = status;
    }

    public CurrencyType getCurrency() {
        return currency;
    }

    public ServiceQuote currency(CurrencyType currency) {
        this.currency = currency;
        return this;
    }

    public void setCurrency(CurrencyType currency) {
        this.currency = currency;
    }

    public String getApprovedBy() {
        return approvedBy;
    }

    public ServiceQuote approvedBy(String approvedBy) {
        this.approvedBy = approvedBy;
        return this;
    }

    public void setApprovedBy(String approvedBy) {
        this.approvedBy = approvedBy;
    }

    public byte[] getQrCode() {
        return qrCode;
    }

    public ServiceQuote qrCode(byte[] qrCode) {
        this.qrCode = qrCode;
        return this;
    }

    public void setQrCode(byte[] qrCode) {
        this.qrCode = qrCode;
    }

    public String getQrCodeContentType() {
        return qrCodeContentType;
    }

    public ServiceQuote qrCodeContentType(String qrCodeContentType) {
        this.qrCodeContentType = qrCodeContentType;
        return this;
    }

    public void setQrCodeContentType(String qrCodeContentType) {
        this.qrCodeContentType = qrCodeContentType;
    }

    public Contract getContract() {
        return contract;
    }

    public ServiceQuote contract(Contract contract) {
        this.contract = contract;
        return this;
    }

    public void setContract(Contract contract) {
        this.contract = contract;
    }

    public Set<ServiceRequest> getServiceRequests() {
        return serviceRequests;
    }

    public ServiceQuote serviceRequests(Set<ServiceRequest> serviceRequests) {
        this.serviceRequests = serviceRequests;
        return this;
    }

    public ServiceQuote addServiceRequest(ServiceRequest serviceRequest) {
        this.serviceRequests.add(serviceRequest);
        serviceRequest.setServiceQuote(this);
        return this;
    }

    public ServiceQuote removeServiceRequest(ServiceRequest serviceRequest) {
        this.serviceRequests.remove(serviceRequest);
        serviceRequest.setServiceQuote(null);
        return this;
    }

    public void setServiceRequests(Set<ServiceRequest> serviceRequests) {
        this.serviceRequests = serviceRequests;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ServiceQuote)) {
            return false;
        }
        return id != null && id.equals(((ServiceQuote) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "ServiceQuote{" +
            "id=" + getId() +
            ", title='" + getTitle() + "'" +
            ", description='" + getDescription() + "'" +
            ", quantity=" + getQuantity() +
            ", price=" + getPrice() +
            ", unit='" + getUnit() + "'" +
            ", expeditionDate='" + getExpeditionDate() + "'" +
            ", expirationDate='" + getExpirationDate() + "'" +
            ", status='" + getStatus() + "'" +
            ", currency='" + getCurrency() + "'" +
            ", approvedBy='" + getApprovedBy() + "'" +
            ", qrCode='" + getQrCode() + "'" +
            ", qrCodeContentType='" + getQrCodeContentType() + "'" +
            "}";
    }
}
