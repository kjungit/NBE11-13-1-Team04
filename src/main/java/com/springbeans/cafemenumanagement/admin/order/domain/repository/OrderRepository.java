package com.springbeans.cafemenumanagement.admin.order.domain.repository;

import com.springbeans.cafemenumanagement.admin.order.domain.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long>, OrderRepositoryCustom {
    @Query("select o from Order o " +
           "left join fetch o.orderProducts op " +
           "left join fetch op.product " +
           "where o.id = :orderId")
    Optional<Order> findByIdWithProducts( @Param ("orderId") Long orderId);
}
