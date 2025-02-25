document.addEventListener('DOMContentLoaded', () => {
    const productsDiv = document.getElementById('products');
    const checkboxes = document.querySelectorAll('input[name="category"]');
    const allCheckbox = document.querySelector('input[value="all"]');

    let allProducts = [];

    function fetchProducts() {
        fetch('/api/products')
            .then(res => res.json())
            .then(products => {
                allProducts = products;
                renderProducts();
            })
            .catch(err => console.error("Error fetching products:", err));
    }

    function renderProducts() {
        productsDiv.innerHTML = '';

        const selectedCategories = Array.from(checkboxes)
            .filter(checkbox => checkbox.checked && checkbox.value !== "all")
            .map(checkbox => checkbox.value.toLowerCase());

        const filteredProducts = selectedCategories.length
            ? allProducts.filter(product =>
                selectedCategories.some(category =>
                    product.category.some(cat => cat.toLowerCase() === category)
                )
            )
            : allProducts;

        if (filteredProducts.length === 0) {
            productsDiv.innerHTML = `<p class="no-products">No products found</p>`;
        } else {
            filteredProducts.forEach(product => {
                const imagePath = `/images/${product.image}`;
                const categories = product.category.join(', ');

                productsDiv.innerHTML += `
                    <div class="product-card" id="product-${product._id}">
                        <img src="${imagePath}" alt="${product.name}" class="product-image">
                        <h3>${product.name}</h3>
                        <p>${product.description}</p>
                        <p>Categories: <strong>${categories}</strong></p>
                        <p>$${product.price}</p>
                        <button class="button" onclick="addToCart('${product._id}')">Add to Cart</button>
                        <span class="favorite-icon" onclick="toggleFavorite('${product._id}')">⭐️</span>
                    </div>
                `;
            });
        }
    }

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            if (checkbox.value === "all") {
                if (checkbox.checked) {
                    checkboxes.forEach(cb => cb.checked = false);
                    checkbox.checked = true;
                }
            } else {
                allCheckbox.checked = false;
            }

            renderProducts();
        });
    });

    fetchProducts();
});