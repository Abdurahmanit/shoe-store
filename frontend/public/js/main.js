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
            productsDiv.innerHTML = ''; // Очистим перед вставкой

            products.forEach((product) => {
                const imagePath = `/images/${product.image}`; // Путь к картинке
                const categories = Array.isArray(product.category) ? product.category.join(', ') : product.category;

                productsDiv.innerHTML += `
                    <div class="product" id="product-${product._id}">
                        <img src="${imagePath}" alt="${product.name}" class="product-image">
                        <h3>${product.name}</h3>
                        <p>${product.description}</p>
                        <p>Categories: <strong>${categories}</strong></p>
                        <p>$${product.price}</p>
                        <button onclick="addToCart('${product._id}')">Add to Cart</button>
                        <span class="favorite-icon" onclick="toggleFavorite('${product._id}')">⭐</span>
                    </div>
                `;
            });
        })
        .catch((err) => console.error("Error fetching products:", err));
}

// Функция для добавления/удаления из избранного
function toggleFavorite(productId) {
    const favoriteIcon = document.querySelector(`#product-${productId} .favorite-icon`);

    fetch('/api/favorites', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}` // Используем токен авторизации
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

    // Перенаправляем на страницу оформления заказа
    window.location.href = '/api/checkout';
});