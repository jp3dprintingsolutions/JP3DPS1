// Simple cart implementation using localStorage
const CART_KEY = 'jp3d_cart_v1';

function getCart(){ 
  const raw = localStorage.getItem(CART_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveCart(cart){
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  renderCartPanel();
}

function addToCart(product){
  const cart = getCart();
  // if same product + instructions exist, merge quantities
  const existing = cart.find(it => it.id===product.id && it.instructions===product.instructions);
  if(existing){
    existing.qty = Number(existing.qty) + Number(product.qty);
  } else {
    cart.push(product);
  }
  saveCart(cart);
  alert('Added to cart');
}

function removeFromCart(index){
  const cart = getCart();
  cart.splice(index,1);
  saveCart(cart);
}

function updateQty(index, qty){
  const cart = getCart();
  if(qty<=0){ removeFromCart(index); return; }
  cart[index].qty = Number(qty);
  saveCart(cart);
}

function renderCartPanel(){
  const panel = document.getElementById('cart-panel');
  if(!panel) return;
  const cart = getCart();
  panel.innerHTML = '';
  const title = document.createElement('div'); title.className='text-center'; title.innerHTML='<strong>Cart</strong>';
  panel.appendChild(title);
  if(cart.length===0){
    const e = document.createElement('div'); e.className='text-center'; e.style.padding='12px 0'; e.textContent='Your cart is empty';
    panel.appendChild(e);
    return;
  }
  cart.forEach((it,idx)=>{
    const row = document.createElement('div'); row.className='cart-item';
    row.innerHTML = `<img src="${it.image}" alt="${it.name}"><div style="flex:1"><div><strong>${it.name}</strong></div><div>₹${it.price} × ${it.qty}</div><div style="font-size:0.9em;color:#555">${it.instructions||''}</div></div><div><button onclick="removeFromCart(${idx})" style="background:#ff4d4d;border:none;color:#fff;padding:6px 8px;border-radius:6px;cursor:pointer">Remove</button></div>`;
    panel.appendChild(row);
  });
  const subtotal = cart.reduce((s,i)=>s + (i.price * i.qty),0);
  const foot = document.createElement('div'); foot.className='cart-actions';
  foot.innerHTML = `<div><strong>Subtotal: ₹${subtotal}</strong></div><div><button onclick="goToCheckout()" class="btn">Checkout</button></div>`;
  panel.appendChild(foot);
}

function goToCheckout(){
  const cart = getCart();
  if(cart.length===0){ alert('Cart is empty'); return; }
  // Build a summary and open checkout page with cart data in localStorage and prefill
  // We'll navigate to checkout.html (or contact.html can behave as checkout) - using contact.html here
  // Save cart in sessionStorage for checkout page to read too
  sessionStorage.setItem('checkout_cart', JSON.stringify(cart));
  window.location.href = 'contact.html?checkout=1';
}

// On product pages, hook add buttons
function attachProductButtons(){
  document.querySelectorAll('.add-to-cart-form').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const id = form.dataset.id;
      const name = form.dataset.name;
      const price = Number(form.dataset.price);
      const image = form.dataset.image;
      const qty = Number(form.querySelector('[name=qty]').value || 1);
      const instructions = form.querySelector('[name=instructions]').value || '';
      addToCart({id,name,price,qty,instructions,image});
    });
  });
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', ()=>{
  renderCartPanel();
  attachProductButtons();
});