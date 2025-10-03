const products = [
    { id: 'p1', title: 'Ромашки', price: 399.00, image: 'WEB1/images/cveti1.jpg' },
    { id: 'p2', title: 'Тюльпаны', price: 899.00, image: 'WEB1/images/cveti2.jpg' },
    { id: 'p3', title: 'Розы', price: 2499.00, image: 'WEB1/images/cveti3.jpg' },
    { id: 'p4', title: 'Цветочек - смехаточек', price: 228.00, image: 'WEB1/images/cveti4.png' }
];

let cart = [];

const el = {
    products: document.getElementById('products'),
    cartCount: document.getElementById('cart-count'),
    openCartBtn: document.getElementById('open-cart'),
    cartPanel: document.getElementById('cart-panel'),
    closeCartBtn: document.getElementById('close-cart'),
    cartItems: document.getElementById('cart-items'),
    cartTotal: document.getElementById('cart-total'),
    checkoutBtn: document.getElementById('checkout-btn'),
    checkoutModal: document.getElementById('checkout-modal'),
    closeModalBtn: document.getElementById('close-modal'),
    checkoutForm: document.getElementById('checkout-form'),
    orderMessage: document.getElementById('order-message')
};

function formatPrice(num) { 
    return num.toFixed(2).replace('.', ',') + ' ₽';
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCart() {
    try {
        const raw = localStorage.getItem('cart');
        cart = raw ? JSON.parse(raw) : [];
    } catch (e) {
        cart = [];
    }
}

function renderProducts() {
    el.products.innerHTML = '';
    products.forEach(p => {
        const article = document.createElement('article');
        article.className = 'product-card';
        article.innerHTML = `
      <img src="${p.image}" alt="${p.title}">
      <header>${p.title}</header>
      <div class="price">${formatPrice(p.price)}</div>
      <button class="btn add-to-cart" data-id="${p.id}">Добавить в корзину</button>
    `;
        el.products.appendChild(article);
    });
}

function updateCartCount() {
    const totalQty = cart.reduce((s, i) => s + i.qty, 0);
    el.cartCount.textContent = totalQty;
}

function calculateTotal() {
    return cart.reduce((s, i) => s + (i.price * i.qty), 0);
}

function renderCart() {
    el.cartItems.innerHTML = '';
    if (cart.length === 0) {
        el.cartItems.innerHTML = '<li class="cart-empty">Корзина пуста</li>';
    } else {
        cart.forEach(item => {
            const li = document.createElement('li');
            li.className = 'cart-item';
            li.dataset.id = item.id;
            li.innerHTML = `
        <div class="meta">
          <div class="title">${item.title}</div>
          <div class="price-small">${formatPrice(item.price)}</div>
        </div>
        <div class="controls">
          <div class="quantity-controls">
            <button class="qty-btn minus" data-id="${item.id}" aria-label="Уменьшить количество ${item.title}">-</button>
            <span class="quantity-display">${item.qty}</span>
            <button class="qty-btn plus" data-id="${item.id}" aria-label="Увеличить количество ${item.title}">+</button>
          </div>
          <button class="btn remove-btn" data-id="${item.id}" aria-label="Удалить ${item.title}">Удалить</button>
        </div>
      `;
            el.cartItems.appendChild(li);
        });
    }
    el.cartTotal.textContent = formatPrice(calculateTotal());
    updateCartCount();
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    const existing = cart.find(i => i.id === productId);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ id: product.id, title: product.title, price: product.price, qty: 1 });
    }
    saveCart();
    renderCart();
    openCart();
}

function removeFromCart(productId) {
    cart = cart.filter(i => i.id !== productId);
    saveCart();
    renderCart();
}

function changeQty(productId, newQty) {
    const item = cart.find(i => i.id === productId);
    if (!item) return;
    
    const v = parseInt(newQty, 10);
    if (isNaN(v) || v < 1) {
        removeFromCart(productId);
    } else {
        item.qty = v;
        saveCart();
        renderCart();
    }
}

function openCart() {
    el.cartPanel.classList.add('open');
    el.cartPanel.setAttribute('aria-hidden', 'false');
}
function closeCart() {
    el.cartPanel.classList.remove('open');
    el.cartPanel.setAttribute('aria-hidden', 'true');
}
function openModal() {
    el.checkoutModal.setAttribute('aria-hidden', 'false');
}
function closeModal() {
    el.checkoutModal.setAttribute('aria-hidden', 'true');
    el.orderMessage.textContent = '';
    el.checkoutForm.reset();
}

function init() {
    loadCart();
    renderProducts();
    renderCart();

    el.products.addEventListener('click', ev => {
        const btn = ev.target.closest('.add-to-cart');
        if (!btn) return;
        const id = btn.dataset.id;
        addToCart(id);
    });

    el.openCartBtn.addEventListener('click', openCart);
    el.closeCartBtn.addEventListener('click', closeCart);

    el.cartItems.addEventListener('click', ev => {
        ev.stopPropagation();
        
        const removeBtn = ev.target.closest('.remove-btn');
        if (removeBtn) {
            const id = removeBtn.dataset.id;
            removeFromCart(id);
        }
        
        const plusBtn = ev.target.closest('.qty-btn.plus');
        const minusBtn = ev.target.closest('.qty-btn.minus');
        
        if (plusBtn) {
            const id = plusBtn.dataset.id;
            const item = cart.find(i => i.id === id);
            if (item) {
                changeQty(id, item.qty + 1);
            }
        }
        
        if (minusBtn) {
            const id = minusBtn.dataset.id;
            const item = cart.find(i => i.id === id);
            if (item && item.qty > 1) {
                changeQty(id, item.qty - 1);
            }
        }
    });

    el.checkoutBtn.addEventListener('click', () => {
        closeCart();
        openModal();
    });

    el.closeModalBtn.addEventListener('click', closeModal);

    el.checkoutForm.addEventListener('submit', ev => {
        ev.preventDefault();
        if (!el.checkoutForm.checkValidity()) {
            el.orderMessage.textContent = 'Пожалуйста, заполните все поля корректно.';
            el.orderMessage.style.color = 'crimson';
            return;
        }
        if (cart.length === 0) {
            el.orderMessage.textContent = 'Корзина пуста.';
            el.orderMessage.style.color = 'crimson';
            return;
        }
        el.orderMessage.textContent = 'Заказ создан!';
        el.orderMessage.style.color = 'green';
        cart = [];
        saveCart();
        renderCart();
        setTimeout(() => {
            closeModal();
        }, 1400);
    });
}

document.addEventListener('DOMContentLoaded', init);