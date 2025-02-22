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

// Fetch and display products
if (window.location.pathname === '/products') {
    fetch('/api/products')
        .then((res) => res.json())
        .then((products) => {
            const productsDiv = document.getElementById('products');
            products.forEach((product) => {
                productsDiv.innerHTML += `
          <div class="product">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <p>$${product.price}</p>
            <button onclick="addToCart('${product._id}')">Add to Cart</button>
          </div>
        `;
            });
        });
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