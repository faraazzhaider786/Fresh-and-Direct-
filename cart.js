/* ============================================================
   Fresh & Direct – cart.js  (standalone, no cartStore.js needed)
   Reads/writes the same "fd_cart" localStorage key as products.js
   ============================================================ */

"use strict";

// ─── Config ───────────────────────────────────────────────────────────────────

const DELIVERY_THRESHOLD = 999;
const DELIVERY_FEE       = 150;
const CART_KEY           = "fd_cart";

const VALID_COUPONS = {
  FRESH10: { type: "percent", value: 10 },  // 10% off
  SAVE50:  { type: "flat",    value: 50 },  // Rs. 50 flat
  DAIRY20: { type: "percent", value: 20 },  // 20% off
};

// ─── State ────────────────────────────────────────────────────────────────────

let couponApplied     = null;
let couponDiscountAmt = 0;

// ─── localStorage helpers ─────────────────────────────────────────────────────

function getCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch { return []; }
}

function saveCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

function setQty(id, qty) {
  const items = getCart();
  const idx   = items.findIndex(i => String(i.id) === String(id));
  if (idx === -1) return;
  if (qty < 1) items.splice(idx, 1);
  else items[idx].qty = Math.min(99, qty);
  saveCart(items);
}

function removeFromCart(id) {
  saveCart(getCart().filter(i => String(i.id) !== String(id)));
}

function clearCart() {
  saveCart([]);
}

// ─── Render cart from localStorage ───────────────────────────────────────────

function renderCart() {
  const items     = getCart();
  const container = document.querySelector(".cart-box");
  if (!container) return;

  container.querySelectorAll(".cart-item").forEach(el => el.remove());
  const footer = container.querySelector(".cart-box-footer");

  if (items.length === 0) {
    showEmptyState(container, footer);
    updateItemCount(0);
    updateSummary();
    return;
  }

  hideEmptyState();
  items.forEach(item => container.insertBefore(buildItemEl(item), footer));
  updateItemCount(items.length);
  updateSummary();
}

function buildItemEl(item) {
  const { id, name, price, oldPrice, image, category, weight, qty } = item;
  const hasDiscount = oldPrice && Number(oldPrice) > Number(price);

  const bgMap = {
    Vegetables: "#eaf7ee", Fruits: "#ffeaea", Dairy: "#fff8e1",
    Bakery: "#fff3e0", Meat: "#fce4ec", Fish: "#e3f2fd"
  };
  const bg = bgMap[category] || "#f5f5f5";

  const div = document.createElement("div");
  div.className     = "cart-item";
  div.id            = `item-${id}`;
  div.dataset.id    = id;
  div.dataset.price = price;

  div.innerHTML = `
    <div class="ci-img" style="background:${bg};">
      <img src="${image || 'placeholder.jpg'}" alt="${name}"
           onerror="this.src='placeholder.jpg'" loading="lazy">
    </div>
    <div class="ci-info">
      <div class="ci-cat">${category || ""}</div>
      <h6 class="ci-name">${name}</h6>
      <div class="ci-weight">${weight || ""}</div>
      <div class="ci-price">
        Rs. ${Number(price).toLocaleString()}
        ${hasDiscount
          ? `<span class="ci-old">Rs. ${Number(oldPrice).toLocaleString()}</span>`
          : ""}
      </div>
    </div>
    <div class="ci-right">
      <button class="ci-remove" data-id="${id}" aria-label="Remove ${name}">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6"  x2="6"  y2="18"/>
          <line x1="6"  y1="6"  x2="18" y2="18"/>
        </svg>
      </button>
      <div class="qty-control">
        <button class="qty-btn qty-dec" data-id="${id}">−</button>
        <input  class="qty-input" value="${qty}" min="1" max="99" readonly>
        <button class="qty-btn qty-inc" data-id="${id}">+</button>
      </div>
      <div class="ci-total">Rs. ${(Number(price) * qty).toLocaleString()}</div>
    </div>`;

  return div;
}

