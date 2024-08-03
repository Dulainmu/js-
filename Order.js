// Function to fetch JSON data
async function fetchJSON(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        console.log(`Data from ${url}:`, data); // Debugging: Log data fetched
        return data;
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

// Fetch product data from JSON files
async function loadProducts() {
    const vegetableData = await fetchJSON('Vegetables.json');
    const dairyData = await fetchJSON('dairy.json');
    const bakingData = await fetchJSON('baking.json');
    const meatData = await fetchJSON('meat.json');
    const fruitData = await fetchJSON('fruits.json');

    return {
        vegetables: vegetableData,
        dairy: dairyData,
        baking: bakingData,
        meat: meatData,
        fruits: fruitData,
    };
}

// Function to populate dropdowns
function populateDropdown(dropdown, items) {
    items.forEach(item => {
        const option = document.createElement('option');
        option.value = item.id;
        option.textContent = `${item.name} - 1kg = Rs ${item.price}`;
        option.dataset.name = item.name;
        option.dataset.price = item.price;
        dropdown.appendChild(option);
    });
}

// Function to initialize the cart system
async function initializeCartSystem() {
    const products = await loadProducts();
    
    if (!products) {
        console.error('No products available.');
        return;
    }

    console.log('Products loaded:', products); // Debugging: Log loaded products

    // Populate dropdowns
    populateDropdown(document.getElementById('vegetable-dropdown'), products.vegetables);
    populateDropdown(document.getElementById('dairy-product-dropdown'), products.dairy);
    populateDropdown(document.getElementById('baking-product-dropdown'), products.baking);
    populateDropdown(document.getElementById('meat-product-dropdown'), products.meat);
    populateDropdown(document.getElementById('fruit-dropdown'), products.fruits);
 
    // Add event listeners for add to cart buttons
    document.getElementById('add-vegetable-to-cart-btn').addEventListener('click', () => addToCart('vegetable-dropdown', 'vegetable-quantity'));
    document.getElementById('add-dairy-to-cart-btn').addEventListener('click', () => addToCart('dairy-product-dropdown', 'dairy-quantity'));
    document.getElementById('add-baking-to-cart-btn').addEventListener('click', () => addToCart('baking-product-dropdown', 'baking-quantity'));
    document.getElementById('add-meat-to-cart-btn').addEventListener('click', () => addToCart('meat-product-dropdown', 'meat-quantity'));
    document.getElementById('add-fruit-to-cart-btn').addEventListener('click', () => addToCart('fruit-dropdown', 'fruit-quantity'));

    // Initialize cart
    updateCart();
}

// Function to add item to cart
function addToCart(dropdownId, quantityId) {
    const dropdown = document.getElementById(dropdownId);
    const quantityInput = document.getElementById(quantityId);
    const selectedItem = dropdown.options[dropdown.selectedIndex];

    if (!selectedItem) {
        console.error('No item selected in dropdown');
        return;
    }

    const itemName = selectedItem.dataset.name;
    const itemPrice = parseFloat(selectedItem.dataset.price);
    const itemQuantity = parseInt(quantityInput.value);

    console.log(`Adding to cart: ${itemName}, Price: ${itemPrice}, Quantity: ${itemQuantity}`);

    // Get cart from localStorage or initialize empty cart
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Check if item already exists in cart
    const existingItem = cart.find(item => item.name === itemName);
    if (existingItem) {
        existingItem.quantity += itemQuantity;
    } else {
        cart.push({ name: itemName, price: itemPrice, quantity: itemQuantity });
    }

    // Save cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Update cart display
    updateCart();
}

// Function to remove item from cart
function removeFromCart(itemName) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.name !== itemName);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart();
}

// Function to update cart display
function updateCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartTableBody = document.querySelector('#cart-table tbody');
    cartTableBody.innerHTML = '';

    let total = 0;

    cart.forEach(item => {
        const row = document.createElement('tr');

        const nameCell = document.createElement('td');
        nameCell.textContent = item.name;
        row.appendChild(nameCell);

        const quantityCell = document.createElement('td');
        quantityCell.textContent = item.quantity;
        row.appendChild(quantityCell);

        const priceCell = document.createElement('td');
        priceCell.textContent = `Rs ${item.price.toFixed(2)}`;
        row.appendChild(priceCell);

        const totalCell = document.createElement('td');
        totalCell.textContent = `Rs ${(item.price * item.quantity).toFixed(2)}`;
        row.appendChild(totalCell);

        const removeCell = document.createElement('td');
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.addEventListener('click', () => removeFromCart(item.name));
        removeCell.appendChild(removeButton);
        row.appendChild(removeCell);

        cartTableBody.appendChild(row);

        total += item.price * item.quantity;
    });

    document.getElementById('cart-total').textContent = `Total: Rs ${total.toFixed(2)}`;
}

// Function to add all items from the cart to favorites
function addToFavorites() {
    const cartTable = document.querySelector('#cart-table tbody');
    const rows = cartTable.querySelectorAll('tr');
    
    // Create favorites list from localStorage or initialize an empty array
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    // Loop through rows and add them to favorites
    rows.forEach(row => {
        const itemName = row.children[0].textContent;
        const itemPrice = parseFloat(row.children[2].textContent.replace('Rs ', ''));
        const itemQuantity = parseInt(row.children[1].textContent);

        // Check if item is already in favorites
        const existingItem = favorites.find(item => item.name === itemName);
        if (!existingItem) {
            favorites.push({ name: itemName, price: itemPrice, quantity: itemQuantity });
        }
    });

    // Save updated favorites to localStorage
    localStorage.setItem('favorites', JSON.stringify(favorites));

    alert('All items added to favorites!');
}

// Function to display favorites in the table
function showFavorites() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const favoritesTableBody = document.querySelector('#favorites-table tbody');
    favoritesTableBody.innerHTML = '';

    let total = 0;

    favorites.forEach(item => {
        const row = document.createElement('tr');

        const nameCell = document.createElement('td');
        nameCell.textContent = item.name;
        row.appendChild(nameCell);

        const quantityCell = document.createElement('td');
        quantityCell.textContent = item.quantity;
        row.appendChild(quantityCell);

        const priceCell = document.createElement('td');
        priceCell.textContent = `Rs ${item.price.toFixed(2)}`;
        row.appendChild(priceCell);

        const totalCell = document.createElement('td');
        totalCell.textContent = `Rs ${(item.price * item.quantity).toFixed(2)}`;
        row.appendChild(totalCell);

        favoritesTableBody.appendChild(row);

        total += item.price * item.quantity;
    });

    document.getElementById('favorites-total').textContent = `Total: Rs ${total.toFixed(2)}`;
}

// Function to clear favorites
function hideFavorites() {
    // Clear favorites from localStorage
    localStorage.removeItem('favorites');

    // Update favorites display
    const favoritesTableBody = document.querySelector('#favorites-table tbody');
    favoritesTableBody.innerHTML = '';
    document.getElementById('favorites-total').textContent = 'Total: Rs 0.00';

    alert('Favorites cleared!');
}

// Initialize the cart system on page load
document.addEventListener('DOMContentLoaded', initializeCartSystem);

// Event listeners for buttons
document.getElementById('add-to-favorites-btn').addEventListener('click', addToFavorites);
document.getElementById('show-favorites-btn').addEventListener('click', showFavorites);
document.getElementById('hide-favorites-btn').addEventListener('click', hideFavorites);
