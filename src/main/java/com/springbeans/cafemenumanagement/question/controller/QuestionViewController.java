package com.springbeans.cafemenumanagement.question.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/questions")
public class QuestionViewController {

    // 문의 작성 화면
    @GetMapping("/new")
    public String createForm() {
        return "question/question-create";
    }

    // 문의 조회 화면
    @GetMapping
    public String detailForm() {
        return "question/question-detail";
    }
}