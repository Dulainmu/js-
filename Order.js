// Fetch product data and populate the product list
fetch('products.json')
  .then(response => response.json())
  .then(data => {
    const categoryName = document.getElementById('category').innerText.trim();
    const categoryData = data.categories.find(category => category.name === categoryName);
    const productsList = categoryData.products;

    const productContainer = document.getElementById('product-list');

    productsList.forEach(product => {
      const productItem = document.createElement('div');
      productItem.className = 'products';
      productItem.innerHTML = `
        <div class="cardvg">
          <h2>${product.name}</h2>
          <img src="${product.image}" alt="${product.name}" class="daily_product_h_w"><br>
          <p class="price">Rs ${product.price}/1Kg</p><br>
          <p class="title">${product.Description}<br><br>
          Available Quantity: ${product.quantity}</p><br>
          <input id="${product.productid}" class="add-to-cart-btn" type="button" value="  Add to Cart  " />
        </div>
      `;
      productContainer.appendChild(productItem); 

      // Add to Cart functionality
      productItem.querySelector('.add-to-cart-btn').addEventListener('click', () => {
        addToCart(product);
      });
    });
  })
  .catch(error => console.error('Error fetching data:', error));

// Function to add product to cart and store in localStorage
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


