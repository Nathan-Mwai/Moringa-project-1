// Function to prompt for username and password
function promptForCredentials() {
  const username = prompt("Enter your username:");
  const password = prompt("Enter your password:");

  // Perform authentication here
  if (username === "admin" && password === "password") {
    // If authentication succeeds, proceed to load products
    getAllItems();
    const filler = document.querySelector(`#username`);
    // The name of the user is then filled in the nav section
    filler.textContent = ` Welcome ${username}`;
  } else {
    // If authentication fails, redirect or show an error message
    alert("Invalid username or password. Please try again.");
    //  The user cannot view the products
  }
}

// Function to create product cards and manage cart interactions
function addsProducts(product) {
  // Create a card container for each product
  const card = document.createElement("div");
  card.classList.add("product-card"); // Add a class for styling

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
  const addToCartBtn = card.querySelector(".add-to-cart");
  addToCartBtn.addEventListener("click", () => {
    addItemToCart(product);
    updateCartDisplay();

    // alert(`${product.name} added to cart`);
  });

  // Add mouseover event listener to the product card
  card.addEventListener("mouseover", () => {
    //Change background color on mouseover
    card.style.backgroundColor = "#f0f0f0";
    // Change the font family of the name of the product
    (card.querySelector(`h3`).style.fontFamily = "Kalnia Glaze"), `serif`;
    // Creates an animation that plays when you hover in a card
    card.querySelector(
      `button.add-to-cart`
    ).style.animation = `myAnim 2s ease 0s infinite normal forwards`;
  });

  // Add mouseout event listener to the product card
  card.addEventListener("mouseout", () => {
    //Restore background color on mouseout
    card.style.backgroundColor = "";
    //Restore font family on mouseout
    card.querySelector(`h3`).style.fontFamily = ``;
    // Stop animation on mouseout
    card.style.animation = ``;
    card.querySelector(`button.add-to-cart`).style.animation = ``;
  });

  // Append the product card to the 'items' container
  document.getElementById("items").appendChild(card);
}

// Function to fetch products from the server
function getAllItems() {
  fetch("https://project-1-api.vercel.app/products")
    .then((res) => res.json())
    .then((products) => products.forEach((product) => addsProducts(product)))
    .catch((err) => console.error("Error fetching products:", err));
}

// Prompt for credentials before proceeding
promptForCredentials();

// Array to store items in the cart
let itemsInCart = [];

// Function to add items to the cart
function addItemToCart(item) {
  const existingItem = itemsInCart.find((cartItem) => {
    cartItem.name === item.name;
    cartItem.images === item.i;
  });

  if (existingItem) {
    existingItem.quantity++;
  } else {
    itemsInCart.push({ ...item, quantity: 1 });
  }
}

// Function to update the cart display
function updateCartDisplay() {
  const cartFile = document.getElementById("file");
  cartFile.innerHTML = ""; // Clear existing content

  let totalPrice = 0;

  // Iterate over items in the cart and display them
  itemsInCart.forEach((item) => {
    const cartItem = document.createElement("div");
    cartItem.classList.add("cart-item");

    // Image
    const img = document.createElement("img");
    // item.images contains the path to the image
    img.src = item.images;
    img.alt = `${item.name} Image`;
    cartItem.appendChild(img);

    // Details
    const details = document.createElement("div");
    details.classList.add("item-details");
    details.innerHTML = `
          <p>${item.name} x${item.quantity}</p>
          <p>Price: $${item.price}</p>
          <p>Total: $${item.price * item.quantity}</p>
      `;
    cartItem.appendChild(details);

    // Button to subtract items from the cart
    const btnSubtract = document.createElement("button");
    btnSubtract.textContent = "-";
    btnSubtract.addEventListener("click", () => {
      if (item.quantity > 0) {
        item.quantity--;
        updateCartDisplay();
      }
    });
    cartItem.appendChild(btnSubtract);

    cartFile.appendChild(cartItem);

    // Calculate total price
    totalPrice += item.price * item.quantity;
  });

  // Display total price of the cart both in the cart and the nav section
  const totalElement = document.createElement("div");
  totalElement.textContent = `Total: $${totalPrice}`;
  const displayPrice = document.querySelector(`#displayPrice`);
  displayPrice.textContent = `Total: $${totalPrice}`;
  cartFile.appendChild(totalElement);

  // Button to clear the cart
  // This also clears on the nav
  const btnClear = document.createElement("button");
  btnClear.className = "clear";
  btnClear.textContent = "Clear Cart";
  btnClear.addEventListener("click", () => {
    itemsInCart = [];
    updateCartDisplay();
  });
  cartFile.appendChild(btnClear);

  // Button to finalize purchase
  const btnPurchase = document.createElement("button");
  btnPurchase.className = "purchase";
  btnPurchase.textContent = "Purchase";
  btnPurchase.addEventListener("click", () => {
    if (confirm(`Do you want to purchase these items for $${totalPrice}?`)) {
      alert("Items purchased!");
      itemsInCart = [];
      updateCartDisplay();
    }
  });
  cartFile.appendChild(btnPurchase);
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
