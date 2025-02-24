# Shoe Store Web Application

The Shoe Store is a web application built for selling shoes online. It includes features like user authentication, product browsing, cart management, and a fake checkout system for simulating payments.

## Features

### User Authentication:
- User registration and login using JWT (JSON Web Tokens).
- Role-based access control (user and admin).

### Product Management:
- Browse and filter products.
- Add, update, and delete products (admin only).

### Cart Management:
- Add products to the cart.
- Remove products from the cart.
- View the cart with the total amount.

### Fake Checkout System:
- Simulate payment by entering a fake card number.
- Generate and download a receipt after a successful "payment".

### Order Management:
- View order history.
- Admin panel to manage all orders.

## Technologies Used

### Backend:
- Node.js with Express framework.
- MongoDB (with Mongoose) for database management.
- JWT for user authentication.
- Stripe (fake integration for simulating payments).

### Frontend:
- EJS for server-side rendering.
- CSS for styling.
- JavaScript for interactivity.

## Project Structure

```
/shoe-store
│── /backend
│   ├── /controllers
│   ├── /models
│   ├── /routes
│   ├── /middlewares
│   ├── /database
│── /frontend
│   ├── /public
│   │   ├── /css
│   │   ├── /js
│   ├── /views
│── server.js
│── package.json
│── .env
│── README.md
```

## Usage

### User Flow:
1. Register or Login to access the application.
2. Browse products on the Products page.
3. Add products to the Cart.
4. Proceed to Checkout and enter a fake card number (e.g., 4242 4242 4242 4242).
5. Download the receipt after a successful "payment".

### Admin Flow:
1. Log in as an admin to access the Admin Panel.
2. Add, update, or delete products.
3. View and manage all orders.

## Contributing

Contributions are welcome! If you'd like to contribute, please follow these steps:
1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Commit your changes and push to the branch.
4. Submit a pull request.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

