/* ============================================================
   Fresh & Direct – main.js  (index.html homepage)
   Features:
     • Add to Cart (synced with products page via localStorage)
     • Wishlist toggle
     • Featured Products tab filtering
     • Category nav → scroll + filter
     • Newsletter subscribe toast
     • Cart badge sync
   ============================================================ */

(function () {
  "use strict";

  /* ─────────────────────────────────────────
     SHARED STATE  (same keys as products.js)
  ───────────────────────────────────────── */
  let cart     = JSON.parse(localStorage.getItem("fd_cart")     || "[]");
  let wishlist = JSON.parse(localStorage.getItem("fd_wishlist") || "[]");

  function saveCart()     { localStorage.setItem("fd_cart",     JSON.stringify(cart));     }
  function saveWishlist() { localStorage.setItem("fd_wishlist", JSON.stringify(wishlist)); }

  /* ─────────────────────────────────────────
     FEATURED PRODUCTS DATA
     (mirrors the 4 cards in your HTML)
  ───────────────────────────────────────── */
  const FEATURED = [
    { id: 101, name: "Fresh Broccoli",      category: "Vegetables", price: 120, oldPrice: 150, rating: 5, reviews: 42, weight: "500g pack",  img: "images/broccoli.jpg",    badge: "New",    badgeClass: "badge-new"  },
    { id: 102, name: "Fresh Milk",          category: "Dairy",      price: 180, oldPrice: 220, rating: 4, reviews: 88, weight: "1 Litre",    img: "images/milk.jpg",        badge: "20% Off",badgeClass: "badge-sale" },
    { id: 103, name: "Red Apples",          category: "Fruits",     price: 250, oldPrice: null,rating: 5, reviews: 65, weight: "1 kg pack",  img: "images/apple.jpg",       badge: "",       badgeClass: ""           },
    { id: 104, name: "Whole Wheat Bread",   category: "Bakery",     price: 95,  oldPrice: 110, rating: 4, reviews: 31, weight: "400g loaf",  img: "images/wheat_bread.jpg", badge: "15% Off",badgeClass: "badge-sale" },
  ];

  const BG_MAP = {
    Vegetables: "#eaf7ee",
    Dairy:      "#fff8e1",
    Fruits:     "#ffeaea",
    Bakery:     "#fef3e2",
  };

  function stars(n) {
    return "★".repeat(n) + "☆".repeat(5 - n);
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
    if (existing) { existing.qty += 1; }
    else { cart.push({ id, name: p.name, price: p.price, img: p.img, qty: 1 }); }
    saveCart();
    updateCartBadges();
    renderFeatured(activeTab);
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
  }

  function updateCartBadges() {
    const total = cart.reduce((sum, c) => sum + c.qty, 0);
    document.querySelectorAll(".cart-badge").forEach(b => {
      b.textContent = total;
      b.style.display = total > 0 ? "flex" : "none";
    });
  }

  /* ─────────────────────────────────────────
     WISHLIST
  ───────────────────────────────────────── */
  function toggleWishlist(id) {
    const p   = FEATURED.find(f => f.id === id);
    const idx = wishlist.indexOf(id);
    if (idx === -1) { wishlist.push(id); showToast(`${p.name} added to wishlist ♥`); }
    else            { wishlist.splice(idx, 1); showToast(`${p.name} removed from wishlist`); }
    saveWishlist();
    renderFeatured(activeTab);
  }

  /* ─────────────────────────────────────────
     FEATURED PRODUCTS RENDER
  ───────────────────────────────────────── */
  let activeTab = "All";

  function renderFeatured(tab) {
    activeTab = tab;
    const grid = document.querySelector(".fp-section .row.g-4");
    if (!grid) return;

    const filtered = tab === "All"
      ? FEATURED
      : FEATURED.filter(p => p.category === tab);

    if (filtered.length === 0) {
      grid.innerHTML = `<div class="col-12 text-center py-4 text-muted">No products in this category yet.</div>`;
      return;
    }

    grid.innerHTML = filtered.map(p => {
      const qty        = getQty(p.id);
      const wishlisted = wishlist.includes(p.id);
      const heartFill  = wishlisted ? "#e53935" : "none";
      const bg         = BG_MAP[p.category] || "#f5f5f5";

      const badgeHtml = p.badge
        ? `<span class="${p.badgeClass}">${p.badge}</span>` : "";

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

    // Attach listeners
    grid.querySelectorAll(".hp-add-btn").forEach(btn => {
      btn.addEventListener("click", () => addToCart(+btn.dataset.id));
    });
    grid.querySelectorAll(".hp-qty-btn").forEach(btn => {
      btn.addEventListener("click", () => changeQty(+btn.dataset.id, +btn.dataset.delta));
    });
    grid.querySelectorAll(".hp-wish-btn").forEach(btn => {
      btn.addEventListener("click", () => toggleWishlist(+btn.dataset.id));
    });
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
     CATEGORY NAV  → scroll to section + filter tab
  ───────────────────────────────────────── */
  const CAT_TO_TAB = {
    "All Categories":  "All",
    "Fruits & Veggies":"Fruits",
    "Dairy & Eggs":    "Dairy",
    "Bakery":          "Bakery",
    "Meat & Fish":     "All",   // no meat in featured; just show all
  };

  function initCategoryNav() {
    document.querySelectorAll(".cat-link").forEach(link => {
      link.addEventListener("click", e => {
        e.preventDefault();
        document.querySelectorAll(".cat-link").forEach(l => l.classList.remove("active"));
        link.classList.add("active");

        const label  = link.textContent.trim();
        const tabVal = CAT_TO_TAB[label] || "All";

        // Activate matching tab
        document.querySelectorAll(".fp-tab").forEach(t => {
          t.classList.toggle("active", t.textContent.trim() === tabVal);
        });
        renderFeatured(tabVal);

        // Smooth scroll to featured section
        const fpSection = document.querySelector(".fp-section");
        if (fpSection) fpSection.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }

  /* ─────────────────────────────────────────
     NEWSLETTER
  ───────────────────────────────────────── */
  function initNewsletter() {
    const wrap   = document.querySelector(".newsletter-wrap");
    if (!wrap) return;
    const input  = wrap.querySelector("input[type='email']");
    const button = wrap.querySelector("button");

    button.addEventListener("click", () => {
      const email = input.value.trim();
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showToast("Please enter a valid email address.", "error");
        return;
      }
      showToast(`Thanks! You're subscribed with ${email} 🎉`);
      input.value = "";
    });

    input.addEventListener("keyup", e => {
      if (e.key === "Enter") button.click();
    });
  }

  /* ─────────────────────────────────────────
     TOAST
  ───────────────────────────────────────── */
  function showToast(message, type = "success") {
    let container = document.getElementById("fd-toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "fd-toast-container";
      container.style.cssText =
        "position:fixed;bottom:24px;right:24px;z-index:9999;display:flex;flex-direction:column;gap:8px;";
      document.body.appendChild(container);
    }
    const bg    = type === "error" ? "#c62828" : "#2e7d32";
    const toast = document.createElement("div");
    toast.textContent = message;
    toast.style.cssText =
      `background:${bg};color:#fff;padding:10px 18px;border-radius:8px;` +
      `font-size:0.85rem;box-shadow:0 4px 14px rgba(0,0,0,.2);` +
      `animation:fd-slide-in .25s ease;white-space:nowrap;max-width:280px;`;
    container.appendChild(toast);
    setTimeout(() => { toast.style.opacity = "0"; toast.style.transition = "opacity .3s"; }, 2500);
    setTimeout(() => toast.remove(), 2900);
  }

  /* ─────────────────────────────────────────
     INJECT STYLES
  ───────────────────────────────────────── */
  const style = document.createElement("style");
  style.textContent = `
    @keyframes fd-slide-in {
      from { transform: translateX(60px); opacity: 0; }
      to   { transform: translateX(0);    opacity: 1; }
    }
    .hp-qty-control {
      display: flex; align-items: center; gap: 4px;
    }
    .hp-qty-btn {
      width: 26px; height: 26px; border-radius: 6px;
      border: 1.5px solid #2e7d32; background: #fff;
      color: #2e7d32; font-size: 1rem; font-weight: 700;
      cursor: pointer; display: flex; align-items: center;
      justify-content: center; transition: all .15s;
    }
    .hp-qty-btn:hover { background: #2e7d32; color: #fff; }
    .hp-qty-num {
      min-width: 22px; text-align: center;
      font-weight: 600; font-size: .9rem;
    }
  `;
  document.head.appendChild(style);

  /* ─────────────────────────────────────────
     INIT
  ───────────────────────────────────────── */
  document.addEventListener("DOMContentLoaded", () => {
    renderFeatured("All");
    initTabs();
    initCategoryNav();
    initNewsletter();
    updateCartBadges();
  });

})();



