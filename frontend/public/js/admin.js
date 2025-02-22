// Fetch and display all products
const fetchProducts = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch('/api/admin/products', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    const products = await response.json();
    const productList = document.getElementById('productList');
    productList.innerHTML = '';

    products.forEach((product) => {
        productList.innerHTML += `
      <div class="product-card">
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <p>$${product.price}</p>
        <p>Stock: ${product.stock}</p>
        <button onclick="editProduct('${product._id}')">Edit</button>
        <button onclick="deleteProduct('${product._id}')">Delete</button>
      </div>
    `;
    });
};

// Add a new product
document.getElementById('addProductForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const product = {
        name: document.getElementById('name').value,
        description: document.getElementById('description').value,
        price: document.getElementById('price').value,
        category: document.getElementById('category').value,
        image: document.getElementById('image').value,
        stock: document.getElementById('stock').value,
    };

    const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(product),
    });

    if (response.ok) {
        alert('Product added successfully!');
        fetchProducts();
    } else {
        alert('Failed to add product.');
    }
});

// Edit a product
window.editProduct = async (productId) => {
    const token = localStorage.getItem('token');
    const newName = prompt('Enter new name:');
    const newPrice = prompt('Enter new price:');
    const newStock = prompt('Enter new stock:');

    if (newName && newPrice && newStock) {
        const response = await fetch(`/api/admin/products/${productId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ name: newName, price: newPrice, stock: newStock }),
        });

        if (response.ok) {
            alert('Product updated successfully!');
            fetchProducts();
        } else {
            alert('Failed to update product.');
        }
    }
};

// Delete a product
window.deleteProduct = async (productId) => {
    const token = localStorage.getItem('token');
    const confirmDelete = confirm('Are you sure you want to delete this product?');
    if (confirmDelete) {
        const response = await fetch(`/api/admin/products/${productId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.ok) {
            alert('Product deleted successfully!');
            fetchProducts();
        } else {
            alert('Failed to delete product.');
        }
    }
};

// Fetch products on page load
fetchProducts();