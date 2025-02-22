const Order = require('../models/Order');
const Cart = require('../models/Cart');

// Create an order
exports.createOrder = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id }).populate('products.product');
        if (!cart || cart.products.length === 0) return res.status(400).json({ error: 'Cart is empty' });

        const totalAmount = cart.products.reduce((total, item) => total + item.product.price * item.quantity, 0);

        const order = new Order({
            user: req.user.id,
            products: cart.products.map((item) => ({
                product: item.product._id,
                quantity: item.quantity,
            })),
            totalAmount,
        });

        await order.save();
        await Cart.findByIdAndDelete(cart._id); // Clear the cart after order is placed
        res.status(201).json(order);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get user's orders
exports.getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id }).populate('products.product');
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all orders (Admin only)
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('products.product').populate('user', 'username email');
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};