const products = [
    { id: 'p1', title: 'Ромашки', price: 399.00, image: 'images/cveti1.jpg' },
    { id: 'p2', title: 'Тюльпаны', price: 899.00, image: 'images/cveti2.jpg' },
    { id: 'p3', title: 'Розы', price: 2499.00, image: 'images/cveti3.jpg' }
];

let cart = [];

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCart() {
    const saved = localStorage.getItem('cart');
    if (saved) {
        cart = JSON.parse(saved);
    }
}

function formatPrice(price) {
    return price.toFixed(2);
}

function renderProducts() {
    const container = document.getElementById('products');
    container.innerHTML = '';
    
    products.forEach(product => {
        const article = document.createElement('article');
        article.className = 'product-card';
        article.innerHTML = `
            <img src="${product.image}" alt="${product.title}">
            <header>${product.title}</header>
            <div class="price">${formatPrice(product.price)} ₽</div>
            <button class="btn add-to-cart" data-id="${product.id}">Добавить в корзину</button>
        `;
        container.appendChild(article);
    });
}

function updateCart() {
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    cartCount.textContent = totalQty;
    
    cartItems.innerHTML = '';
    let total = 0;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<li class="cart-empty">Корзина пуста</li>';
    } else {
        cart.forEach(item => {
            const li = document.createElement('li');
            li.className = 'cart-item';
            li.innerHTML = `
                <div class="meta">
                    <div class="title">${item.title}</div>
                    <div class="price-small">${formatPrice(item.price)} ₽</div>
                </div>
                <div class="controls">
                    <input type="number" min="1" value="${item.qty}" data-id="${item.id}">
                    <button class="btn remove-btn" data-id="${item.id}">Удалить</button>
                </div>
            `;
            cartItems.appendChild(li);
            total += item.price * item.qty;
        });
    }
    
    cartTotal.textContent = formatPrice(total);
    saveCart();
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existing = cart.find(item => item.id === productId);
    
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ ...product, qty: 1 });
    }
    
    updateCart();
    openCart();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

function changeQty(productId, newQty) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.qty = parseInt(newQty);
        if (item.qty < 1) {
            removeFromCart(productId);
        } else {
            updateCart();
        }
    }
}

function openCart() {
    document.getElementById('cart-panel').classList.add('open');
}

function closeCart() {
    document.getElementById('cart-panel').classList.remove('open');
}

function init() {
    loadCart();
    renderProducts();
    updateCart();
    
    document.getElementById('open-cart').addEventListener('click', openCart);
    document.getElementById('close-cart').addEventListener('click', closeCart);
    
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart')) {
            addToCart(e.target.dataset.id);
        }
        if (e.target.classList.contains('remove-btn')) {
            removeFromCart(e.target.dataset.id);
        }
    });
    
    document.addEventListener('change', (e) => {
        if (e.target.type === 'number' && e.target.dataset.id) {
            changeQty(e.target.dataset.id, e.target.value);
        }
    });
}

document.addEventListener('DOMContentLoaded', init);