// ─── Event delegation (qty +/−, remove ×) ────────────────────────────────────

document.addEventListener("click", e => {

  // Decrement −
  const decBtn = e.target.closest(".qty-dec");
  if (decBtn) {
    const id   = decBtn.dataset.id;
    const item = getCart().find(i => String(i.id) === String(id));
    if (!item) return;
    const newQty = item.qty - 1;
    setQty(id, newQty);
    if (newQty < 1) {
      animateRemove(`item-${id}`, () => {
        updateItemCount(getCart().length);
        updateSummary();
        checkEmpty();
      });
    } else {
      updateItemRow(id, newQty);
      updateSummary();
    }
    return;
  }

  // Increment +
  const incBtn = e.target.closest(".qty-inc");
  if (incBtn) {
    const id   = incBtn.dataset.id;
    const item = getCart().find(i => String(i.id) === String(id));
    if (!item) return;
    const newQty = Math.min(99, item.qty + 1);
    setQty(id, newQty);
    updateItemRow(id, newQty);
    updateSummary();
    return;
  }

  // Remove ×
  const removeBtn = e.target.closest(".ci-remove");
  if (removeBtn) {
    const id = removeBtn.dataset.id;
    removeFromCart(id);
    animateRemove(`item-${id}`, () => {
      updateItemCount(getCart().length);
      updateSummary();
      checkEmpty();
    });
    return;
  }
});

// ─── Update a single row without full re-render ───────────────────────────────

function updateItemRow(id, qty) {
  const row = document.getElementById(`item-${id}`);
  if (!row) return;
  const price = parseFloat(row.dataset.price);
  const input = row.querySelector(".qty-input");
  const total = row.querySelector(".ci-total");
  if (input) input.value       = qty;
  if (total) total.textContent = `Rs. ${(price * qty).toLocaleString()}`;
}

// ─── Clear cart button ────────────────────────────────────────────────────────

document.getElementById("clearCart")?.addEventListener("click", () => {
  const items = document.querySelectorAll(".cart-item");
  if (items.length === 0) return;
  if (!confirm("Are you sure you want to clear the cart?")) return;

  items.forEach((item, i) => {
    setTimeout(() => {
      item.style.transition = "opacity 0.25s ease, transform 0.25s ease";
      item.style.opacity    = "0";
      item.style.transform  = "translateX(40px)";
      setTimeout(() => item.remove(), 260);
    }, i * 70);
  });

  setTimeout(() => {
    clearCart();
    updateItemCount(0);
    updateSummary();
    checkEmpty();
    updateNavBadges();
  }, items.length * 70 + 300);
});

// ─── Coupon ───────────────────────────────────────────────────────────────────

function applyCoupon() {
  const input = document.getElementById("couponInput");
  const code  = input.value.trim().toUpperCase();
  const msgEl = getOrCreateCouponMsg();

  if (!code) {
    showCouponMsg(msgEl, "Please enter a coupon code.", false);
    return;
  }
  if (couponApplied) {
    showCouponMsg(msgEl, `Coupon "${couponApplied.code}" already applied. Remove it first.`, false);
    return;
  }
  if (!VALID_COUPONS[code]) {
    input.classList.add("is-invalid");
    showCouponMsg(msgEl, `"${code}" is not a valid coupon code.`, false);
    return;
  }

  couponApplied  = { code, ...VALID_COUPONS[code] };
  input.value    = "";
  input.disabled = true;
  input.classList.remove("is-invalid");

  const btn = document.querySelector(".coupon-apply-btn");
  if (btn) { btn.textContent = "Remove"; btn.onclick = removeCoupon; }

  showCouponMsg(msgEl, `Coupon "${code}" applied successfully! 🎉`, true);
  updateSummary();
}

