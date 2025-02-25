document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please login to view your profile.');
        window.location.href = '/login';
        return;
    }

    try {
        // Получение данных пользователя
        const userResponse = await fetch('/api/profile', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const user = await userResponse.json();
        if (user) {
            document.getElementById('username').value = user.username;
            document.getElementById('email').value = user.email;
        }

        // Получение заказов
        const ordersResponse = await fetch('/api/orders', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const orders = await ordersResponse.json();

        const ordersDiv = document.getElementById('orders');
        if (orders.length === 0) {
            ordersDiv.innerHTML = '<p>You have no orders yet.</p>';
            return;
        }

        ordersDiv.innerHTML = orders
            .map(
                (order) => `
        <div class="order-card">
          <h3>Order ID: ${order._id}</h3>
          <p>Date: ${new Date(order.createdAt).toLocaleString()}</p>
          <p>Status: <span class="status ${order.status}">${order.status}</span></p>
          <p>Total Amount: $${order.totalAmount.toFixed(2)}</p>
        </div>
      `
            )
            .join('');
    } catch (err) {
        console.error('Error fetching profile:', err);
        alert('Failed to load profile.');
    }

    document.getElementById('editProfileForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;

        try {
            const response = await fetch('/api/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ username, email }),
            });

            const data = await response.json();
            if (response.ok) {
                alert('Profile updated successfully!');
            } else {
                alert(`Error: ${data.error}`);
            }
        } catch (err) {
            console.error('Error updating profile:', err);
            alert('Failed to update profile.');
        }
    });
});
