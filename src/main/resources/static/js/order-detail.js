let currentOrderId = null;

document.addEventListener("DOMContentLoaded", () => {
    const pathParts = window.location.pathname.split("/");
    const orderId = pathParts[pathParts.length - 1];
    console.log("orderId", orderId)
    if (!orderId) {
        alert("잘못된 접근입니다. 주문 번호가 누락되었습니다.");
        location.href = "/orders";
        return;
    }

    fetchOrderDetail(orderId);
});

// 1. API: OrderController - GET /api/orders/{orderId}
async function fetchOrderDetail(orderId) {
    try {
        const response = await fetch(`/api/orders/${orderId}`);
        if (!response.ok) throw new Error("주문 정보를 불러오지 못했습니다.");

        const order = await response.json();
        renderOrderDetail(order);
    } catch (error) {
        alert(error.message);
        location.href = "/orders";
    }
}

function renderOrderDetail(order) {
    document.getElementById("detailOrderId").innerText = order.orderId;
    document.getElementById("detailOrderCode").innerText = order.orderCode;
    document.getElementById("detailEmail").innerText = order.email;
    document.getElementById("detailStatus").innerHTML = getStatusBadge(order.status);
    document.getElementById("detailPostalCode").innerText = order.postalCode || "-";
    document.getElementById("detailAddress").innerText = order.address || "-";
    document.getElementById("detailOrderedAt").innerText = new Date(order.orderedAt).toLocaleString();

    // 취소 요청 버튼 상태 분기 처리 (ORDERED / CANCEL_REQUESTED 인 상태만)
    const btnCancel = document.getElementById("btnCancel");
    if (order.status === "CANCELED" || order.status === "CONFIRMED") {
        btnCancel.style.display = "none";
    } else {
        btnCancel.style.display = "inline-block";
    }
}

// 2. API: OrderController - PATCH /api/orders/{orderId}/cancel (취소 요청)
async function requestCancelOrder() {
    if (!confirm("정말로 주문 취소를 요청하시겠습니까?")) return;

    try {
        const response = await fetch(`/api/orders/${currentOrderId}/cancel`, {
            method: "PATCH"
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(errorData?.message || "주문 취소 요청에 실패했습니다.");
        }

        const result = await response.json();
        alert("주문 취소 요청이 접수되었습니다.");
        fetchOrderDetail(currentOrderId);
    } catch (error) {
        alert(error.message);
    }
}

function getStatusBadge(status) {
    switch (status) {
        case "ORDERED":
            return `<span class="badge badge-ordered">미확정</span>`;
        case "CONFIRMED":
            return `<span class="badge badge-confirmed">주문 확정</span>`;
        case "CANCEL_REQUESTED":
            return `<span class="badge badge-cancel-requested">취소 요청</span>`;
        case "CANCELED":
            return `<span class="badge badge-canceled">취소 완료</span>`;
        default:
            return `<span class="badge">${status}</span>`;
    }
}