function removeCoupon() {
  couponApplied     = null;
  couponDiscountAmt = 0;

  const input = document.getElementById("couponInput");
  const btn   = document.querySelector(".coupon-apply-btn");
  if (input) input.disabled = false;
  if (btn)   { btn.textContent = "Apply"; btn.onclick = applyCoupon; }

  showCouponMsg(getOrCreateCouponMsg(), "Coupon removed.", false);
  updateSummary();
}

function getOrCreateCouponMsg() {
  let el = document.getElementById("couponMsg");
  if (!el) {
    el = document.createElement("div");
    el.id = "couponMsg";
    el.style.cssText = "font-size:12px;margin-top:6px;font-weight:500;transition:opacity 0.3s;";
    document.querySelector(".coupon-wrap")?.after(el);
  }
  return el;
}

function showCouponMsg(el, text, success) {
  el.textContent   = text;
  el.style.color   = success ? "#2e7d32" : "#e53935";
  el.style.opacity = "1";
  clearTimeout(el._timer);
  el._timer = setTimeout(() => { el.style.opacity = "0"; }, 4000);
}

// ─── Order summary ────────────────────────────────────────────────────────────

function updateSummary() {
  const items = getCart();

  // subtotal = sum of current (sale) prices
  const subtotal = items.reduce((s, i) => s + Number(i.price) * i.qty, 0);

  // product-level discount = difference between original and sale price
  // Guard: if oldPrice is missing or <= price, treat as 0 (no discount)
  const productDiscount = items.reduce((s, i) => {
    const orig = Number(i.oldPrice) || 0;
    const curr = Number(i.price);
    return s + (orig > curr ? (orig - curr) * i.qty : 0);
  }, 0);

  // Coupon discount applied on top of subtotal
  if (couponApplied) {
    const raw = couponApplied.type === "percent"
      ? Math.round(subtotal * couponApplied.value / 100)
      : couponApplied.value;
    couponDiscountAmt = Math.min(raw, subtotal);
  } else {
    couponDiscountAmt = 0;
  }

  const afterCoupon = subtotal - couponDiscountAmt;

  // ✅ FIX: delivery is based on the ORIGINAL subtotal (sale prices),
  // not afterCoupon — so a coupon can't accidentally trigger free delivery.
  // Change to afterCoupon if you want coupons to count toward threshold.
  const deliveryFee = subtotal <= 0
    ? 0
    : subtotal >= DELIVERY_THRESHOLD
      ? 0
      : DELIVERY_FEE;

  const grandTotal = afterCoupon + deliveryFee;

  // Update DOM elements
  setText("subtotal",       `Rs. ${subtotal.toLocaleString()}`);
  setText("discount",       productDiscount > 0
    ? `− Rs. ${productDiscount.toLocaleString()}`
    : `Rs. 0`);
  setText("couponDiscount", couponDiscountAmt > 0
    ? `− Rs. ${couponDiscountAmt.toLocaleString()}`
    : `Rs. 0`);
  setText("grandTotal",     `Rs. ${grandTotal.toLocaleString()}`);

  const deliveryEl = document.getElementById("deliveryFeeVal");
  if (deliveryEl) {
    deliveryEl.textContent = deliveryFee === 0 ? "Free" : `Rs. ${deliveryFee}`;
    deliveryEl.className   = deliveryFee === 0 ? "text-success fw-semibold" : "";
  }

  // Free delivery banner (show only when subtotal qualifies)
  const banner = document.querySelector(".free-delivery-banner");
  if (banner) {
    banner.style.display = (subtotal >= DELIVERY_THRESHOLD && subtotal > 0) ? "flex" : "none";
  }

  updateFreeDeliveryBar(subtotal);
  updateNavBadges();
}

function setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

// ─── Item count label ─────────────────────────────────────────────────────────

function updateItemCount(count) {
  const el = document.getElementById("itemCount");
  if (el) el.textContent = `(${count} item${count !== 1 ? "s" : ""})`;
}

// ─── Navbar cart badge ────────────────────────────────────────────────────────

