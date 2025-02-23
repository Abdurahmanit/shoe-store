document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please login to view your cart.');
        window.location.href = '/login';
        return;
    }

    try {
        const response = await fetch('/api/cart', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const cart = await response.json();

        const cartDiv = document.getElementById('cart');
        if (cart.products.length === 0) {
            cartDiv.innerHTML = '<p>Your cart is empty.</p>';
            return;
        }

        cartDiv.innerHTML = cart.products
            .map(
                (item) => `
        <div class="cart-item">
          <h3>${item.product.name}</h3>
          <p>${item.product.description}</p>
          <p>$${item.product.price}</p>
          <p>Quantity: ${item.quantity}</p>
          <button onclick="removeFromCart('${item.product._id}')">Remove</button>
        </div>
      `
            )
            .join('');
    } catch (err) {
        console.error('Error fetching cart:', err);
        alert('Failed to load cart.');
    }
});

// Remove from Cart
window.removeFromCart = async (productId) => {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please login to remove items from cart.');
        return;
    }

    const response = await fetch('/api/cart', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId }),
    });

    if (response.ok) {
        alert('Product removed from cart!');
        window.location.reload(); // Обновляем страницу
    } else {
        alert('Failed to remove product from cart.');
    }
};