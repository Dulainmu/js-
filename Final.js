// Function to load only product name, quantity, and total price
function loadSimpleCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartTableBody = document.querySelector('#cart-table tbody');
    const cartTotalElement = document.getElementById('cart-total');
    let totalAmount = 0;

    cartTableBody.innerHTML = ''; // Clear the table first

    cart.forEach((product) => {
        const totalPrice = product.price * product.quantity;
        totalAmount += totalPrice;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.name}</td>
            <td>${product.quantity}</td>
            <td class="item-total">Rs ${totalPrice.toFixed(2)}</td>
        `;
        cartTableBody.appendChild(row);
    });

    cartTotalElement.textContent = `Total: Rs ${totalAmount.toFixed(2)}`;
}

// Function to auto-reload the cart every 1 second
function autoReloadCart() {
    setInterval(loadSimpleCart, 1000);
}

// Call the function when the page loads and start auto-reloading
document.addEventListener('DOMContentLoaded', () => {
    loadSimpleCart();
    autoReloadCart();
});
