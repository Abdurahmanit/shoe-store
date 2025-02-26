// Login
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (response.ok) {
        localStorage.setItem('token', data.token);
        window.location.href = '/products';
    } else {
        alert(data.error);
    }
});

// Register
document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();
    if (response.ok) {
        alert('Registration successful! Please login.');
        window.location.href = '/login';
    } else {
        alert(data.error);
    }
});

function toggleFavorite(productId) {
    const favoriteIcon = document.querySelector(`#product-${productId} .favorite-icon`);

    fetch('/api/favorites', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ productId })
    })
        .then(res => res.json())
        .then(data => {
            if (data.favorites.includes(productId)) {
                favoriteIcon.classList.add('favorited');
            } else {
                favoriteIcon.classList.remove('favorited');
            }
        })
        .catch(err => console.error('Error:', err));
}

// Add to Cart
window.addToCart = async (productId) => {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please login to add items to cart.');
        return;
    }

    const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity: 1 }),
    });

    if (response.ok) {
        alert('Product added to cart!');
    } else {
        alert('Failed to add product to cart.');
    }
};

const fetchCartTotal = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch('/api/cart', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    const cart = await response.json();
    return cart.products.reduce((total, item) => total + item.product.price * item.quantity, 0);
};

document.getElementById('checkoutButton')?.addEventListener('click', async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please login to proceed to checkout.');
        return;
    }

    window.location.href = '/api/checkout';
});

document.addEventListener('DOMContentLoaded', () => {
    const nav = document.querySelector('nav');
    const loginLink = nav.querySelector('a[href="/login"]');
    const registerLink = nav.querySelector('a[href="/register"]');
    const profileLink = nav.querySelector('a[href="/profile"]');

    const token = localStorage.getItem('token');

    if (token) {
        loginLink.style.display = 'none';
        registerLink.style.display = 'none';
        profileLink.style.display = 'inline-block';
    } else {
        loginLink.style.display = 'inline-block';
        registerLink.style.display = 'inline-block';
        profileLink.style.display = 'none';
    }
});