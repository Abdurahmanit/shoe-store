const paymentForm = document.getElementById('payment-form');
const submitButton = document.getElementById('submit-button');

// Обработка отправки формы
paymentForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    submitButton.disabled = true;

    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please login to proceed to checkout.');
        return;
    }

    const cardNumber = document.getElementById('card-number').value;
    if (!cardNumber || cardNumber.trim() === '') {
        alert('Please enter a card number.');
        submitButton.disabled = false;
        return;
    }

    try {
        // Получить общую сумму заказа
        const totalAmount = await fetchCartTotal();

        // Создать заказ (фейковый платеж)
        const response = await fetch('/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                paymentIntentId: 'fake_payment_intent_id', // Фейковый ID платежа
                totalAmount,
                cardNumber, // Добавляем номер карты в заказ
            }),
        });

        if (response.ok) {
            const order = await response.json();
            alert('Payment successful! Your order has been placed.');
            generateReceipt(order); // Генерация чека
            window.location.href = '/products';
        } else {
            alert('Failed to place order.');
        }
    } catch (err) {
        console.error('Error placing order:', err);
        alert('An error occurred. Please try again.');
    } finally {
        submitButton.disabled = false;
    }
});

// Функция для получения общей суммы заказа из корзины
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

// Функция для генерации чека
const generateReceipt = (order) => {
    const receiptContent = `
    Order ID: ${order._id}
    Date: ${new Date(order.createdAt).toLocaleString()}
    Card Number: ${order.cardNumber}
    Total Amount: $${order.totalAmount.toFixed(2)}
    Products:
    ${order.products.map((item) => `
      - ${item.product.name}: $${item.product.price} x ${item.quantity}
    `).join('')}
  `;

    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt_${order._id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
};