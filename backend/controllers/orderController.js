require('dotenv').config(); // Добавьте эту строку в начале файла
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');
const Cart = require('../models/Cart');

exports.createPaymentIntent = async (req, res) => {
    const { totalAmount } = req.body;

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: totalAmount * 100, // Stripe uses cents
            currency: 'usd',
        });

        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Create an order
exports.createOrder = async (req, res) => {
    const { paymentIntentId, totalAmount, cardNumber } = req.body;
    const userId = req.user.id;

    try {
        const cart = await Cart.findOne({ user: userId }).populate('products.product');
        if (!cart || cart.products.length === 0) {
            return res.status(400).json({ error: 'Cart is empty' });
        }

        const order = new Order({
            user: userId,
            products: cart.products.map((item) => ({
                product: item.product._id,
                quantity: item.quantity,
            })),
            totalAmount,
            paymentIntentId, // Фейковый ID платежа
            cardNumber, // Сохраняем номер карты
            status: 'paid', // Устанавливаем статус "paid"
        });

        await order.save();
        await Cart.findByIdAndDelete(cart._id); // Очистить корзину

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