function updateNavBadges() {
  const total = getCart().reduce((s, i) => s + i.qty, 0);
  document.querySelectorAll(".cart-badge").forEach(b => {
    b.textContent   = total > 0 ? total : "";
    b.style.display = total > 0 ? "flex" : "none";
  });
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function checkEmpty() {
  const count = getCart().length;
  if (count === 0) showEmptyState(document.querySelector(".cart-box"));
  else hideEmptyState();
}

function showEmptyState(container) {
  if (document.getElementById("emptyCartMsg") || !container) return;
  const footer = container.querySelector(".cart-box-footer");
  const el = document.createElement("div");
  el.id = "emptyCartMsg";
  el.innerHTML = `
    <div style="text-align:center;padding:60px 20px 40px;">
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#ccc"
           stroke-width="1.5" style="margin-bottom:16px;">
        <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
        <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 001.95-1.57l1.65-8.43H6"/>
      </svg>
      <p style="font-size:18px;font-weight:600;color:#555;margin-bottom:8px;">Your cart is empty</p>
      <p style="font-size:14px;color:#aaa;margin-bottom:24px;">Looks like you haven't added anything yet.</p>
      <a href="products.html"
         style="background:#2e7d32;color:#fff;padding:10px 24px;border-radius:8px;
                text-decoration:none;font-weight:500;font-size:14px;">
        Start Shopping
      </a>
    </div>`;
  container.insertBefore(el, footer);
}

function hideEmptyState() {
  document.getElementById("emptyCartMsg")?.remove();
}

// ─── Free delivery progress bar ───────────────────────────────────────────────

function updateFreeDeliveryBar(subtotal) {
  let wrap = document.getElementById("freeDeliveryProgress");

  if (!wrap) {
    const anchor = document.querySelector(".free-delivery-banner")
                || document.querySelector(".summary-card");
    if (!anchor) return;
    wrap = document.createElement("div");
    wrap.id = "freeDeliveryProgress";
    wrap.style.cssText = "margin-bottom:12px;font-size:12px;color:#555;";
    wrap.innerHTML = `
      <div id="freeDeliveryMsg" style="margin-bottom:5px;"></div>
      <div style="height:6px;background:#e0e0e0;border-radius:4px;overflow:hidden;">
        <div id="freeDeliveryBar"
             style="height:100%;background:#2e7d32;border-radius:4px;
                    transition:width 0.4s ease;width:0%;"></div>
      </div>`;
    anchor.insertAdjacentElement("afterend", wrap);
  }

  const bar   = document.getElementById("freeDeliveryBar");
  const msgEl = document.getElementById("freeDeliveryMsg");

  if (subtotal >= DELIVERY_THRESHOLD) {
    wrap.style.display = "none";
  } else {
    wrap.style.display = "block";
    const pct       = Math.min(100, Math.round((subtotal / DELIVERY_THRESHOLD) * 100));
    const remaining = DELIVERY_THRESHOLD - subtotal;
    if (bar)   bar.style.width   = `${pct}%`;
    if (msgEl) msgEl.textContent = `Add Rs. ${remaining.toLocaleString()} more for FREE delivery!`;
  }
}

// ─── Animate item removal ─────────────────────────────────────────────────────

function animateRemove(elId, onDone) {
  const el = document.getElementById(elId);
  if (!el) { onDone?.(); return; }

  el.style.transition = "opacity 0.3s ease, transform 0.3s ease, "
    + "max-height 0.35s ease 0.3s, padding 0.35s ease 0.3s, margin 0.35s ease 0.3s";
  el.style.opacity   = "0";
  el.style.transform = "translateX(40px)";

  setTimeout(() => {
    el.style.maxHeight = "0";
    el.style.padding   = "0";
    el.style.margin    = "0";
    el.style.overflow  = "hidden";
  }, 300);

  setTimeout(() => { el.remove(); onDone?.(); }, 680);
}

// ─── Init ─────────────────────────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {
  renderCart();
  updateNavBadges();
});