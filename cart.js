class Cart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('shopease_cart')) || [];
        this.init();
    }

    init() {
        this.cartBtn = document.getElementById('cart-toggle');
        this.closeBtn = document.getElementById('close-cart');
        this.sidebar = document.getElementById('cart-sidebar');
        this.overlay = document.getElementById('cart-overlay');
        this.cartItemsContainer = document.getElementById('cart-items');
        this.cartCount = document.getElementById('cart-count');
        this.cartTotal = document.getElementById('cart-total-price');

        this.cartBtn.addEventListener('click', () => this.openCart());
        this.closeBtn.addEventListener('click', () => this.closeCart());
        this.overlay.addEventListener('click', () => this.closeCart());

        this.renderCart();
    }

    addItem(productId) {
        const product = allProducts.find(p => p.id === productId);
        if (!product) return;

        const existingItem = this.items.find(item => item.id === productId);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            this.items.push({ ...product, quantity: 1 });
        }

        this.saveCart();
        this.renderCart();
        this.openCart();
        showToast('Item added to cart!');
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
        this.renderCart();
    }

    updateQuantity(productId, change) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                this.removeItem(productId);
            } else {
                this.saveCart();
                this.renderCart();
            }
        }
    }

    saveCart() {
        localStorage.setItem('shopease_cart', JSON.stringify(this.items));
        this.updateCount();
    }

    updateCount() {
        const count = this.items.reduce((sum, item) => sum + item.quantity, 0);
        this.cartCount.textContent = count;
    }

    renderCart() {
        this.updateCount();
        
        if (this.items.length === 0) {
            this.cartItemsContainer.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
            this.cartTotal.textContent = '$0.00';
            return;
        }

        this.cartItemsContainer.innerHTML = this.items.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.title}" class="cart-item-img">
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.title}</div>
                    <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                    <div class="cart-item-controls">
                        <button class="qty-btn" onclick="cart.updateQuantity(${item.id}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button class="qty-btn" onclick="cart.updateQuantity(${item.id}, 1)">+</button>
                        <button class="remove-btn" onclick="cart.removeItem(${item.id})">Remove</button>
                    </div>
                </div>
            </div>
        `).join('');

        const total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        this.cartTotal.textContent = `$${total.toFixed(2)}`;
    }

    openCart() {
        this.sidebar.classList.add('open');
        this.overlay.classList.add('open');
    }

    closeCart() {
        this.sidebar.classList.remove('open');
        this.overlay.classList.remove('open');
    }
}

const cart = new Cart();
