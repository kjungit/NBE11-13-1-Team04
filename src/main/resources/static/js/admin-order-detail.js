document.addEventListener("DOMContentLoaded", () => {
    // URL Path (/admin/orders/{orderId})에서 orderId 추출
    const pathParts = window.location.pathname.split("/");
    const orderId = pathParts[pathParts.length - 1];

    if (orderId && !isNaN(orderId)) {
        fetchOrderDetail(orderId);
    }
});

async function fetchOrderDetail(orderId) {
    try {
        const response = await fetch(`/api/admin/orders/${orderId}`);
        if (!response.ok) {
            throw new Error("주문 상세 정보를 가져오는 데 실패했습니다.");
        }
        const data = await response.json();
        renderOrderDetail(data);
    } catch (error) {
        console.error("Fetch Order Detail Error:", error);
        alert(error.message);
    }
}

function renderOrderDetail(data) {
    document.getElementById("detailOrderCode").textContent = data.orderCode;
    document.getElementById("detailOrderedAt").textContent = data.orderedAt ? data.orderedAt.replace("T", " ").substring(0, 16) : "-";
    document.getElementById("detailEmail").textContent = data.email;
    document.getElementById("detailAddress").textContent = data.address;
    document.getElementById("detailPostalCode").textContent = data.postalCode;
    document.getElementById("detailTotalPrice").textContent = data.totalPrice ? data.totalPrice.toLocaleString() : "0";

    const statusElem = document.getElementById("detailStatus");
    statusElem.textContent = data.statusDescription;
    statusElem.className = `status-badge ${getStatusBadgeClass(data.status)}`;

    // 상품 목록 렌더링
    const tbody = document.getElementById("detailItemTableBody");
    tbody.innerHTML = "";

    if (!data.orderItems || data.orderItems.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;">주문 상품이 없습니다.</td></tr>`;
        return;
    }

    data.orderItems.forEach(item => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${item.productId}</td>
            <td><strong>${item.productName}</strong></td>
            <td>${item.productPrice.toLocaleString()}원</td>
            <td>${item.amount}개</td>
            <td>${item.itemTotalPrice.toLocaleString()}원</td>
        `;
        tbody.appendChild(tr);
    });
}

function getStatusBadgeClass(status) {
    switch (status) {
        case "CONFIRMED": return "available";
        case "ORDERED": return "ordered";
        case "CANCEL_REQUESTED": return "warning";
        case "CANCELED": return "soldout";
        default: return "";
    }
}

async function logout() {
    if (!confirm("로그아웃 하시겠습니까?")) return;

    try {
        const res = await fetch("/admin/auth/logout", { method: "POST" });
        if (res.ok) {
            location.href = "/admin/login";
        } else {
            alert("로그아웃 처리 중 오류가 발생했습니다.");
        }
    } catch (error) {
        console.error("Logout Error:", error);
        alert("네트워크 통신 오류가 발생했습니다.");
    }
}