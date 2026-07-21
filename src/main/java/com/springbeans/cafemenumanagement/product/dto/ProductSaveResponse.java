package com.springbeans.cafemenumanagement.product.dto;

import com.springbeans.cafemenumanagement.product.entity.Product;

import java.time.LocalDateTime;

public record ProductSaveResponse(
        Long id,
        String name,
        int price,
        String category,
        String filePath,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
){
    public static ProductSaveResponse from(Product product){
        return new ProductSaveResponse(
                product.getId(),
                product.getName(),
                product.getPrice(),
                product.getCategory(),
                product.getFilePath(),
                product.getCreatedAt(),
                product.getUpdatedAt()
        );
    }
}
