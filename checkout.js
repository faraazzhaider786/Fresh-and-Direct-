/* ============================================================
   Fresh & Direct — checkout.js
   Covers: slot selection, payment switching, form validation,
   card formatting, place-order flow, toast notifications.
   ============================================================ */

/* ─── Slot Selection ─────────────────────────────────────── */
function selectSlot(el) {
  document.querySelectorAll('.slot-card').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
}

/* ─── Payment Selection ──────────────────────────────────── */
function selectPayment(el) {
  document.querySelectorAll('.payment-option').forEach(o => o.classList.remove('active'));
  el.classList.add('active');

  const cardFields = document.getElementById('cardFields');
  const isCard = el.id === 'cardOption';
  cardFields.style.display = isCard ? 'block' : 'none';

  if (!isCard) {
    // clear card field errors when switching away
    cardFields.querySelectorAll('.field-input').forEach(clearError);
  }
}

/* ─── Card Input Auto-formatting ─────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {

  // Card number: groups of 4
  const cardNum = document.querySelector('#cardFields input[placeholder="1234 5678 9012 3456"]');
  if (cardNum) {
    cardNum.addEventListener('input', e => {
      let v = e.target.value.replace(/\D/g, '').substring(0, 16);
      e.target.value = v.replace(/(.{4})/g, '$1 ').trim();
    });
  }

  // Expiry: MM / YY
  const expiry = document.querySelector('#cardFields input[placeholder="MM / YY"]');
  if (expiry) {
    expiry.addEventListener('input', e => {
      let v = e.target.value.replace(/\D/g, '').substring(0, 4);
      if (v.length >= 3) v = v.substring(0, 2) + ' / ' + v.substring(2);
      e.target.value = v;
    });
  }

  // CVV: digits only
  const cvv = document.querySelector('#cardFields input[placeholder="123"]');
  if (cvv) {
    cvv.addEventListener('input', e => {
      e.target.value = e.target.value.replace(/\D/g, '').substring(0, 3);
    });
  }

  // Phone: keep digits, dashes, +
  const phone = document.querySelector('input[placeholder="0300-1234567"]');
  if (phone) {
    phone.addEventListener('input', e => {
      e.target.value = e.target.value.replace(/[^\d\-+]/g, '');
    });
  }

  // Hide card fields initially
  document.getElementById('cardFields').style.display = 'none';

  // Live validation — clear error on input
  document.querySelectorAll('.field-input, .field-select').forEach(el => {
    el.addEventListener('input', () => clearError(el));
    el.addEventListener('change', () => clearError(el));
  });
});

/* ─── Validation Helpers ─────────────────────────────────── */
function showError(input, msg) {
  clearError(input);
  input.classList.add('field-error');
  const err = document.createElement('span');
  err.className = 'field-error-msg';
  err.textContent = msg;
  input.parentNode.appendChild(err);
}

function clearError(input) {
  input.classList.remove('field-error');
  const existing = input.parentNode.querySelector('.field-error-msg');
  if (existing) existing.remove();
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
  // accepts 03XX-XXXXXXX, 03XXXXXXXXX, +923XXXXXXXXX
  return /^(\+92|0)?3\d{2}[-]?\d{7}$/.test(phone.replace(/\s/g, ''));
}

function isValidCard(num) {
  return num.replace(/\s/g, '').length === 16;
}

function isValidExpiry(val) {
  const match = val.replace(/\s/g, '').match(/^(\d{2})\/(\d{2})$/);
  if (!match) return false;
  const [, mm, yy] = match;
  const month = parseInt(mm, 10);
  if (month < 1 || month > 12) return false;
  const now = new Date();
  const expDate = new Date(2000 + parseInt(yy, 10), month - 1, 1);
  return expDate >= new Date(now.getFullYear(), now.getMonth(), 1);
}

