// Smart Canteen - Simplified JavaScript (Student Only)
document.addEventListener('DOMContentLoaded', function() {
    console.log('Smart Canteen loaded');
    
    // Initialize cart
    if (!localStorage.getItem('cart')) {
        localStorage.setItem('cart', JSON.stringify([]));
        localStorage.setItem('cartCount', '0');
        localStorage.setItem('orders', JSON.stringify([]));
    }
    
    // Update cart count
    updateCartCount();
    
    // Setup order buttons
    setupOrderButtons();
    
    // Setup checkout button
    setupCheckout();
    
    // Display cart items
    displayCartItems();
});

// Update cart count display
function updateCartCount() {
    const cartCount = localStorage.getItem('cartCount') || '0';
    const cartElements = document.querySelectorAll('.cart-count, .orders-count');
    
    cartElements.forEach(element => {
        element.textContent = cartCount;
    });
    
    // Update cart total
    updateCartTotal();
}

// Setup order buttons
function setupOrderButtons() {
    const orderButtons = document.querySelectorAll('.order-btn');
    orderButtons.forEach(button => {
        button.addEventListener('click', function() {
            const itemName = this.getAttribute('data-item') || 
                           this.closest('.menu-item')?.querySelector('h3')?.textContent || 
                           'Food Item';
            const price = this.getAttribute('data-price') || '0';
            
            addToCart(itemName, price);
        });
    });
}

// Add item to cart
function addToCart(itemName, price) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    
    // Add to cart
    cart.push({
        id: Date.now(),
        name: itemName,
        price: parseInt(price),
        date: new Date().toISOString()
    });
    
    // Add to orders (for admin view)
    orders.push({
        orderId: 'ORD-' + (1000 + orders.length),
        studentName: 'Student',
        items: itemName,
        total: parseInt(price),
        orderTime: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        status: 'pending'
    });
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('cartCount', cart.length.toString());
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Update UI
    updateCartCount();
    displayCartItems();
    
    // Show notification
    showNotification(`"${itemName}" added to cart!`, 'success');
}

// Display cart items
function displayCartItems() {
    const cartContainer = document.getElementById('cart-items');
    if (!cartContainer) return;
    
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <p style="color: var(--gray); text-align: center; padding: 40px;">
                Your cart is empty. Add items from the menu above.
            </p>
        `;
        return;
    }
    
    const itemsHTML = cart.map((item, index) => `
        <div class="cart-item-row" style="display: flex; justify-content: space-between; align-items: center; padding: 15px; border-bottom: 1px solid var(--light-gray);">
            <div>
                <h4 style="margin: 0 0 5px 0;">${item.name}</h4>
                <p style="margin: 0; color: var(--gray); font-size: 0.9rem;">₹${item.price}</p>
            </div>
            <button class="btn btn-secondary remove-item" data-index="${index}" style="padding: 5px 15px; font-size: 0.9rem;">
                <i class="fas fa-trash"></i> Remove
            </button>
        </div>
    `).join('');
    
    cartContainer.innerHTML = itemsHTML + `
        <div style="text-align: right; margin-top: 20px; padding-top: 20px; border-top: 2px solid var(--light-gray);">
            <h3>Total: ₹<span id="cart-total">0</span></h3>
        </div>
    `;
    
    // Add remove button events
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = this.getAttribute('data-index');
            removeFromCart(index);
        });
    });
    
    updateCartTotal();
}

// Update cart total
function updateCartTotal() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const total = cart.reduce((sum, item) => sum + (item.price || 0), 0);
    
    document.querySelectorAll('#cart-total').forEach(el => {
        el.textContent = total;
    });
    
    // Update wallet balance in dashboard
    const walletElement = document.querySelector('.dashboard-card:nth-child(4) .card-content h3');
    if (walletElement) {
        walletElement.textContent = `₹${total}`;
    }
}

// Remove item from cart
function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('cartCount', cart.length.toString());
    
    updateCartCount();
    displayCartItems();
    showNotification('Item removed from cart', 'info');
}

// Setup checkout
function setupCheckout() {
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            
            if (cart.length === 0) {
                showNotification('Your cart is empty! Add items first.', 'warning');
                return;
            }
            
            const total = cart.reduce((sum, item) => sum + (item.price || 0), 0);
            
            if (confirm(`Place order for ₹${total}? (This is a demo - no real payment)`)) {
                // Clear cart
                localStorage.setItem('cart', JSON.stringify([]));
                localStorage.setItem('cartCount', '0');
                
                // Update UI
                updateCartCount();
                displayCartItems();
                
                // Show success message
                showNotification('Order placed successfully! Your food will be prepared.', 'success');
                
                // Update pending orders count
                updatePendingCount();
            }
        });
    }
}

// Update pending orders count
function updatePendingCount() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const pendingCount = orders.filter(order => order.status === 'pending').length;
    const completedCount = orders.filter(order => order.status === 'completed').length;
    
    document.querySelectorAll('.pending-count').forEach(el => {
        el.textContent = pendingCount;
    });
    
    document.querySelectorAll('.completed-count').forEach(el => {
        el.textContent = completedCount;
    });
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 
                          type === 'error' ? 'exclamation-circle' : 
                          type === 'warning' ? 'exclamation-triangle' : 
                          'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out forwards';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Initialize pending count
updatePendingCount();