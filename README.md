# 🛍️ DevHub '26 — E-Commerce Web App
A fully responsive, multi-page e-commerce frontend built with pure **HTML, CSS, and vanilla JavaScript** — no frameworks, no dependencies, just clean handcrafted UI.

---

## 📄 Pages

| Page | File | Description |
|------|------|-------------|
| 🏠 Home | `home.html` | Hero banner, deals & offers countdown, featured categories, supplier inquiry form |
| 🛒 Products | `products.html` | Filterable & searchable product listing with sidebar filters and pagination |
| 📦 Product Detail | `productDetail.html` | Product info, specs, ratings, tabbed sections, and related products |
| 🧺 Cart | `cart.html` | Cart management, coupon input, order summary, checkout flow with confirmation modal |
| 📬 Orders | `order.html` | Order history, per-order invoice viewer, and order tracking timeline |
| 💬 Messages | `messages.html` | Sent inquiry inbox with status management and delete support |
| 👤 Profile | `profile.html` | User account details, editable fields, address, password change, and account deletion |

---

## ✨ Features

- **Auth System** — register, login, logout via `auth.js`; per-user scoped data in `localStorage`
- **Responsive Design** — mobile-first layout with dedicated mobile nav, category pills, and adaptive components
- **Product Categories** — Clothes & Wear, Home & Outdoor, Mobile Accessory, Electronics, Smartphones, Computer & Tech, and more
- **Search & Filter** — URL-based search with category, brand, rating, price range, condition, and verified-seller filters
- **Deals Countdown** — live timer on the homepage deals section
- **Cart System** — add/remove items, quantity control, coupon support, subtotal & total calculation, save for later
- **Checkout Flow** — confirm modal with order total preview, order saved to user account on confirmation
- **Order History** — full order list with invoice generation (print-ready) and step-by-step delivery tracker
- **Supplier Inquiries** — inquiry form on homepage saved to per-user message center
- **Message Center** — view, update status (Unread / Read / Completed), and delete sent inquiries
- **Product Detail Tabs** — Description, Reviews, Shipping, and About Seller
- **Star Ratings** — per-product rating display with review counts
- **Profile Management** — edit name, contact, address, password; sign out and delete account
- **Auth Gate** — cart, orders, messages, and profile prompt sign-in if not logged in

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Markup | HTML5 |
| Styling | CSS3 (custom properties, flexbox, grid) |
| Scripting | Vanilla JavaScript |
| Icons | [Phosphor Icons](https://phosphoricons.com/) |
| Fonts | Inter (Google Fonts) |
| Storage | `localStorage` for per-user data persistence |

---

## 📱 Mobile Support

The app is fully mobile-optimized with:

- Slide-in sidebar navigation
- Category pill filters
- Touch-friendly product cards
- Responsive cart & checkout layout
- Mobile-specific top bars with back navigation
