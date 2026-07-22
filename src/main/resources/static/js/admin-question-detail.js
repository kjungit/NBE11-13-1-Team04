let currentQuestionId = null;

document.addEventListener("DOMContentLoaded", () => {
    // Path: /admin/questions/{questionId}
    const pathSegments = window.location.pathname.split('/');
    currentQuestionId = pathSegments[pathSegments.length - 1];

    if (!currentQuestionId || isNaN(currentQuestionId)) {
        alert("올바르지 않은 접근입니다.");
        location.href = "/admin/questions";
        return;
    }

    fetchAdminQuestionDetail(currentQuestionId);
});

async function fetchAdminQuestionDetail(id) {
    try {
        const response = await fetch(`/api/admin/questions/${id}`);

        if (!response.ok) {
            throw new Error("문의 상세 정보를 가져오는데 실패했습니다.");
        }

        const data = await response.json();
        renderDetail(data);
    } catch (error) {
        console.error("Fetch Detail Error:", error);
        alert(error.message);
        location.href = "/admin/questions";
    }
}

function renderDetail(data) {
    document.getElementById("questionEmail").innerText = data.email || "-";
    document.getElementById("questionTitle").innerText = data.title || "-";
    document.getElementById("questionContent").innerText = data.content || "-";
    document.getElementById("questionCreatedAt").innerText = data.createdAt ? new Date(data.createdAt).toLocaleString() : "-";
    document.getElementById("questionStatus").innerHTML = getStatusBadge(data.status);

    // 이미 등록된 답변이 존재하는 경우
    if (data.answer) {
        document.getElementById("answerContent").value = data.answer.content || data.answer.comment || "";
        document.getElementById("btnSubmitAnswer").innerText = "답변 수정";
    }
}

async function handleSaveAnswer(event) {
    event.preventDefault();

    const content = document.getElementById("answerContent").value.trim();
    if (!content) {
        alert("답변 내용을 입력해주세요.");
        return;
    }

    try {
        // 백엔드 답변 작성 API 엔드포인트에 맞게 호출
        const response = await fetch(`/api/admin/questions/${currentQuestionId}/answers`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ content })
        });

        if (!response.ok) {
            const err = await response.json().catch(() => null);
            throw new Error(err?.message || "답변 저장 중 오류가 발생했습니다.");
        }

        alert("답변이 성공적으로 저장되었습니다.");
        location.href = "/admin/questions";
    } catch (error) {
        console.error("Save Answer Error:", error);
        alert(error.message);
    }
}

function getStatusBadge(status) {
    if (status === "ANSWERED") {
        return `<span class="badge badge-answered">답변 완료</span>`;
    }
    return `<span class="badge badge-waiting">답변 대기</span>`;
}