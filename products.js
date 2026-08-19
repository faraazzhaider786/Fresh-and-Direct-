/* ============================================================
   Fresh & Direct – products.js
   Features: Add to Cart, Filter & Sort, Wishlist, Search
   ============================================================ */

(function () {
  "use strict";

  /* ─────────────────────────────────────────
     STATE
  ───────────────────────────────────────── */
  let cart     = JSON.parse(localStorage.getItem("fd_cart")     || "[]");
  let wishlist = JSON.parse(localStorage.getItem("fd_wishlist") || "[]");

  /* ─────────────────────────────────────────
     PRODUCT DATA
  ───────────────────────────────────────── */
  const PRODUCTS = [
  // Fruits & Vegetables
  { id: 1,  name: "Fresh Broccoli",  category: "Fruits & Vegetables", price: 120, oldPrice: 150, rating: 5, reviews: 42, weight: "500g pack", img: "images/broccoli.jpg", badge: "20% Off", inStock: true, onSale: true, organic: true, newArr: false },
  { id: 2,  name: "Fresh Apple",     category: "Fruits & Vegetables", price: 220, oldPrice: 275, rating: 5, reviews: 42, weight: "500g pack", img: "images/apple.jpg",    badge: "20% Off", inStock: true, onSale: true, organic: false, newArr: false },
  { id: 3,  name: "Fresh Milk",      category: "Dairy & Eggs",        price: 300, oldPrice: 375, rating: 5, reviews: 42, weight: "1 litre",   img: "images/milk.jpg",     badge: "20% Off", inStock: true, onSale: true, organic: false, newArr: true  },
  { id: 4,  name: "Fresh Banana",    category: "Fruits & Vegetables", price: 200, oldPrice: 250, rating: 4, reviews: 38, weight: "500g pack", img: "images/bananas.jpg",  badge: "20% Off", inStock: true, onSale: true, organic: true,  newArr: false },

  { id: 5,  name: "Tomatoes",        category: "Fruits & Vegetables", price: 100, oldPrice: 120, rating: 4, reviews: 30, weight: "500g", img: "images/tomatoes.jpg", badge: "", inStock: true, onSale: true, organic: false, newArr: false },
  { id: 6,  name: "Potatoes",        category: "Fruits & Vegetables", price: 80,  oldPrice: 100, rating: 4, reviews: 25, weight: "1kg",  img: "images/potatoes.jpg", badge: "", inStock: true, onSale: true, organic: false, newArr: false },

  // Dairy & Eggs
  { id: 7,  name: "Eggs (12 Pack)",  category: "Dairy & Eggs", price: 480, oldPrice: 600, rating: 4, reviews: 56, weight: "12 pack", img: "images/eggs.jpg", badge: "New", inStock: true, onSale: false, organic: false, newArr: true },
  { id: 8,  name: "Yogurt (Dahi)",   category: "Dairy & Eggs", price: 180, oldPrice: 200, rating: 5, reviews: 20, weight: "500g", img: "images/yogurt.jpg", badge: "", inStock: true, onSale: true, organic: false, newArr: false },
  { id: 9,  name: "Butter",          category: "Dairy & Eggs", price: 350, oldPrice: 400, rating: 4, reviews: 18, weight: "200g", img: "images/butter.jpg", badge: "", inStock: true, onSale: true, organic: false, newArr: false },

  // Bakery
  { id: 10, name: "Brown Bread",     category: "Bakery", price: 180, oldPrice: 200, rating: 5, reviews: 29, weight: "400g loaf", img: "images/wheat_bread.jpg", badge: "", inStock: true, onSale: true, organic: false, newArr: false },
  { id: 11, name: "Rusk Biscuits",   category: "Bakery", price: 120, oldPrice: 140, rating: 4, reviews: 22, weight: "pack", img: "images/rusk.jpg", badge: "", inStock: true, onSale: true, organic: false, newArr: false },

  // Meat & Fish
  { id: 12, name: "Chicken (1kg)",   category: "Meat & Fish", price: 950, oldPrice: 1000, rating: 4, reviews: 61, weight: "1kg", img: "images/chicken.jpg", badge: "", inStock: true, onSale: true, organic: false, newArr: false },
  { id: 13, name: "Beef (1kg)",      category: "Meat & Fish", price: 1200, oldPrice: 1300, rating: 4, reviews: 40, weight: "1kg", img: "images/beef.jpg", badge: "", inStock: true, onSale: true, organic: false, newArr: false },
  { id: 14, name: "Fish (Rohu)",     category: "Meat & Fish", price: 800, oldPrice: 900, rating: 4, reviews: 35, weight: "1kg", img: "images/fish.webp", badge: "", inStock: true, onSale: true, organic: false, newArr: false }
  ];

  /* ─────────────────────────────────────────
     HELPERS
  ───────────────────────────────────────── */
  function saveCart()     { localStorage.setItem("fd_cart",     JSON.stringify(cart));     }
  function saveWishlist() { localStorage.setItem("fd_wishlist", JSON.stringify(wishlist)); }

  function stars(n) {
    return "★".repeat(n) + "☆".repeat(5 - n);
  }

  /* ─────────────────────────────────────────
     CART  — saves full product object so
     cart.js can render every field correctly
  ───────────────────────────────────────── */
  function getCartQty(id) {
    const item = cart.find(c => c.id === id);
    return item ? item.qty : 0;
  }

  function addToCart(id) {
    const product = PRODUCTS.find(p => p.id === id);
    if (!product || !product.inStock) return;

    const existing = cart.find(c => c.id === id);
    if (existing) {
      existing.qty = Math.min(99, existing.qty + 1);
    } else {
      // ↓ Store every field cart.js needs
      cart.push({
        id:       product.id,
        name:     product.name,
        price:    product.price,
        oldPrice: product.oldPrice !== product.price ? product.oldPrice : null,
        image:    product.img,        // cart.js uses "image", not "img"
        category: product.category,
        weight:   product.weight,
        qty:      1,
      });
    }

    saveCart();
    updateCartBadges();
    renderProducts();
    showToast(`${product.name} added to cart`);
  }

  function changeQty(id, delta) {
    const idx = cart.findIndex(c => c.id === id);
    if (idx === -1) return;
    cart[idx].qty += delta;
    if (cart[idx].qty <= 0) cart.splice(idx, 1);
    saveCart();
    updateCartBadges();
    renderProducts();
  }

  function updateCartBadges() {
    const total = cart.reduce((sum, c) => sum + c.qty, 0);
    document.querySelectorAll(".cart-badge").forEach(b => {
      b.textContent = total > 0 ? total : "";
      b.style.display = total > 0 ? "flex" : "none";
    });
  }

  /* ─────────────────────────────────────────
     WISHLIST
  ───────────────────────────────────────── */
  function toggleWishlist(id) {
    const product = PRODUCTS.find(p => p.id === id);
    const idx = wishlist.indexOf(id);
    if (idx === -1) {
      wishlist.push(id);
      showToast(`${product.name} added to wishlist ♥`);
    } else {
      wishlist.splice(idx, 1);
      showToast(`${product.name} removed from wishlist`);
    }
    saveWishlist();
    renderProducts();
  }

  /* ─────────────────────────────────────────
     FILTER & SORT STATE
  ───────────────────────────────────────── */
  let activeCategory = "All";
  let maxPrice       = 5000;
  let minRating      = 0;
  let filterInStock  = false;
  let filterOnSale   = false;
  let filterOrganic  = false;
  let filterNewArr   = false;
  let sortOrder      = "default";
  let searchQuery    = "";

  /* ─────────────────────────────────────────
     FILTERED & SORTED PRODUCT LIST
  ───────────────────────────────────────── */
  function getFilteredProducts() {
    return PRODUCTS
      .filter(p => {
        if (activeCategory !== "All" && p.category !== activeCategory) return false;
        if (p.price > maxPrice)   return false;
        if (p.rating < minRating) return false;
        if (filterInStock && !p.inStock)  return false;
        if (filterOnSale  && !p.onSale)   return false;
        if (filterOrganic && !p.organic)  return false;
        if (filterNewArr  && !p.newArr)   return false;
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          if (!p.name.toLowerCase().includes(q) && !p.category.toLowerCase().includes(q)) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortOrder === "price_asc")  return a.price - b.price;
        if (sortOrder === "price_desc") return b.price - a.price;
        if (sortOrder === "newest")     return b.newArr - a.newArr;
        if (sortOrder === "rating")     return b.rating - a.rating;
        return a.id - b.id;
      });
  }

  /* ─────────────────────────────────────────
     RENDER
  ───────────────────────────────────────── */
  function renderProducts() {
    const grid = document.getElementById("productsGrid");
    if (!grid) return;

    const filtered = getFilteredProducts();
    const count = document.querySelector(".toolbar-count");
    if (count) {
      count.innerHTML = `Showing <strong>1–${filtered.length}</strong> of <strong>${PRODUCTS.length}</strong> products`;
    }

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="col-12 text-center py-5">
          <div style="font-size:3rem;">🥦</div>
          <h5 class="mt-3 text-muted">No products found</h5>
          <p class="text-muted">Try adjusting your filters or search query.</p>
        </div>`;
      return;
    }

    grid.innerHTML = filtered.map(p => {
      const qty        = getCartQty(p.id);
      const wishlisted = wishlist.includes(p.id);
      const badgeHtml  = p.badge ? `<span class="prod-badge badge-sale">${p.badge}</span>` : "";
      const heartFill  = wishlisted ? "#e53935" : "none";

      const cartHtml = p.inStock
        ? (qty > 0
            ? `<div class="qty-control">
                 <button class="qty-btn" data-id="${p.id}" data-delta="-1">−</button>
                 <span class="qty-num">${qty}</span>
                 <button class="qty-btn" data-id="${p.id}" data-delta="1">+</button>
               </div>`
            : `<button class="add-to-cart-btn" data-id="${p.id}">
                 <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5">
                   <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                 </svg> Add
               </button>`)
        : `<button class="add-to-cart-btn" style="background:#aaa;cursor:not-allowed" disabled>Out of Stock</button>`;

      return `
        <div class="col-6 col-md-4">
          <div class="prod-card">
            <div class="prod-img-wrap" style="background:#eaf7ee;">
              ${badgeHtml}
              <button class="wish-btn" data-id="${p.id}">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="${heartFill}" stroke="#e53935" stroke-width="2">
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                </svg>
              </button>
              <img src="${p.img}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover;display:block;">
            </div>
            <div class="prod-body">
              <div class="prod-cat-label">${p.category}</div>
              <h6 class="prod-title">${p.name}</h6>
              <div class="prod-stars">${stars(p.rating)} <span>(${p.reviews})</span></div>
              <div class="prod-weight">${p.weight}</div>
              <div class="prod-footer">
                <div>
                  <span class="prod-price">Rs. ${p.price}</span>
                  ${p.oldPrice !== p.price ? `<span class="prod-old-price">Rs. ${p.oldPrice}</span>` : ""}
                </div>
                ${cartHtml}
              </div>
            </div>
          </div>
        </div>`;
    }).join("");

    attachCardListeners();
  }

  /* ─────────────────────────────────────────
     EVENT DELEGATION FOR CARDS
  ───────────────────────────────────────── */
  function attachCardListeners() {
    document.querySelectorAll(".add-to-cart-btn[data-id]").forEach(btn => {
      btn.addEventListener("click", () => addToCart(+btn.dataset.id));
    });
    document.querySelectorAll(".qty-btn").forEach(btn => {
      btn.addEventListener("click", () => changeQty(+btn.dataset.id, +btn.dataset.delta));
    });
    document.querySelectorAll(".wish-btn[data-id]").forEach(btn => {
      btn.addEventListener("click", () => toggleWishlist(+btn.dataset.id));
    });
  }

  /* ─────────────────────────────────────────
     FILTER SIDEBAR LISTENERS
  ───────────────────────────────────────── */
  function initFilters() {
    document.querySelectorAll(".cat-filter-list li a").forEach(link => {
      link.addEventListener("click", e => {
        e.preventDefault();
        document.querySelectorAll(".cat-filter-list li").forEach(li => li.classList.remove("active"));
        link.parentElement.classList.add("active");
        // const text = link.textContent.trim().replace(/\d+/g, "").trim();
        // activeCategory = text === "All Products" ? "All" : text.replace(" & ", " ").split(" ")[0];

        // const catMap = { "All": "All", "Fruits & Vegetables": "Fruits & Vegetables", "Dairy & Eggs": "Dairy & Eggs", "Bakery": "Bakery", "Meat & Fish": "Meat & Fish" };
        // activeCategory = catMap[activeCategory] || "All";
        const text = link.textContent.trim().replace(/\d+/g, "").trim();
        const catMap = {
            "All Products":        "All",
            "Fruits & Veggies": "Fruits & Vegetables",
            "Dairy & Eggs":        "Dairy & Eggs",
            "Bakery":              "Bakery",
            "Meat & Fish":         "Meat & Fish"
          };
        activeCategory = catMap[text] || "All";
        renderProducts();
      });
    });

    const priceRange   = document.getElementById("priceRange");
    const priceDisplay = document.getElementById("price-display");
    if (priceRange) {
      priceRange.addEventListener("input", () => {
        maxPrice = +priceRange.value;
        if (priceDisplay) priceDisplay.textContent = `Rs. ${maxPrice}`;
        renderProducts();
      });
    }

    document.querySelectorAll(".rating-filter-row").forEach((row, idx) => {
      row.style.cursor = "pointer";
      row.addEventListener("click", () => {
        document.querySelectorAll(".rating-filter-row").forEach(r => r.classList.remove("active-rating"));
        row.classList.add("active-rating");
        minRating = [5, 4, 3][idx];
        renderProducts();
      });
    });

    const inStockCb = document.getElementById("inStock");
    const onSaleCb  = document.getElementById("onSale");
    const organicCb = document.getElementById("organic");
    const newArrCb  = document.getElementById("newArr");

    if (inStockCb) inStockCb.addEventListener("change", () => { filterInStock = inStockCb.checked; renderProducts(); });
    if (onSaleCb)  onSaleCb.addEventListener("change",  () => { filterOnSale  = onSaleCb.checked;  renderProducts(); });
    if (organicCb) organicCb.addEventListener("change", () => { filterOrganic = organicCb.checked; renderProducts(); });
    if (newArrCb)  newArrCb.addEventListener("change",  () => { filterNewArr  = newArrCb.checked;  renderProducts(); });

    document.querySelectorAll(".filter-clear").forEach(btn => {
      btn.addEventListener("click", () => {
        activeCategory = "All"; maxPrice = 5000; minRating = 0;
        filterInStock = filterOnSale = filterOrganic = filterNewArr = false;
        if (priceRange)   priceRange.value = 5000;
        if (priceDisplay) priceDisplay.textContent = "Rs. 5000";
        if (inStockCb) inStockCb.checked = false;
        if (onSaleCb)  onSaleCb.checked  = false;
        if (organicCb) organicCb.checked = false;
        if (newArrCb)  newArrCb.checked  = false;
        document.querySelectorAll(".cat-filter-list li").forEach((li, i) => li.classList.toggle("active", i === 0));
        document.querySelectorAll(".rating-filter-row").forEach(r => r.classList.remove("active-rating"));
        renderProducts();
      });
    });
  }

  /* ─────────────────────────────────────────
     SORT TOOLBAR
  ───────────────────────────────────────── */
  function initSort() {
    const sortSel = document.querySelector(".sort-select");
    if (!sortSel) return;
    sortSel.addEventListener("change", () => {
      const map = {
        "Sort: Default":      "default",
        "Price: Low to High": "price_asc",
        "Price: High to Low": "price_desc",
        "Newest First":       "newest",
        "Top Rated":          "rating",
      };
      sortOrder = map[sortSel.value] || "default";
      renderProducts();
    });
  }

  /* ─────────────────────────────────────────
     SEARCH BAR
  ───────────────────────────────────────── */
  function initSearch() {
    const input  = document.querySelector(".search-wrap input");
    const button = document.querySelector(".search-wrap button");
    if (!input) return;

    function doSearch() {
      searchQuery = input.value.trim();
      renderProducts();
    }

    if (button) button.addEventListener("click", doSearch);
    input.addEventListener("keyup", e => {
      if (e.key === "Enter") doSearch();
      clearTimeout(input._timer);
      input._timer = setTimeout(doSearch, 300);
    });
  }

  /* ─────────────────────────────────────────
     GRID / LIST VIEW TOGGLE
  ───────────────────────────────────────── */
  function initViewToggle() {
    const gridBtn = document.getElementById("gridView");
    const listBtn = document.getElementById("listView");
    const grid    = document.getElementById("productsGrid");
    if (!gridBtn || !listBtn || !grid) return;

    gridBtn.addEventListener("click", () => {
      gridBtn.classList.add("active"); listBtn.classList.remove("active");
      grid.classList.remove("list-view");
    });
    listBtn.addEventListener("click", () => {
      listBtn.classList.add("active"); gridBtn.classList.remove("active");
      grid.classList.add("list-view");
    });
  }

  /* ─────────────────────────────────────────
     TOAST NOTIFICATION
  ───────────────────────────────────────── */
  function showToast(message) {
    let container = document.getElementById("fd-toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "fd-toast-container";
      container.style.cssText =
        "position:fixed;bottom:24px;right:24px;z-index:9999;display:flex;flex-direction:column;gap:8px;";
      document.body.appendChild(container);
    }
    const toast = document.createElement("div");
    toast.textContent = message;
    toast.style.cssText =
      "background:#2e7d32;color:#fff;padding:10px 18px;border-radius:8px;" +
      "font-size:0.85rem;box-shadow:0 4px 14px rgba(0,0,0,.2);" +
      "animation:fd-slide-in .25s ease;white-space:nowrap;";
    container.appendChild(toast);
    setTimeout(() => { toast.style.opacity = "0"; toast.style.transition = "opacity .3s"; }, 2500);
    setTimeout(() => toast.remove(), 2900);
  }

  // Inject shared styles
  const style = document.createElement("style");
  style.textContent = `
    @keyframes fd-slide-in { from { transform:translateX(60px);opacity:0; } to { transform:translateX(0);opacity:1; } }
    .qty-control { display:flex;align-items:center;gap:4px; }
    .qty-btn { width:26px;height:26px;border-radius:6px;border:1.5px solid #2e7d32;background:#fff;
               color:#2e7d32;font-size:1rem;font-weight:700;cursor:pointer;display:flex;
               align-items:center;justify-content:center;transition:all .15s; }
    .qty-btn:hover { background:#2e7d32;color:#fff; }
    .qty-num { min-width:22px;text-align:center;font-weight:600;font-size:.9rem; }
    .active-rating { color:#f9a825;font-weight:600; }
    #productsGrid.list-view .col-6 { width:100%!important;max-width:100%;flex:0 0 100%; }
    #productsGrid.list-view .prod-card { flex-direction:row; }
    #productsGrid.list-view .prod-img-wrap { width:130px;min-width:130px;height:auto;border-radius:10px 0 0 10px; }
  `;
  document.head.appendChild(style);

  /* ─────────────────────────────────────────
     INIT
  ───────────────────────────────────────── */
  document.addEventListener("DOMContentLoaded", () => {
    initFilters();
    initSort();
    initSearch();
    initViewToggle();
    renderProducts();
    updateCartBadges();
  });

})();













