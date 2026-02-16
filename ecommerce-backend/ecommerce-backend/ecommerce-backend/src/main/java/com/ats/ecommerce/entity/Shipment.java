package com.ats.ecommerce.entity;

import com.ats.ecommerce.entity.enums.ShipmentStatus;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "shipments")
@Data
public class Shipment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String carrier;
    private String trackingNumber;

    private String address;

    @Enumerated(EnumType.STRING)
    private ShipmentStatus status;

    @OneToOne
    @JoinColumn(name = "order_id")
    private Order order;
}

