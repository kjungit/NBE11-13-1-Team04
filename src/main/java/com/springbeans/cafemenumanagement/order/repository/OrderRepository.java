package com.springbeans.cafemenumanagement.order.repository;

import com.springbeans.cafemenumanagement.order.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;


public interface OrderRepository
        extends JpaRepository<Order, Long> {


    Optional<Order> findFirstByEmailAndOrderedAtBetween(
            String email,
            LocalDateTime start,
            LocalDateTime end
    );

    List<Order> findByEmailOrderByOrderedAtDesc(String email);

    List<Order> findAllByOrderByOrderedAtDesc();

}