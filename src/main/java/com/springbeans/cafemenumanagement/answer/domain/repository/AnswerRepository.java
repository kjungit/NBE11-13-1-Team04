package com.springbeans.cafemenumanagement.answer.domain.repository;

import com.springbeans.cafemenumanagement.answer.domain.entity.Answer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AnswerRepository extends JpaRepository<Answer, Long> {

    // 활성 답변 목록 조회
    Optional<Answer> findByQuestionIdAndIsActiveTrue(Long questionId);

    // 활성 답변 단건 조회
    Optional<Answer> findByIdAndIsActiveTrue(Long answerId);

    // 활성 여부와 관계없이 해당 문의에 저장된 답변 조회
    Optional<Answer> findByQuestionId(Long questionId);

    // 활성 여부와 관계없이 답변 데이터 존재 여부 확인
    boolean existsByQuestionId(Long questionId);
}