/* ─── Full Form Validation ───────────────────────────────── */
function validateForm() {
  let valid = true;

  // --- Contact Info ---
  const firstName = document.querySelector('input[placeholder="Ali"]');
  const lastName  = document.querySelector('input[placeholder="Khan"]');
  const phone     = document.querySelector('input[placeholder="0300-1234567"]');
  const email     = document.querySelector('input[placeholder="ali@email.com"]');

  if (!firstName.value.trim()) {
    showError(firstName, 'First name is required.');
    valid = false;
  }
  if (!lastName.value.trim()) {
    showError(lastName, 'Last name is required.');
    valid = false;
  }
  if (!phone.value.trim()) {
    showError(phone, 'Phone number is required.');
    valid = false;
  } else if (!isValidPhone(phone.value.trim())) {
    showError(phone, 'Enter a valid Pakistani phone number (e.g. 0300-1234567).');
    valid = false;
  }
  if (email.value.trim() && !isValidEmail(email.value.trim())) {
    showError(email, 'Enter a valid email address.');
    valid = false;
  }

  // --- Delivery Address ---
  const street = document.querySelector('input[placeholder="House No, Street No, Area"]');
  const city   = document.querySelector('.field-select'); // first select
  const area   = document.querySelectorAll('.field-select')[1];

  if (!street.value.trim()) {
    showError(street, 'Street address is required.');
    valid = false;
  }
  if (city.value === 'Select City' || !city.value) {
    showError(city, 'Please select a city.');
    valid = false;
  }
  if (area.value === 'Select Area' || !area.value) {
    showError(area, 'Please select a delivery area.');
    valid = false;
  }

  // --- Delivery Slot ---
  const slotSelected = document.querySelector('.slot-card.active');
  if (!slotSelected) {
    showToast('Please select a delivery time slot.', 'error');
    valid = false;
  }

  // --- Payment ---
  const activePayment = document.querySelector('.payment-option.active');
  if (!activePayment) {
    showToast('Please select a payment method.', 'error');
    valid = false;
  }

  // Card-specific validation
  if (activePayment && activePayment.id === 'cardOption') {
    const cardNum = document.querySelector('#cardFields input[placeholder="1234 5678 9012 3456"]');
    const expiry  = document.querySelector('#cardFields input[placeholder="MM / YY"]');
    const cvv     = document.querySelector('#cardFields input[placeholder="123"]');

    if (!cardNum.value.trim()) {
      showError(cardNum, 'Card number is required.');
      valid = false;
    } else if (!isValidCard(cardNum.value)) {
      showError(cardNum, 'Enter a valid 16-digit card number.');
      valid = false;
    }
    if (!expiry.value.trim()) {
      showError(expiry, 'Expiry date is required.');
      valid = false;
    } else if (!isValidExpiry(expiry.value)) {
      showError(expiry, 'Enter a valid, non-expired date (MM / YY).');
      valid = false;
    }
    if (!cvv.value.trim()) {
      showError(cvv, 'CVV is required.');
      valid = false;
    } else if (cvv.value.length < 3) {
      showError(cvv, 'CVV must be 3 digits.');
      valid = false;
    }
  }

  return valid;
}

