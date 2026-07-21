// 로그아웃 처리
async function logout() {
    if (!confirm("로그아웃 하시겠습니까?")) return;

    try {
        const res = await fetch("/admin/auth/logout", { method: "POST" });
        if (res.ok || res.status === 200) {
            location.href = "/admin/login";
        } else {
            alert("로그아웃 처리 중 오류가 발생했습니다.");
        }
    } catch (error) {
        console.error("Logout Error:", error);
        alert("네트워크 통신 오류가 발생했습니다.");
    }
}

// 메뉴 등록 모달창 오픈 (기능 확장용)
function openAddModal() {
    alert("새 메뉴 등록 모달 또는 페이지 전환 영역입니다.");
    // 여기에 모달창을 띄우거나 location.href = '/admin/menu/new' 처리를 연동하세요.
}

// 메뉴 수정 처리
function editMenu(menuId) {
    console.log(`Edit Menu ID: ${menuId}`);
    alert(`ID ${menuId}번 메뉴의 수정 페이지로 이동하거나 팝업을 띄웁니다.`);
}

// 메뉴 삭제 처리
async function deleteMenu(menuId) {
    if (!confirm("정말로 이 메뉴를 삭제하시겠습니까?")) return;

    // 백엔드 API 연동 예시
    /*
    const res = await fetch(`/admin/api/menu/${menuId}`, { method: "DELETE" });
    if(res.ok) {
        alert("삭제되었습니다.");
        location.reload();
    }
    */
    alert(`ID ${menuId}번 메뉴 삭제 요청 완료 (API 연동 필요)`);
}