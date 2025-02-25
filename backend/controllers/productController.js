const Product = require('../models/Product');

// Get all products
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Create a new product (Admin only)
exports.createProduct = async (req, res) => {
    const { name, description, price, category, image, stock } = req.body;
    try {
        const product = new Product({
            name,
            description,
            price,
            category: Array.isArray(category) ? category : [category], // Преобразуем в массив
            image,
            stock
        });
        await product.save();
        res.status(201).json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get a single product by ID
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ error: 'Product not found' });
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update a product (Admin only)
exports.updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, description, price, category, image, stock } = req.body;
    try {
        const product = await Product.findByIdAndUpdate(
            id,
            {
                name,
                description,
                price,
                category: Array.isArray(category) ? category : [category], // Преобразуем в массив
                image,
                stock
            },
            { new: true }
        );
        if (!product) return res.status(404).json({ error: 'Product not found' });
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete a product (Admin only)
exports.deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findByIdAndDelete(id);
        if (!product) return res.status(404).json({ error: 'Product not found' });
        res.json({ message: 'Product deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};