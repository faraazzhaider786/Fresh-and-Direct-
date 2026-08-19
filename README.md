# Fresh & Direct

Fresh & Direct is a front-end grocery and household shopping website for browsing products, adding items to a cart, saving favorites, and completing a checkout flow. The project is built as a static web application using HTML, CSS, and JavaScript, with no backend or external database required.

## Project overview

The app includes:
- A homepage with hero banners, category cards, featured products, and a newsletter section
- A product listing page with category filters, price/rating controls, sorting, and search
- Cart and checkout experience powered by browser `localStorage`
- Wishlist support for saved products
- Login and registration pages for customer account flows
- Responsive layout for desktop and mobile screens

## Tech stack

- HTML5
- CSS3
- JavaScript (vanilla ES6)
- Bootstrap 5 for layout and components
- Local browser storage for cart and wishlist persistence

## Project structure

- `index.html` – homepage
- `products.html` – product catalog and filtering UI
- `cart.html` – shopping cart and checkout summary
- `login.html` – sign-in / sign-up page
- `style.css` – shared styling
- `products.js` – catalog logic, filtering, wishlist, cart state
- `cart.js` – cart rendering and checkout behavior
- `main.js` – homepage interactions and product card actions
- `login.js` – authentication page behaviors
- `*.jpg`, `*.png`, `*.webp` – product and banner images

## Features

- Category-based grocery browsing
- Product search and filtering by category, stock, price, and rating
- Sorting by price and popularity
- Add-to-cart and quantity controls
- Wishlist toggling
- Cart summary and coupon handling
- Responsive storefront design
- Simple front-end user account interface

## How to run

Because this is a static website, you can run it by opening the HTML files directly in a browser.

Recommended quick start:

1. Open the project folder in your browser or serve it through a local static server.
2. Start at `index.html` for the storefront homepage.
3. Navigate to `products.html` to browse products.
4. Open `cart.html` to review the cart and checkout flow.

For example, using a local Python server:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000/
```

## Notes

- The project uses browser local storage to persist cart and wishlist data between page loads.
- It is a front-end demo and does not connect to a real backend or payment gateway.
- Images and product data are embedded locally in the project folder.

## License

This project is provided for educational and demonstration purposes.
