package com.springbeans.cafemenumanagement.order.service;


import com.springbeans.cafemenumanagement.order.dto.request.CartOrderRequest;
import com.springbeans.cafemenumanagement.order.domain.entity.Order;
import com.springbeans.cafemenumanagement.order.domain.entity.OrderProduct;
import com.springbeans.cafemenumanagement.order.domain.repository.OrderRepository;
import com.springbeans.cafemenumanagement.product.entity.Product;
import com.springbeans.cafemenumanagement.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;


@Service
@RequiredArgsConstructor
public class CartService {


    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;


    /**
     * 상품 존재 여부 확인
     * (재고 부족 여부는 프론트에서 처리하기로 하여 여기서는 체크하지 않음)
     */
    public void check(
            CartOrderRequest request
    ){

        request.getItems()
                .forEach(item -> {

                    Product product =
                            productRepository.findById(item.getProductId())
                                    .orElseThrow(() ->
                                            new ResponseStatusException(
                                                    HttpStatus.NOT_FOUND,
                                                    "상품이 존재하지 않습니다. (상품ID: " + item.getProductId() + ")"
                                            ));

                    System.out.println(
                            "상품ID : "
                                    + item.getProductId()
                    );

                    System.out.println(
                            "수량 : "
                                    + item.getAmount()
                    );

                });

    }



    /**
     * 장바구니 -> 주문 생성
     */
    @Transactional
    public void createOrder(
            CartOrderRequest request
    ){

        // 상품 존재 여부만 먼저 확인
        check(request);

        LocalDateTime start =
                LocalDateTime.now()
                        .toLocalDate()
                        .atStartOfDay();

        LocalDateTime end =
                LocalDateTime.now()
                        .toLocalDate()
                        .atTime(14, 0);

        Order order =
                orderRepository
                        .findFirstByEmailAndOrderedAtBetween(
                                request.getEmail(),
                                start,
                                end
                        )
                        .orElseGet(() -> {

                            Order newOrder =
                                    Order.create(
                                            request.getEmail(),
                                            request.getAddress(),
                                            request.getPostalCode()
                                    );

                            return orderRepository.save(newOrder);
                        });

        request.getItems()
                .forEach(item -> {

                    Product product =
                            productRepository.findById(item.getProductId())
                                    .orElseThrow(() ->
                                            new ResponseStatusException(
                                                    HttpStatus.NOT_FOUND,
                                                    "상품이 존재하지 않습니다. (상품ID: " + item.getProductId() + ")"
                                            ));

                    // 재고 차감 (영속 상태 엔티티라 트랜잭션 커밋 시 자동 반영됨)
                    product.decreaseStock(item.getAmount());

                    OrderProduct orderProduct =
                            new OrderProduct(
                                    product,
                                    item.getAmount(),
                                    order
                            );

                    order.addItem(orderProduct);

                });

        orderRepository.save(order);
    }


}