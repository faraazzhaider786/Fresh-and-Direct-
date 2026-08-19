/* ============================================================
   Fresh & Direct – main.js  (index.html homepage)
   Features:
     • Category nav  → redirects to products.html with filter
     • Category cards → same redirect
     • Search bar    → redirects to products.html with search
     • Cart icon     → slide-in mini-cart panel
     • Wishlist icon → slide-in wishlist panel
     • Featured Products tabs + Add to Cart + Wishlist toggle
     • Newsletter subscribe
     • Cart badge sync
   ============================================================ */

(function () {
  "use strict";

  /* ─────────────────────────────────────────
     SHARED STATE
  ───────────────────────────────────────── */
  let cart     = JSON.parse(localStorage.getItem("fd_cart")     || "[]");
  let wishlist = JSON.parse(localStorage.getItem("fd_wishlist") || "[]");

  function saveCart()     { localStorage.setItem("fd_cart",     JSON.stringify(cart));     }
  function saveWishlist() { localStorage.setItem("fd_wishlist", JSON.stringify(wishlist)); }

  /* ─────────────────────────────────────────
     FEATURED PRODUCTS DATA
  ───────────────────────────────────────── */
  const FEATURED = [
    { id: 101, name: "Fresh Broccoli",    category: "Vegetables", price: 120, oldPrice: 150, rating: 5, reviews: 42, weight: "500g pack", img: "images/broccoli.jpg",    badge: "New",     badgeClass: "badge-new"  },
    { id: 102, name: "Fresh Milk",        category: "Dairy",      price: 180, oldPrice: 220, rating: 4, reviews: 88, weight: "1 Litre",   img: "images/milk.jpg",        badge: "20% Off", badgeClass: "badge-sale" },
    { id: 103, name: "Red Apples",        category: "Fruits",     price: 250, oldPrice: null,rating: 5, reviews: 65, weight: "1 kg pack", img: "images/apple.jpg",       badge: "",        badgeClass: ""           },
    { id: 104, name: "Whole Wheat Bread", category: "Bakery",     price: 95,  oldPrice: 110, rating: 4, reviews: 31, weight: "400g loaf", img: "images/wheat_bread.jpg", badge: "15% Off", badgeClass: "badge-sale" },
  ];

  const BG_MAP = { Vegetables:"#eaf7ee", Dairy:"#fff8e1", Fruits:"#ffeaea", Bakery:"#fef3e2" };
  function stars(n) { return "★".repeat(n) + "☆".repeat(5 - n); }

  /* ─────────────────────────────────────────
     CATEGORY → PRODUCTS PAGE REDIRECT
     Stores chosen category in localStorage;
     products.js reads it on load and applies filter.
  ───────────────────────────────────────── */
  const CAT_LABEL_MAP = {
    "All Categories":  "All",
    "Fruits & Veggies":"Fruits",
    "Dairy & Eggs":    "Dairy",
    "Bakery":          "Bakery",
    "Meat & Fish":     "Meat",
  };

  function goToCategory(label) {
    const cat = CAT_LABEL_MAP[label] || "All";
    localStorage.setItem("fd_filter_category", cat);
    window.location.href = "products.html";
  }

  function initCategoryNav() {
    document.querySelectorAll(".cat-link").forEach(link => {
      link.addEventListener("click", e => {
        e.preventDefault();
        goToCategory(link.textContent.trim());
      });
    });
  }

  function initCategoryCards() {
    const cardLabelMap = {
      "Fruits & Veggies": "Fruits & Veggies",
      "Dairy & Eggs":     "Dairy & Eggs",
      "Bakery":           "Bakery",
      "Meat & Fish":      "Meat & Fish",
    };
    document.querySelectorAll(".cat-card").forEach(card => {
      card.style.cursor = "pointer";
      const name = card.querySelector(".cat-name")?.textContent.trim();
      card.addEventListener("click", () => goToCategory(cardLabelMap[name] || "All Categories"));
    });
  }

  /* ─────────────────────────────────────────
     SEARCH → PRODUCTS PAGE REDIRECT
  ───────────────────────────────────────── */
  function initSearch() {
    const input  = document.querySelector(".search-wrap input");
    const button = document.querySelector(".search-wrap button");
    if (!input || !button) return;

    function doSearch() {
      const q = input.value.trim();
      if (!q) return;
      localStorage.setItem("fd_filter_search", q);
      window.location.href = "products.html";
    }

    button.addEventListener("click", doSearch);
    input.addEventListener("keyup", e => { if (e.key === "Enter") doSearch(); });
  }

  /* ─────────────────────────────────────────
     CART HELPERS
  ───────────────────────────────────────── */
  function getQty(id) {
    const item = cart.find(c => c.id === id);
    return item ? item.qty : 0;
  }

  function addToCart(id) {
    const p = FEATURED.find(f => f.id === id);
    if (!p) return;
    const existing = cart.find(c => c.id === id);
    if (existing) existing.qty += 1;
    else cart.push({ id, name: p.name, price: p.price, img: p.img, qty: 1 });
    saveCart();
    updateCartBadges();
    renderFeatured(activeTab);
    renderCartPanel();
    showToast(`${p.name} added to cart 🛒`);
  }

  function changeQty(id, delta) {
    const idx = cart.findIndex(c => c.id === id);
    if (idx === -1) return;
    cart[idx].qty += delta;
    if (cart[idx].qty <= 0) cart.splice(idx, 1);
    saveCart();
    updateCartBadges();
    renderFeatured(activeTab);
    renderCartPanel();
  }

  function cartTotal() {
    return cart.reduce((sum, c) => sum + c.price * c.qty, 0);
  }

  function updateCartBadges() {
    const total = cart.reduce((sum, c) => sum + c.qty, 0);
    document.querySelectorAll(".cart-badge").forEach(b => {
      b.textContent = total;
      b.style.display = total > 0 ? "flex" : "none";
    });
  }

  /* ─────────────────────────────────────────
     WISHLIST HELPERS
  ───────────────────────────────────────── */
  function toggleWishlist(id) {
    const p   = FEATURED.find(f => f.id === id);
    const idx = wishlist.indexOf(id);
    if (idx === -1) { wishlist.push(id);     showToast(`${p.name} added to wishlist ♥`);    }
    else            { wishlist.splice(idx,1); showToast(`${p.name} removed from wishlist`); }
    saveWishlist();
    renderFeatured(activeTab);
    renderWishlistPanel();
  }

  /* ─────────────────────────────────────────
     CART SLIDE-IN PANEL
  ───────────────────────────────────────── */
  function buildCartPanel() {
    const panel = document.createElement("div");
    panel.id = "fd-cart-panel";
    panel.innerHTML = `
      <div class="fd-panel-header">
        <span>🛒 My Cart</span>
        <button class="fd-panel-close" id="cartPanelClose">✕</button>
      </div>
      <div class="fd-panel-body" id="cartPanelBody"></div>
      <div class="fd-panel-footer" id="cartPanelFooter"></div>`;
    document.body.appendChild(panel);

    // Shared overlay (built once)
    if (!document.getElementById("fd-panel-overlay")) {
      const overlay = document.createElement("div");
      overlay.id = "fd-panel-overlay";
      overlay.addEventListener("click", closeAllPanels);
      document.body.appendChild(overlay);
    }

    document.getElementById("cartPanelClose").addEventListener("click", closeAllPanels);
    renderCartPanel();
  }

  function renderCartPanel() {
    const body   = document.getElementById("cartPanelBody");
    const footer = document.getElementById("cartPanelFooter");
    if (!body || !footer) return;

    if (cart.length === 0) {
      body.innerHTML   = `<div class="fd-panel-empty">Your cart is empty 🛒<br><small>Add some fresh items!</small></div>`;
      footer.innerHTML = `<a href="products.html" class="fd-panel-btn">Browse Products</a>`;
      return;
    }

    body.innerHTML = cart.map(item => `
      <div class="fd-panel-item">
        <img src="${item.img}" alt="${item.name}" class="fd-panel-img">
        <div class="fd-panel-info">
          <div class="fd-panel-name">${item.name}</div>
          <div class="fd-panel-price">Rs. ${item.price} × ${item.qty}</div>
          <div class="hp-qty-control mt-1">
            <button class="hp-qty-btn cp-qty" data-id="${item.id}" data-delta="-1">−</button>
            <span class="hp-qty-num">${item.qty}</span>
            <button class="hp-qty-btn cp-qty" data-id="${item.id}" data-delta="1">+</button>
          </div>
        </div>
        <div class="fd-panel-subtotal">Rs. ${item.price * item.qty}</div>
      </div>`).join("");

    footer.innerHTML = `
      <div class="fd-panel-total">Total: <strong>Rs. ${cartTotal()}</strong></div>
      <a href="cart.html" class="fd-panel-btn">View Cart & Checkout</a>`;

    body.querySelectorAll(".cp-qty").forEach(btn => {
      btn.addEventListener("click", () => changeQty(+btn.dataset.id, +btn.dataset.delta));
    });
  }

  /* ─────────────────────────────────────────
     WISHLIST SLIDE-IN PANEL
  ───────────────────────────────────────── */
  function buildWishlistPanel() {
    const panel = document.createElement("div");
    panel.id = "fd-wish-panel";
    panel.innerHTML = `
      <div class="fd-panel-header">
        <span>♥ My Wishlist</span>
        <button class="fd-panel-close" id="wishPanelClose">✕</button>
      </div>
      <div class="fd-panel-body" id="wishPanelBody"></div>
      <div class="fd-panel-footer" id="wishPanelFooter"></div>`;
    document.body.appendChild(panel);
    document.getElementById("wishPanelClose").addEventListener("click", closeAllPanels);
    renderWishlistPanel();
  }

  function renderWishlistPanel() {
    const body   = document.getElementById("wishPanelBody");
    const footer = document.getElementById("wishPanelFooter");
    if (!body) return;

    const items = wishlist.map(id => FEATURED.find(f => f.id === id)).filter(Boolean);

    if (items.length === 0) {
      body.innerHTML   = `<div class="fd-panel-empty">Your wishlist is empty ♥<br><small>Heart items to save them here!</small></div>`;
      if (footer) footer.innerHTML = `<a href="products.html" class="fd-panel-btn">Browse Products</a>`;
      return;
    }

    body.innerHTML = items.map(p => `
      <div class="fd-panel-item">
        <img src="${p.img}" alt="${p.name}" class="fd-panel-img">
        <div class="fd-panel-info">
          <div class="fd-panel-name">${p.name}</div>
          <div class="fd-panel-price">Rs. ${p.price}</div>
          <div class="fd-panel-cat" style="font-size:.75rem;color:#aaa;">${p.category}</div>
        </div>
        <div class="fd-wish-actions">
          <button class="fd-panel-btn fd-wish-add" data-id="${p.id}">+ Cart</button>
          <button class="fd-wish-remove" data-id="${p.id}" title="Remove from wishlist">✕</button>
        </div>
      </div>`).join("");

    if (footer) footer.innerHTML = `<a href="products.html" class="fd-panel-btn">Browse More</a>`;

    body.querySelectorAll(".fd-wish-add").forEach(btn => {
      btn.addEventListener("click", () => addToCart(+btn.dataset.id));
    });
    body.querySelectorAll(".fd-wish-remove").forEach(btn => {
      btn.addEventListener("click", () => toggleWishlist(+btn.dataset.id));
    });
  }

  /* ─────────────────────────────────────────
     PANEL OPEN / CLOSE
  ───────────────────────────────────────── */
  function openPanel(id) {
    closeAllPanels();
    document.getElementById(id)?.classList.add("open");
    document.getElementById("fd-panel-overlay")?.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeAllPanels() {
    ["fd-cart-panel", "fd-wish-panel"].forEach(id =>
      document.getElementById(id)?.classList.remove("open"));
    document.getElementById("fd-panel-overlay")?.classList.remove("open");
    document.body.style.overflow = "";
  }

  /* ─────────────────────────────────────────
     WIRE NAV ICONS  (Cart & Wishlist)
  ───────────────────────────────────────── */
  function initNavIcons() {
    document.querySelectorAll("a.nav-icon-link").forEach(link => {
      const svg  = link.querySelector("svg");
      if (!svg) return;

      // Cart: SVG contains 2 <circle> elements
      if (svg.querySelectorAll("circle").length === 2) {
        link.addEventListener("click", e => {
          e.preventDefault();
          renderCartPanel();
          openPanel("fd-cart-panel");
        });
      }

      // Wishlist: SVG contains the heart path (d starts with M20.84)
      const heartPath = svg.querySelector("path[d^='M20.84']");
      if (heartPath) {
        link.addEventListener("click", e => {
          e.preventDefault();
          renderWishlistPanel();
          openPanel("fd-wish-panel");
        });
      }
    });
  }

  /* ─────────────────────────────────────────
     FEATURED PRODUCTS RENDER
  ───────────────────────────────────────── */
  let activeTab = "All";

  function renderFeatured(tab) {
    activeTab = tab;
    const grid = document.querySelector(".fp-section .row.g-4");
    if (!grid) return;

    const filtered = tab === "All" ? FEATURED : FEATURED.filter(p => p.category === tab);

    if (filtered.length === 0) {
      grid.innerHTML = `<div class="col-12 text-center py-4 text-muted">No products in this category yet.</div>`;
      return;
    }

    grid.innerHTML = filtered.map(p => {
      const qty        = getQty(p.id);
      const wishlisted = wishlist.includes(p.id);
      const heartFill  = wishlisted ? "#e53935" : "none";
      const bg         = BG_MAP[p.category] || "#f5f5f5";
      const badgeHtml  = p.badge ? `<span class="${p.badgeClass}">${p.badge}</span>` : "";

      const cartHtml = qty > 0
        ? `<div class="hp-qty-control">
             <button class="hp-qty-btn" data-id="${p.id}" data-delta="-1">−</button>
             <span class="hp-qty-num">${qty}</span>
             <button class="hp-qty-btn" data-id="${p.id}" data-delta="1">+</button>
           </div>`
        : `<button class="add-btn hp-add-btn" data-id="${p.id}">
             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5">
               <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
             </svg> Add
           </button>`;

      return `
        <div class="col-6 col-md-4 col-lg-3">
          <div class="prod-card">
            <div class="prod-img" style="background:${bg};">
              ${badgeHtml}
              <button class="wishlist-btn hp-wish-btn" data-id="${p.id}">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="${heartFill}" stroke="#e53935" stroke-width="2">
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                </svg>
              </button>
              <img src="${p.img}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover;display:block;">
            </div>
            <div class="prod-body">
              <div class="prod-cat">${p.category}</div>
              <h6 class="prod-name">${p.name}</h6>
              <div class="stars">${stars(p.rating)} <span>(${p.reviews})</span></div>
              <div class="prod-weight">${p.weight}</div>
              <div class="prod-footer">
                <div>
                  <span class="prod-price">Rs. ${p.price}</span>
                  ${p.oldPrice ? `<span class="prod-old">Rs. ${p.oldPrice}</span>` : ""}
                </div>
                ${cartHtml}
              </div>
            </div>
          </div>
        </div>`;
    }).join("");

    grid.querySelectorAll(".hp-add-btn").forEach(btn  => btn.addEventListener("click",  () => addToCart(+btn.dataset.id)));
    grid.querySelectorAll(".hp-qty-btn").forEach(btn  => btn.addEventListener("click",  () => changeQty(+btn.dataset.id, +btn.dataset.delta)));
    grid.querySelectorAll(".hp-wish-btn").forEach(btn => btn.addEventListener("click",  () => toggleWishlist(+btn.dataset.id)));
  }

  /* ─────────────────────────────────────────
     FEATURED TABS
  ───────────────────────────────────────── */
  function initTabs() {
    document.querySelectorAll(".fp-tab").forEach(tab => {
      tab.addEventListener("click", () => {
        document.querySelectorAll(".fp-tab").forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        renderFeatured(tab.textContent.trim());
      });
    });
  }

  /* ─────────────────────────────────────────
     NEWSLETTER
  ───────────────────────────────────────── */
  function initNewsletter() {
    const wrap = document.querySelector(".newsletter-wrap");
    if (!wrap) return;
    const input  = wrap.querySelector("input[type='email']");
    const button = wrap.querySelector("button");
    button.addEventListener("click", () => {
      const email = input.value.trim();
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showToast("Please enter a valid email address.", "error"); return;
      }
      showToast(`Thanks! You're subscribed with ${email} 🎉`);
      input.value = "";
    });
    input.addEventListener("keyup", e => { if (e.key === "Enter") button.click(); });
  }

  /* ─────────────────────────────────────────
     TOAST
  ───────────────────────────────────────── */
  function showToast(message, type = "success") {
    let container = document.getElementById("fd-toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "fd-toast-container";
      container.style.cssText = "position:fixed;bottom:24px;right:24px;z-index:99999;display:flex;flex-direction:column;gap:8px;pointer-events:none;";
      document.body.appendChild(container);
    }
    const bg    = type === "error" ? "#c62828" : "#2e7d32";
    const toast = document.createElement("div");
    toast.textContent = message;
    toast.style.cssText = `background:${bg};color:#fff;padding:10px 18px;border-radius:8px;font-size:0.85rem;box-shadow:0 4px 14px rgba(0,0,0,.2);animation:fd-slide-in .25s ease;white-space:nowrap;max-width:300px;pointer-events:auto;`;
    container.appendChild(toast);
    setTimeout(() => { toast.style.opacity = "0"; toast.style.transition = "opacity .3s"; }, 2500);
    setTimeout(() => toast.remove(), 2900);
  }

  /* ─────────────────────────────────────────
     INJECT STYLES
  ───────────────────────────────────────── */
  const style = document.createElement("style");
  style.textContent = `
    @keyframes fd-slide-in { from{transform:translateX(60px);opacity:0} to{transform:translateX(0);opacity:1} }

    .hp-qty-control { display:flex;align-items:center;gap:4px; }
    .hp-qty-btn {
      width:26px;height:26px;border-radius:6px;border:1.5px solid #2e7d32;
      background:#fff;color:#2e7d32;font-size:1rem;font-weight:700;
      cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .15s;
    }
    .hp-qty-btn:hover { background:#2e7d32;color:#fff; }
    .hp-qty-num { min-width:22px;text-align:center;font-weight:600;font-size:.9rem; }

    .cat-card { cursor:pointer;transition:transform .18s,box-shadow .18s; }
    .cat-card:hover { transform:translateY(-4px);box-shadow:0 8px 24px rgba(0,0,0,.1); }

    #fd-panel-overlay {
      display:none;position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:9000;
    }
    #fd-panel-overlay.open { display:block; }

    #fd-cart-panel, #fd-wish-panel {
      position:fixed;top:0;right:-420px;width:380px;max-width:95vw;height:100vh;
      background:#fff;z-index:9100;display:flex;flex-direction:column;
      box-shadow:-4px 0 32px rgba(0,0,0,.18);transition:right .3s cubic-bezier(.4,0,.2,1);
    }
    #fd-cart-panel.open, #fd-wish-panel.open { right:0; }

    .fd-panel-header {
      display:flex;justify-content:space-between;align-items:center;
      padding:18px 20px;background:#1a6b2f;color:#fff;font-weight:700;font-size:1rem;
      flex-shrink:0;
    }
    .fd-panel-close {
      background:none;border:none;color:#fff;font-size:1.3rem;cursor:pointer;
      line-height:1;padding:0;opacity:.85;transition:opacity .15s;
    }
    .fd-panel-close:hover { opacity:1; }
    .fd-panel-body { flex:1;overflow-y:auto;padding:12px 16px; }
    .fd-panel-footer {
      padding:14px 16px;border-top:1px solid #eee;display:flex;
      flex-direction:column;gap:8px;flex-shrink:0;
    }
    .fd-panel-empty {
      text-align:center;color:#bbb;padding:50px 20px;font-size:.95rem;line-height:1.8;
    }
    .fd-panel-item {
      display:flex;align-items:flex-start;gap:12px;
      padding:12px 0;border-bottom:1px solid #f3f3f3;
    }
    .fd-panel-item:last-child { border-bottom:none; }
    .fd-panel-img {
      width:62px;height:62px;object-fit:cover;border-radius:10px;flex-shrink:0;
      border:1px solid #eee;
    }
    .fd-panel-info { flex:1;min-width:0; }
    .fd-panel-name { font-weight:600;font-size:.88rem;margin-bottom:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis; }
    .fd-panel-price { color:#888;font-size:.8rem;margin-bottom:4px; }
    .fd-panel-subtotal { font-weight:700;color:#1a6b2f;font-size:.88rem;white-space:nowrap;padding-top:4px; }
    .fd-panel-total { font-size:1rem;font-weight:700;text-align:right;color:#1a6b2f;margin-bottom:4px; }
    .fd-panel-btn {
      display:block;text-align:center;background:#1a6b2f;color:#fff !important;
      padding:11px;border-radius:8px;font-weight:600;font-size:.9rem;
      text-decoration:none;border:none;cursor:pointer;transition:background .2s;
    }
    .fd-panel-btn:hover { background:#145a26; }
    .fd-wish-actions { display:flex;flex-direction:column;align-items:flex-end;gap:6px;flex-shrink:0; }
    .fd-wish-add { padding:5px 10px !important;font-size:.75rem !important; }
    .fd-wish-remove {
      background:none;border:none;color:#ccc;font-size:.85rem;
      cursor:pointer;transition:color .15s;padding:0;line-height:1;
    }
    .fd-wish-remove:hover { color:#e53935; }
  `;
  document.head.appendChild(style);

  /* ─────────────────────────────────────────
     ALSO: update products.js to read the
     localStorage filters on page load.
     (See note in products.js INIT section)
  ───────────────────────────────────────── */

  /* ─────────────────────────────────────────
     INIT
  ───────────────────────────────────────── */
  document.addEventListener("DOMContentLoaded", () => {
    buildCartPanel();
    buildWishlistPanel();
    initNavIcons();
    initCategoryNav();
    initCategoryCards();
    initSearch();
    initTabs();
    initNewsletter();
    renderFeatured("All");
    updateCartBadges();
  });

})();




