package com.springbeans.cafemenumanagement.product.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "products")
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    String name;

    @Column(nullable = false)
    int price;

    @Column(nullable = false, length = 50)
    String category;

    @Column(nullable = false)
    String filePath;

    // 값을 저장할 때 builder에 기본값을 넣도록 함
    @Builder.Default
    @Column(nullable = false)
    Boolean isActive = true;

    @Column
    LocalDateTime createdAt;

    @Column
    LocalDateTime updatedAt;


    public void update(String name, Integer price, String category, String filePath) {
        this.name = name;
        this.price = price;
        this.category = category;
        this.filePath = filePath;
        updatedAt = LocalDateTime.now();
    }
}
