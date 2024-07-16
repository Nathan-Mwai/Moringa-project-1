// Function to create product cards and manage cart interactions
function addsProducts(product) {
    // Create a card container for each product
    const card = document.createElement('div');
    card.classList.add('product-card'); // Add a class for styling
  
    // HTML template for the product card
    card.innerHTML = `
      <div id="${product.id}" class="product">
        <img src="${product.images}" alt="${product.name} Image">
        <h3 class="title">${product.name}</h3>
        <p class="quantity"><i>Quantity:</i> <strong>${product.quantity}</strong></p>
        <p class="price"><i>Price:</i> <strong>$${product.price}</strong></p>
        <button class="add-to-cart">Add To Cart</button>
      </div>
    `;
  
    // Add event listener to the 'Add to Cart' button
    const addToCartBtn = card.querySelector('.add-to-cart');
    addToCartBtn.addEventListener('click', () => {
      addItemToCart(product);
      updateCartDisplay();
      alert(`${product.name} added to cart`);
    });
  
    // Add mouseover event listener to the product card
    card.addEventListener('mouseover', () => {
      card.style.backgroundColor = '#f0f0f0'; // Example: Change background color on mouseover
    });
  
    // Add mouseout event listener to the product card
    card.addEventListener('mouseout', () => {
      card.style.backgroundColor = ''; // Example: Restore background color on mouseout
    });
  
    // Append the product card to the 'items' container
    document.getElementById("items").appendChild(card);
  }
  
  // Function to fetch products from the server
  function getAllItems() {
    fetch('http://localhost:3000/products')
      .then((res) => res.json())
      .then(products => products.forEach(product => addsProducts(product)))
      .catch(err => console.error('Error fetching products:', err));
  }
  
  // Initialize fetching of products
  getAllItems();
  
  // Array to store items in the cart
  let itemsInCart = [];
  
  // Function to add items to the cart
  function addItemToCart(item) {
    const existingItem = itemsInCart.find((cartItem) => cartItem.name === item.name);
  
    if (existingItem) {
      existingItem.quantity++;
    } else {
      itemsInCart.push({...item, quantity: 1});
    }
  }
  
  // Function to update the cart display
  function updateCartDisplay() {
    const cartFile = document.getElementById('file');
    cartFile.innerHTML = ''; // Clear existing content
  
    let totalPrice = 0;
  
    // Iterate over items in the cart and display them
    itemsInCart.forEach((item) => {
      const cartItem = document.createElement('div');
      cartItem.textContent = `${item.name} x${item.quantity} - $${item.price * item.quantity}`;
      cartFile.appendChild(cartItem);
      totalPrice += item.price * item.quantity;
  
      // Button to subtract items from the cart
      const btnSubtract = document.createElement(`button`);
      btnSubtract.textContent = `-`;
      btnSubtract.addEventListener(`click`, () => {
        if (item.quantity > 0) {
          item.quantity--;
          updateCartDisplay();
        }
      });
      cartItem.append(btnSubtract);
    });
  
    // Display total price of the cart
    const totalElement = document.createElement('div');
    totalElement.textContent = `Total: $${totalPrice}`;
    cartFile.appendChild(totalElement);
  
    // Button to clear the cart
    const btnClear = document.createElement(`button`);
    btnClear.textContent = `Clear Cart`;
    btnClear.addEventListener(`click`, () => {
      itemsInCart = [];
      updateCartDisplay();
    });
    cartFile.appendChild(btnClear);
  
    // Button to finalize purchase
    const btnTotalPrice = document.createElement('button');
    btnTotalPrice.textContent = 'Purchase';
    btnTotalPrice.addEventListener('click', () => {
      // Use confirm to ask for user confirmation
      if (confirm(`Do you have $${totalPrice}`)) {
        alert(`Items purchased`);
        itemsInCart = []; // Clear the cart after purchase
        updateCartDisplay(); // Update cart display after clearing
      }
    });
    cartFile.appendChild(btnTotalPrice);
  }
  
  // Create the cart container and append it to the body
  const storage = document.createElement(`div`);
  storage.setAttribute(`id`, `cart`);
  const h2Cart = document.createElement(`h2`);
  h2Cart.textContent = "My Cart";
  const box = document.createElement(`div`);
  box.setAttribute(`id`, `file`);
  storage.appendChild(h2Cart);
  storage.appendChild(box);
  document.body.append(storage);
  