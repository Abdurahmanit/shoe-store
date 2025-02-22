const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const routes = require('./backend/routes/routes');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the frontend/public directory
app.use(express.static(path.join(__dirname, 'frontend/public')));

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'frontend/views'));

// Database connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api', routes);

// Frontend Routes
app.get('/', (req, res) => res.render('index'));
app.get('/login', (req, res) => res.render('login'));
app.get('/register', (req, res) => res.render('register'));
app.get('/products', (req, res) => res.render('products'));
app.get('/products/:id', (req, res) => res.render('product-details'));
app.get('/cart', (req, res) => res.render('cart'));
app.get('/orders', (req, res) => res.render('orders'));
app.get('/profile', (req, res) => res.render('profile'));
app.get('/admin', (req, res) => res.render('admin'));

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});