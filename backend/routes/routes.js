const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const productController = require('../controllers/productController');
const cartController = require('../controllers/cartController');
const orderController = require('../controllers/orderController');
const userController = require('../controllers/userController');
const { authenticate, isAdmin } = require('../middlewares/authMiddleware');

// Auth routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Product routes
router.get('/products', productController.getAllProducts);
router.get('/products/:id', productController.getProductById);
router.post('/products', authenticate, isAdmin, productController.createProduct);
router.put('/products/:id', authenticate, isAdmin, productController.updateProduct);
router.delete('/products/:id', authenticate, isAdmin, productController.deleteProduct);

// Cart routes
router.get('/cart', authenticate, cartController.getCart);
router.post('/cart', authenticate, cartController.addToCart);
router.delete('/cart', authenticate, cartController.removeFromCart);

// Order routes
router.post('/orders', authenticate, orderController.createOrder);
router.get('/orders', authenticate, orderController.getUserOrders);
router.get('/admin/orders', authenticate, isAdmin, orderController.getAllOrders);
router.post('/orders/create-payment-intent', authenticate, orderController.createPaymentIntent);

// User routes
router.get('/profile', authenticate, userController.getUserProfile);
router.put('/profile', authenticate, userController.updateUserProfile);
router.delete('/profile', authenticate, userController.deleteUserAccount);
router.post('/favorites', authenticate, userController.addToFavorites);
router.get('/favorites', authenticate, userController.getFavorites);

// Admin 
router.get('/admin/products', authenticate, isAdmin, productController.getAllProducts);
router.post('/admin/products', authenticate, isAdmin, productController.createProduct);
router.put('/admin/products/:id', authenticate, isAdmin, productController.updateProduct);
router.delete('/admin/products/:id', authenticate, isAdmin, productController.deleteProduct);

router.get('/checkout', (req, res) => {res.render('checkout');});

module.exports = router;