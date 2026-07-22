let currentEmail = "";

document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    currentEmail = urlParams.get("email");

    // Path Pattern: /questions/{questionId}
    const pathSegments = window.location.pathname.split('/');
    const questionId = pathSegments[pathSegments.length - 1];

    if (!questionId || !currentEmail) {
        alert("잘못된 접근입니다. 문의 ID 또는 이메일이 누락되었습니다.");
        location.href = "/questions";
        return;
    }

    fetchQuestionDetail(questionId, currentEmail);
});

async function fetchQuestionDetail(questionId, email) {
    try {
        const response = await fetch(`/api/questions/${questionId}?email=${encodeURIComponent(email)}`);

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(errorData?.message || "문의 정보를 불러올 수 없습니다.");
        }

        const data = await response.json();
        renderDetail(data);
    } catch (error) {
        console.error("Fetch Detail Error:", error);
        alert(error.message);
        location.href = `/questions?email=${encodeURIComponent(email)}`;
    }
}

function renderDetail(data) {
    document.getElementById("questionTitle").innerText = data.title;
    document.getElementById("questionContent").innerText = data.content;
    document.getElementById("questionCreatedAt").innerText = data.createdAt ? new Date(data.createdAt).toLocaleString() : "";
    document.getElementById("questionStatus").innerHTML = getStatusBadge(data.status);

    // 답변 존재 여부 분기 처리 (AnswerDetailResponse null 체크)
    if (data.answer) {
        document.getElementById("answerContainer").style.display = "block";
        document.getElementById("answerContent").innerText = data.answer.content || data.answer.comment || "";
        document.getElementById("answerCreatedAt").innerText = data.answer.createdAt ? new Date(data.answer.createdAt).toLocaleString() : "";
    } else {
        document.getElementById("answerContainer").style.display = "none";
    }
}

function getStatusBadge(status) {
    if (status === "ANSWERED") {
        return `<span class="badge badge-answered">답변 완료</span>`;
    }
    return `<span class="badge badge-waiting">답변 대기</span>`;
}

function goBackToList() {
    location.href = `/questions?email=${encodeURIComponent(currentEmail)}`;
}