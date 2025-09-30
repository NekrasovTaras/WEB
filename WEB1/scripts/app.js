const products = [
    { id: 1, title: 'Ромашки', price: 399 },
    { id: 2, title: 'Тюльпаны', price: 899 },
    { id: 3, title: 'Розы', price: 2499 }
];

let cart = [];

function renderProducts() {
    const container = document.getElementById('products');
    container.innerHTML = '';
    
    products.forEach(product => {
        const productEl = document.createElement('div');
        productEl.className = 'product';
        productEl.innerHTML = `
            <h3>${product.title}</h3>
            <p>Цена: ${product.price} ₽</p>
            <button onclick="addToCart(${product.id})">Добавить в корзину</button>
        `;
        container.appendChild(productEl);
    });
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    cart.push(product);
    updateCart();
}

function updateCart() {
    const cartBtn = document.getElementById('cart-btn');
    cartBtn.textContent = `Корзина (${cart.length})`;
}

document.addEventListener('DOMContentLoaded', renderProducts);