package com.springbeans.cafemenumanagement.order.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/")
public class PageController {

    @GetMapping("/")
    public String home() {
        return "order-create";
    }

    @GetMapping("/orders")
    public String listPage() {
        return "order-list";
    }

    @GetMapping("/orders/detail/{orderId}")
    public String detailPage(@PathVariable Long orderId) {
        return "order-detail";
    }


}