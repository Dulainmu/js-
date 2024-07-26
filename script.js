document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navbar = document.querySelector('.navbar');

    hamburger.addEventListener('click', function() {
        navbar.classList.toggle('active');
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', function() {
            const id = this.dataset.id;
            const name = this.dataset.name;
            const price = parseFloat(this.dataset.price);
            const quantityInput = document.querySelector(`.quantity-input[data-id="${id}"]`);
            const quantity = parseInt(quantityInput.value);

            addToCart(id, name, price, quantity);
        });
    });

    function addToCart(id, name, price, quantity) {
        const existingProduct = cart.find(item => item.id === id);
        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            cart.push({ id, name, price, quantity });
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        alert(`${name} added to cart!`);
    }
});

