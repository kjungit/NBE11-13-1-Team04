package com.springbeans.cafemenumanagement.question.service;

import com.springbeans.cafemenumanagement.answer.domain.repository.AnswerRepository;
import com.springbeans.cafemenumanagement.answer.dto.response.AnswerDetailResponse;
import com.springbeans.cafemenumanagement.question.domain.entity.Question;
import com.springbeans.cafemenumanagement.question.domain.repository.QuestionRepository;
import com.springbeans.cafemenumanagement.question.dto.request.QuestionAuthRequest;
import com.springbeans.cafemenumanagement.question.dto.request.QuestionCreateRequest;
import com.springbeans.cafemenumanagement.question.dto.response.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class QuestionService {

    private final QuestionRepository questionRepository;
    private final AnswerRepository answerRepository;

    @Transactional
    public QuestionSaveResponse create( QuestionCreateRequest request ) {

        // 요청값 검증
        validateCreateRequest(request);

        // 문의 생성 및 저장
        Question question = Question.create(
                request.email(),
                request.title(),
                request.content()
        );

        questionRepository.save(question);

        // 저장 결과 반환
        return QuestionSaveResponse.from(question);
    }

    public List<QuestionPreviewResponse> getQuestions( String email ) {

        // 이메일로 본인의 활성 문의 목록 조회
        return questionRepository
                .findByEmailAndIsActiveTrueOrderByCreatedAtDesc(email)
                .stream()
                .map(QuestionPreviewResponse::from)
                .toList();
    }

    public QuestionDetailResponse getQuestion( Long id, String email ) {

        // 이메일 검증
        if (email == null || email.isBlank()) {
            // TODO : 문의 관련 커스텀 예외 적용
            throw new IllegalArgumentException("이메일은 필수입니다.");
        }

        // 활성 문의 조회
        Question question = questionRepository.findByIdAndIsActiveTrue(id)
                // TODO : 문의 관련 커스텀 예외 적용
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 문의입니다."));

        // 요청한 이메일의 문의인지 확인
        if (!question.getEmail().equals(email)) {
            // TODO : 문의 관련 커스텀 예외 적용
            throw new IllegalArgumentException("문의 조회 권한이 없습니다.");
        }

        // 활성 답변 조회 (없으면 null)
        AnswerDetailResponse answer = answerRepository.findByQuestionIdAndIsActiveTrue(id)
                .map(AnswerDetailResponse::from)
                .orElse(null);

        // 상세 조회 결과 반환
        return QuestionDetailResponse.from(question, answer);
    }

    public List<AdminQuestionPreviewResponse> getAdminQuestions() {

        // 관리자 전체 활성 문의 조회
        return questionRepository
                .findAllByIsActiveTrueOrderByCreatedAtDesc()
                .stream()
                .map(AdminQuestionPreviewResponse::from)
                .toList();
    }

    public AdminQuestionDetailResponse getAdminQuestion( Long id ) {

        // 활성 문의 조회
        Question question = questionRepository.findByIdAndIsActiveTrue(id)
                // TODO : 문의 관련 커스텀 예외 적용
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 문의입니다."));

        // 활성 답변 조회 (없으면 null)
        AnswerDetailResponse answer = answerRepository.findByQuestionIdAndIsActiveTrue(id)
                .map(AnswerDetailResponse::from)
                .orElse(null);

        // 관리자 상세 조회 결과 반환
        return AdminQuestionDetailResponse.from(question, answer);
    }

    @Transactional
    public void delete(Long questionId, QuestionAuthRequest request ) {

        // 삭제 요청값 검증
        if (request == null
                || request.email() == null
                || request.email().isBlank()) {
            // TODO : 문의 관련 커스텀 예외 적용
            throw new IllegalArgumentException("이메일은 필수입니다.");
        }

        // 활성 문의 조회
        Question question =
                questionRepository.findByIdAndIsActiveTrue(questionId)
                        // TODO : 문의 관련 커스텀 예외 적용
                        .orElseThrow(() ->
                                new IllegalArgumentException("존재하지 않는 문의입니다.")
                        );

        // 문의 작성자 확인
        if (!question.getEmail().equals(request.email())) {
            // TODO : 문의 관련 커스텀 예외 적용
            throw new IllegalArgumentException("문의 삭제 권한이 없습니다.");
        }

        // 연결된 활성 답변이 있으면 함께 비활성화
        answerRepository.findByQuestionIdAndIsActiveTrue(questionId)
                .ifPresent(answer -> answer.deactivate());

        // 문의 비활성화
        question.deactivate();
    }

    private void validateCreateRequest(QuestionCreateRequest request) {

        // TODO : 문의 관련 커스텀 예외 적용
        if (request == null) {
            throw new IllegalArgumentException("문의 등록 요청은 필수입니다.");
        }

        // TODO : 문의 관련 커스텀 예외 적용
        if (request.email() == null || request.email().isBlank()) {
            throw new IllegalArgumentException("이메일은 필수입니다.");
        }

        // TODO : 문의 관련 커스텀 예외 적용
        if (request.title() == null || request.title().isBlank()) {
            throw new IllegalArgumentException("제목은 필수입니다.");
        }

        // TODO : 문의 관련 커스텀 예외 적용
        if (request.content() == null || request.content().isBlank()) {
            throw new IllegalArgumentException("문의 내용은 필수입니다.");
        }
    }
}