/* ─── Place Order ────────────────────────────────────────── */
function placeOrder() {
  if (!validateForm()) {
    // scroll to first error
    const firstErr = document.querySelector('.field-error');
    if (firstErr) firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  const btn = document.querySelector('.place-order-btn');
  btn.disabled = true;
  btn.innerHTML = `
    <span class="spinner"></span> Processing…
  `;

  // Simulate API call
  setTimeout(() => {
    localStorage.removeItem('fd_cart'); // clear cart after order
    showToast('Order placed successfully! Redirecting…', 'success');
    setTimeout(() => {
      window.location.href = 'confirmation.html';
    }, 1800);
  }, 2000);
}

/* ─── Toast Notification ─────────────────────────────────── */
function showToast(message, type = 'success') {
  // Remove any existing toast
  const old = document.getElementById('fd-toast');
  if (old) old.remove();

  const toast = document.createElement('div');
  toast.id = 'fd-toast';
  toast.className = `fd-toast fd-toast--${type}`;
  toast.innerHTML = `
    <span class="fd-toast-icon">
      ${type === 'success'
        ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>'
        : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>'
      }
    </span>
    <span>${message}</span>
  `;
  document.body.appendChild(toast);

  // Animate in
  requestAnimationFrame(() => toast.classList.add('fd-toast--show'));

  // Auto-remove
  setTimeout(() => {
    toast.classList.remove('fd-toast--show');
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}

/* ─── Dynamic Order Summary ──────────────────────────────── */
function renderOrderSummary() {
  // Expected cart format in localStorage (key: 'fd_cart'):
  // [{ name, qty, price, img, imgBg }, ...]
  // price = price per unit in Rs.
  let cart = [];
  try {
    cart = JSON.parse(localStorage.getItem('fd_cart')) || [];
  } catch (e) {
    cart = [];
  }

  // If cart is empty, keep the hardcoded HTML as fallback
  if (!cart.length) return;

  const DISCOUNT_THRESHOLD = 999;
  const DISCOUNT_RATE      = 0.09; // 9% discount

  const subtotal  = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const discount  = subtotal >= DISCOUNT_THRESHOLD ? Math.round(subtotal * DISCOUNT_RATE) : 0;
  const delivery  = subtotal >= DISCOUNT_THRESHOLD ? 0 : 150;
  const total     = subtotal - discount + delivery;

  // Build items HTML
  const itemsHTML = cart.map(item => `
    <div class="os-item">
      <div class="os-item-img" style="background:${item.imgBg || '#eaf7ee'};">
        <img src="${item.img || ''}" alt="${item.name}" onerror="this.style.display='none'">
      </div>
      <div class="os-item-name">${item.name} <span>x${item.qty}</span></div>
      <div class="os-item-price">Rs. ${(item.price * item.qty).toLocaleString()}</div>
    </div>
  `).join('');

  // Update DOM
  const osItems = document.querySelector('.os-items');
  if (osItems) osItems.innerHTML = itemsHTML;

  // Update totals — target rows by their label text, not nth-of-type
  const allRows = document.querySelectorAll('.os-row');
  allRows.forEach(row => {
    const label = row.querySelector('span:first-child')?.textContent.trim();
    const valueEl = row.querySelector('span:last-child');
    if (!label || !valueEl) return;

    if (label === 'Subtotal') {
      valueEl.textContent = `Rs. ${subtotal.toLocaleString()}`;
    } else if (label === 'Discount') {
      if (discount > 0) {
        row.style.display = '';
        valueEl.textContent = `− Rs. ${discount.toLocaleString()}`;
      } else {
        row.style.display = 'none';
      }
    } else if (label === 'Delivery') {
      valueEl.textContent = delivery === 0 ? 'Free' : `Rs. ${delivery}`;
      valueEl.style.color = delivery === 0 ? '#1a6b2f' : 'inherit';
    }
  });

  _setText('.os-total span:last-child', `Rs. ${total.toLocaleString()}`);

  // Update cart badge in navbar
  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  const badge = document.querySelector('.cart-badge');
  if (badge) badge.textContent = totalQty;

  // Store totals for placeOrder() to use
  window._orderTotals = { subtotal, discount, delivery, total, cart };
}

function _setText(selector, text) {
  const el = document.querySelector(selector);
  if (el) el.textContent = text;
}

// Run on load
document.addEventListener('DOMContentLoaded', renderOrderSummary);

/* ─── Inject Required Styles ─────────────────────────────── */
const style = document.createElement('style');
style.textContent = `
  /* Field error state */
  .field-error {
    border-color: #e53935 !important;
    background: #fff8f8 !important;
  }
  .field-error-msg {
    display: block;
    font-size: 11.5px;
    color: #e53935;
    margin-top: 4px;
    font-weight: 500;
  }

  /* Spinner on button */
  .spinner {
    display: inline-block;
    width: 14px;
    height: 14px;
    border: 2px solid rgba(255,255,255,0.4);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    vertical-align: middle;
    margin-right: 6px;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* Toast */
  .fd-toast {
    position: fixed;
    bottom: 28px;
    left: 50%;
    transform: translateX(-50%) translateY(80px);
    opacity: 0;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 22px 12px 16px;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 500;
    color: #fff;
    z-index: 9999;
    box-shadow: 0 8px 28px rgba(0,0,0,0.18);
    transition: transform 0.35s cubic-bezier(.34,1.56,.64,1), opacity 0.35s ease;
    white-space: nowrap;
  }
  .fd-toast--show {
    transform: translateX(-50%) translateY(0);
    opacity: 1;
  }
  .fd-toast--success { background: #1a6b2f; }
  .fd-toast--error   { background: #c62828; }
  .fd-toast-icon {
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }

  /* Card fields smooth show/hide */
  #cardFields {
    transition: all 0.25s ease;
  }
`;
document.head.appendChild(style);