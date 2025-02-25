document.addEventListener('DOMContentLoaded', () => {
    displayCart();
});

async function displayCart() {
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
        cartDiv.innerHTML = '';

        if (cart.products.length === 0) {
            cartDiv.innerHTML = '<p>Your cart is empty.</p>';
            document.getElementById('total-amount').textContent = '$0.00';
            return;
        }

        let cartHTML = '';
        cart.products.forEach(item => {
            cartHTML += `
                <div class="cart-item">
                    <img src="/images/${item.product.image}" alt="${item.product.name}">
                    <div class="cart-item-details">
                        <h3>${item.product.name}</h3>
                        <p>${item.product.description}</p>
                        <p class="cart-item-price">$${item.product.price}</p>
                        <div class="cart-item-quantity">
                            <button class='button-decrement' data-product-id="${item.product._id}">-</button>
                            <span>${item.quantity}</span>
                            <button class='button-increment' data-product-id="${item.product._id}">+</button>
                        </div>
                        <button class="remove-button" data-product-id="${item.product._id}">Remove</button>
                    </div>
                </div>
            `;
        });

      cartDiv.innerHTML = cartHTML;
      attachCartItemEventListeners();
      updateTotal();

    } catch (err) {
        console.error('Error fetching cart:', err);
        alert('Failed to load cart.');
    }
}

async function updateTotal() {
    const total = await fetchCartTotal();
    document.getElementById('total-amount').textContent = `$${total.toFixed(2)}`;
}
function attachCartItemEventListeners() {
    document.querySelectorAll('.button-increment').forEach(button => {
        button.addEventListener('click', async (event) => {
            const productId = event.target.dataset.productId;
            await changeQuantity(productId, 1);
             displayCart();
        });
    });

    document.querySelectorAll('.button-decrement').forEach(button => {
        button.addEventListener('click', async (event) => {
            const productId = event.target.dataset.productId;
             await changeQuantity(productId, -1);
            displayCart();
        });
    });
     document.querySelectorAll('.remove-button').forEach(button => {
        button.addEventListener('click', async (event) => {
          const productId = event.target.dataset.productId;
          await removeFromCart(productId);
          displayCart();
        });
    });
}
async function changeQuantity(productId, change) {
    const token = localStorage.getItem('token');

    const response = await fetch('/api/cart', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity: change }),
    });
    if(!response.ok){
       alert('Failed to change quantity.');
    }
}

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

    if (!response.ok) {
        alert('Failed to remove product from cart.');
    }
};