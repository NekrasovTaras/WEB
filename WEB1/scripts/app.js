const products = [
    { id: 'p1', title: 'Ромашки', price: 399, image: 'images/cveti1.jpg' },
    { id: 'p2', title: 'Тюльпаны', price: 899, image: 'images/cveti2.jpg' },
    { id: 'p3', title: 'Розы', price: 2499, image: 'images/cveti3.jpg' }
];

let cart = [];

function renderProducts() {
    const container = document.getElementById('products');
    container.innerHTML = '';
    
    products.forEach(product => {
        const productEl = document.createElement('div');
        productEl.className = 'product-card';
        productEl.innerHTML = `
            <img src="${product.image}" alt="${product.title}">
            <h3>${product.title}</h3>
            <div class="price">${product.price} ₽</div>
            <button class="add-to-cart" data-id="${product.id}">Добавить в корзину</button>
        `;
        container.appendChild(productEl);
    });

    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            addToCart(e.target.dataset.id);
        });
    });
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    updateCart();
    openCart();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

function updateCart() {
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    cartItems.innerHTML = '';
    let total = 0;
    
    cart.forEach(item => {
        const itemEl = document.createElement('div');
        itemEl.className = 'cart-item';
        itemEl.innerHTML = `
            <span>${item.title}</span>
            <span>${item.quantity} x ${item.price} ₽</span>
            <button onclick="removeFromCart('${item.id}')">Удалить</button>
        `;
        cartItems.appendChild(itemEl);
        total += item.quantity * item.price;
    });
    
    cartTotal.textContent = total;
}

function openCart() {
    document.getElementById('cart-modal').style.display = 'block';
}

function closeCart() {
    document.getElementById('cart-modal').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', renderProducts);