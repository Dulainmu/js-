document.addEventListener('DOMContentLoaded', () => {
    fetch('products.json')
        .then(response => response.json())
        .then(data => {
            const productDropdowns = document.getElementById('product-dropdowns');
            data.categories.forEach(category => {
                const categoryDiv = document.createElement('div');
                categoryDiv.className = 'category-dropdown';
                categoryDiv.innerHTML = `
                    <label for="${category.name}-dropdown">${category.name}</label>
                    <select id="${category.name}-dropdown" class="product-dropdown">
                        <option value="" disabled selected>Select a product</option>
                    </select>
                    <div id="${category.name}-details" class="product-details"></div>
                `;
                productDropdowns.appendChild(categoryDiv);

                const dropdown = document.getElementById(`${category.name}-dropdown`);
                const detailsDiv = document.getElementById(`${category.name}-details`);

                category.products.forEach(product => {
                    const option = document.createElement('option');
                    option.value = product.productid;
                    option.text = product.name;
                    dropdown.appendChild(option);
                });

                dropdown.addEventListener('change', (event) => {
                    const selectedProduct = category.products.find(product => product.productid == event.target.value);
                    detailsDiv.innerHTML = `
                        <img src="${selectedProduct.image}" alt="${selectedProduct.name}" class="product-image">
                        <p class="price">Rs ${selectedProduct.price}</p>
                        <p>${selectedProduct.Description}</p>
                        <button class="add-to-cart-btn" data-productid="${selectedProduct.productid}">Add to Cart</button>
                    `;

                    detailsDiv.querySelector('.add-to-cart-btn').addEventListener('click', () => {
                        addToCart(selectedProduct);
                    });
                });
            });
        })
        .catch(error => console.error('Error fetching data:', error));
});

function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let existingProduct = cart.find(item => item.productid === product.productid);

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        product.quantity = 1; // Adding initial quantity as 1
        cart.push(product);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${product.name} has been added to your cart!`);
}
