package com.sistema.amigo.domain;
import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import org.springframework.data.elasticsearch.annotations.FieldType;
import java.io.Serializable;
import java.time.Instant;

/**
 * A Location.
 */
@Entity
@Table(name = "location")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@org.springframework.data.elasticsearch.annotations.Document(indexName = "location")
public class Location implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @org.springframework.data.elasticsearch.annotations.Field(type = FieldType.Keyword)
    private Long id;

    @Column(name = "address")
    private String address;

    @Column(name = "lat")
    private String lat;

    @Column(name = "lng")
    private String lng;

    @Column(name = "timestamp")
    private Instant timestamp;

    @OneToOne(mappedBy = "origin")
    @JsonIgnore
    private ManouverRequest manouverRequestOrigin;

    @OneToOne(mappedBy = "destiny")
    @JsonIgnore
    private ManouverRequest manouverRequestDestiny;

    @OneToOne(mappedBy = "location")
    @JsonIgnore
    private Inspection inspection;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAddress() {
        return address;
    }

    public Location address(String address) {
        this.address = address;
        return this;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getLat() {
        return lat;
    }

    public Location lat(String lat) {
        this.lat = lat;
        return this;
    }

    public void setLat(String lat) {
        this.lat = lat;
    }

    public String getLng() {
        return lng;
    }

    public Location lng(String lng) {
        this.lng = lng;
        return this;
    }

    public void setLng(String lng) {
        this.lng = lng;
    }

    public Instant getTimestamp() {
        return timestamp;
    }

    public Location timestamp(Instant timestamp) {
        this.timestamp = timestamp;
        return this;
    }

    public void setTimestamp(Instant timestamp) {
        this.timestamp = timestamp;
    }

    public ManouverRequest getManouverRequestOrigin() {
        return manouverRequestOrigin;
    }

    public Location manouverRequestOrigin(ManouverRequest manouverRequest) {
        this.manouverRequestOrigin = manouverRequest;
        return this;
    }

    public void setManouverRequestOrigin(ManouverRequest manouverRequest) {
        this.manouverRequestOrigin = manouverRequest;
    }

    public ManouverRequest getManouverRequestDestiny() {
        return manouverRequestDestiny;
    }

    public Location manouverRequestDestiny(ManouverRequest manouverRequest) {
        this.manouverRequestDestiny = manouverRequest;
        return this;
    }

    public void setManouverRequestDestiny(ManouverRequest manouverRequest) {
        this.manouverRequestDestiny = manouverRequest;
    }

    public Inspection getInspection() {
        return inspection;
    }

    public Location inspection(Inspection inspection) {
        this.inspection = inspection;
        return this;
    }

    public void setInspection(Inspection inspection) {
        this.inspection = inspection;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Location)) {
            return false;
        }
        return id != null && id.equals(((Location) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "Location{" +
            "id=" + getId() +
            ", address='" + getAddress() + "'" +
            ", lat='" + getLat() + "'" +
            ", lng='" + getLng() + "'" +
            ", timestamp='" + getTimestamp() + "'" +
            "}";
    }
}
