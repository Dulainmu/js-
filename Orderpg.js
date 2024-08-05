// Function to load cart items from localStorage and populate the cart table
function loadCart() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const cartTableBody = document.querySelector('#cart-table tbody');
  const cartTotalElement = document.getElementById('cart-total');
  let totalAmount = 0;

  cartTableBody.innerHTML = ''; // Clear the table first

  cart.forEach((product, index) => {
      const totalPrice = product.price * product.quantity;
      totalAmount += totalPrice;

      const row = document.createElement('tr');
      row.innerHTML = `
          <td>${product.name}</td>
          <td><input type="number" value="${product.quantity}" min="1" class="quantity-input" data-index="${index}"></td>
          <td>Rs ${product.price}</td>
          <td class="item-total">Rs ${totalPrice.toFixed(2)}</td>
          <td><button class="remove-btn" data-index="${index}">Remove</button></td>
      `;
      cartTableBody.appendChild(row);
  });

  cartTotalElement.textContent = `Total: Rs ${totalAmount.toFixed(2)}`;

  // Add event listeners to remove buttons
  document.querySelectorAll('.remove-btn').forEach(button => {
      button.addEventListener('click', () => {
          removeFromCart(button.dataset.index);
      });
  });

  // Add event listeners to quantity inputs
  addQuantityChangeListeners();
}

// Function to remove a product from the cart
function removeFromCart(index) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  loadCart(); // Reload the cart after removal
}

// Function to handle changes in quantity inputs
function addQuantityChangeListeners() {
  const quantityInputs = document.querySelectorAll('.quantity-input');

  quantityInputs.forEach(input => {
      input.addEventListener('change', function() {
          if (this.value < 1) {
              this.value = 1;
          }
          updateQuantity(this.dataset.index, this.value);
      });
  });
}

// Function to update the quantity of a product in the cart
function updateQuantity(index, quantity) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart[index].quantity = parseInt(quantity);
  localStorage.setItem('cart', JSON.stringify(cart));
  loadCart(); // Reload the cart to reflect the changes
}

// Function to save the current cart as a favorite
function saveFavorite() {
  const cartItems = [];

  // Get all the rows from the cart table
  const cartRows = document.querySelectorAll('#cart-table tbody tr');

  cartRows.forEach(row => {
      const productName = row.querySelector('td:nth-child(1)').innerText;
      const quantityInput = row.querySelector('td:nth-child(2) input');
      const productQuantity = quantityInput ? quantityInput.value : row.querySelector('td:nth-child(2)').innerText;
      const productPrice = row.querySelector('td:nth-child(3)').innerText.replace('Rs ', '');
      const productTotal = row.querySelector('td:nth-child(4)').innerText.replace('Rs ', '');

      cartItems.push({
          name: productName,
          quantity: parseInt(productQuantity),
          price: parseFloat(productPrice),
          total: parseFloat(productTotal)
      });
  });

  // Save the cart items to local storage as the favorite
  localStorage.setItem('favoriteCart', JSON.stringify(cartItems));
  alert('Cart saved as favorite!');
}

// Function to apply the favorite cart to the current cart
function applyFavorite() {
  const favoriteCart = localStorage.getItem('favoriteCart');

  if (favoriteCart) {
      const cartItems = JSON.parse(favoriteCart);

      const cartTableBody = document.querySelector('#cart-table tbody');
      cartTableBody.innerHTML = ''; // Clear the current cart

      cartItems.forEach(item => {
          const row = document.createElement('tr');

          row.innerHTML = `
              <td>${item.name}</td>
              <td><input type="number" value="${item.quantity}" min="1" class="quantity-input"></td>
              <td>Rs ${item.price}</td>
              <td class="item-total">Rs ${item.total}</td>
              <td><button class="remove-btn">Remove</button></td>
          `;

          cartTableBody.appendChild(row);
      });

      updateCartTotal();
      addQuantityChangeListeners();
  } else {
      alert('No favorite cart found!');
  }
}

// Function to clear all items in the cart and remove the favorite from local storage
function clearCart() {
  // Clear the cart table
  const cartTableBody = document.querySelector('#cart-table tbody');
  cartTableBody.innerHTML = '';

  // Clear the total price
  updateCartTotal();

  // Remove the saved favorite from local storage
  localStorage.removeItem('favoriteCart');

  alert('Cart and saved favorite have been cleared!');
}

// Function to update the total price of the cart
function updateCartTotal() {
  let total = 0;

  const cartRows = document.querySelectorAll('#cart-table tbody tr');

  cartRows.forEach(row => {
      const productQuantity = row.querySelector('td:nth-child(2) input').value;
      const productPrice = parseFloat(row.querySelector('td:nth-child(3)').innerText.replace('Rs ', ''));
      const productTotal = productQuantity * productPrice;

      row.querySelector('.item-total').innerText = `Rs ${productTotal.toFixed(2)}`;
      total += productTotal;
  });

  document.getElementById('cart-total').innerText = `Total: Rs ${total.toFixed(2)}`;
}

// Function to auto-reload the cart every 1 second
function autoReloadCart() {
  setInterval(loadCart, 1000);
}

// Event listeners for the buttons
document.getElementById('save-favorite-btn').addEventListener('click', saveFavorite);
document.getElementById('apply-favorite-btn').addEventListener('click', applyFavorite);
document.getElementById('clear-cart-btn').addEventListener('click', clearCart);

// Initial load of cart and start auto-reloading
document.addEventListener('DOMContentLoaded', () => {
  loadCart();
  autoReloadCart();
});

