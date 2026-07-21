package com.springbeans.cafemenumanagement.product.dto;

import com.springbeans.cafemenumanagement.product.entity.Product;

public record ProductResponse(
        Long id,
        String name,
        int price,
        String category,
        String filePath
) {
    public static ProductResponse from(Product product) {
        return new ProductResponse(
                product.getId(),
                product.getName(),
                product.getPrice(),
                product.getCategory(),
                product.getFilePath()
        );
    }
}