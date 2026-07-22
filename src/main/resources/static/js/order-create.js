let cart = []; // { productId, name, price, amount }

document.addEventListener("DOMContentLoaded", () => {
    fetchProducts();
});

// 1. 상품 목록 불러오기
async function fetchProducts() {
    try {
        const response = await fetch("/api/products");
        if (!response.ok) throw new Error("상품 목록을 불러올 수 없습니다.");
        const products = await response.json();
        renderProducts(products);
    } catch (error) {
        console.error(error);
        alert(error.message);
    }
}

function renderProducts(products) {
    const container = document.getElementById("productList");
    container.innerHTML = "";

    products.forEach(product => {
        const item = document.createElement("div");
        item.className = "product-item-card";
        item.innerHTML = `
            <img src="${product.filePath}" alt="${product.name}" onerror="this.src='https://placehold.co/150x150?text=No+Img'">
            <div class="name">${product.name}</div>
            <div class="price">${product.price.toLocaleString()}원</div>
            <button class="btn-primary btn-sm btn-block" onclick="addToCart(${product.id}, '${product.name}', ${product.price})">담기</button>
        `;
        container.appendChild(item);
    });
}

// 2. 장바구니 제어
function addToCart(productId, name, price) {
    const existing = cart.find(item => item.productId === productId);
    if (existing) {
        existing.amount += 1;
    } else {
        cart.push({ productId, name, price, amount: 1 });
    }
    renderCart();
}

function updateCartAmount(productId, delta) {
    const item = cart.find(i => i.productId === productId);
    if (!item) return;

    item.amount += delta;
    if (item.amount <= 0) {
        removeFromCart(productId);
    } else {
        renderCart();
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.productId !== productId);
    renderCart();
}

function renderCart() {
    const tbody = document.getElementById("cartTableBody");
    tbody.innerHTML = "";

    let total = 0;
    cart.forEach(item => {
        const itemTotal = item.price * item.amount;
        total += itemTotal;

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${item.name}</td>
            <td>
                <button class="btn-outline btn-sm" onclick="updateCartAmount(${item.productId}, -1)">-</button>
                <span>${item.amount}</span>
                <button class="btn-outline btn-sm" onclick="updateCartAmount(${item.productId}, 1)">+</button>
            </td>
            <td>${itemTotal.toLocaleString()}원</td>
            <td><button class="btn-danger btn-sm" onclick="removeFromCart(${item.productId})">✕</button></td>
        `;
        tbody.appendChild(tr);
    });

    document.getElementById("totalPrice").innerText = `${total.toLocaleString()}원`;
}

// DTO Payload 생성 헬퍼
function buildCartPayload() {
    const email = document.getElementById("email").value.trim();
    const address = document.getElementById("address").value.trim();
    const postalCode = document.getElementById("postalCode").value.trim();

    return {
        email: email,
        address: address,
        postalCode: postalCode,
        items: cart.map(item => ({
            productId: item.productId,
            amount: item.amount
        }))
    };
}

// 3. API: CartController - /api/cart/check (장바구니 검증)
async function checkCart() {
    if (cart.length === 0) {
        alert("장바구니가 비어 있습니다.");
        return;
    }

    try {
        const response = await fetch("/api/cart/check", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(buildCartPayload())
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || "장바구니 검증에 실패했습니다.");
        }

        const message = await response.text();
        alert(message);
    } catch (error) {
        alert(error.message);
    }
}

// 4. API: CartController - /api/cart/order (주문 생성)
async function handleOrderSubmit(event) {
    event.preventDefault();

    if (cart.length === 0) {
        alert("장바구니에 상품을 담아주세요.");
        return;
    }

    try {
        const response = await fetch("/api/cart/order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(buildCartPayload())
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || "주문 생성 중 오류가 발생했습니다.");
        }

        alert("주문이 성공적으로 완료되었습니다!");
        location.href = "/orders";
    } catch (error) {
        alert(error.message);
    }
}