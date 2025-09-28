// Example product data (can be loaded from products.json later)
const products = [
  { id: 1, name: "Product 01", price: 40, image: "img/IMG_0024.JPG" },
  { id: 2, name: "Product 02", price: 50, image: "img/IMG_0025.JPG" },
  { id: 3, name: "Product 03", price: 60, image: "img/IMG_0039.JPG" },
  { id: 4, name: "Product 04", price: 70, image: "img/IMG_0032.JPG" }
];

const listProduct = document.querySelector('.listProduct');
const listCart = document.querySelector('.listCart');
const cartBtn = document.getElementById('cartBtn');
const slideCart = document.getElementById('slideCart');
const closeCart = document.getElementById('closeCart');
const cartTotal = document.getElementById('cartTotal');
const cartCount = document.querySelector('.icon-cart span');

let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Render products
function renderProducts() {
  listProduct.innerHTML = '';
  products.forEach(p => {
    let div = document.createElement('div');
    div.classList.add('item');
    div.innerHTML = `
      <img src="${p.image}" alt="${p.name}">
      <h5>${p.name}</h5>
      <h6>$${p.price}</h6>
      <button class="addToCartBtn" data-id="${p.id}">Add to Cart</button>
    `;
    listProduct.appendChild(div);
  });

  document.querySelectorAll('.addToCartBtn').forEach(btn => {
    btn.addEventListener('click', () => addToCart(parseInt(btn.dataset.id)));
  });
}

// Add to cart
function addToCart(id) {
  let product = products.find(p => p.id === id);
  let item = cart.find(i => i.id === id);
  if (item) {
    item.qty++;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  saveCart();
}

// Remove one item
function removeFromCart(id) {
  let item = cart.find(i => i.id === id);
  if (item) {
    item.qty--;
    if (item.qty <= 0) {
      cart = cart.filter(i => i.id !== id);
    }
  }
  saveCart();
}

// Save cart to localStorage
function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  renderCartItems();
}

// Update cart count
function updateCartCount() {
  let count = cart.reduce((sum, i) => sum + i.qty, 0);
  cartCount.textContent = count;
}

// Render cart items
function renderCartItems() {
  listCart.innerHTML = '';
  if (cart.length === 0) {
    listCart.innerHTML = '<p>Your cart is empty.</p>';
    cartTotal.textContent = '$0';
    return;
  }

  let total = 0;
  cart.forEach(item => {
    total += item.price * item.qty;
    let div = document.createElement('div');
    div.className = 'listCart-item';
    div.innerHTML = `
      <span>${item.name} x ${item.qty}</span>
      <span>$${item.price * item.qty}
        <button class="removeItem" data-id="${item.id}">−</button>
      </span>
    `;
    listCart.appendChild(div);
  });

  cartTotal.textContent = '$' + total;

  document.querySelectorAll('.removeItem').forEach(btn => {
    btn.addEventListener('click', () => removeFromCart(parseInt(btn.dataset.id)));
  });
}

// Toggle cart
cartBtn.addEventListener('click', () => {
  slideCart.classList.add('active');
  renderCartItems();
});
closeCart.addEventListener('click', () => slideCart.classList.remove('active'));

// Init
renderProducts();
updateCartCount();
renderCartItems();
