# 🏡 RealEstate — Modern Full-Stack MERN Platform

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue.svg)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.3-38B2AC.svg)](https://tailwindcss.com)
[![Vite](https://img.shields.io/badge/Vite-4.5-646CFF.svg)](https://vitejs.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A modern, highly professional **Full Stack Real Estate Marketplace** built using MongoDB, Express.js, React.js (Vite), and Node.js. The platform delivers an elegant Airbnb-grade experience for buying, renting, listing, and managing properties with zero hassle.

---

## 🔗 Live Application & GitHub

- 🌐 **Render Web Service:** [https://real-estate-project-1-mb38.onrender.com](https://real-estate-project-1-mb38.onrender.com)
- 🐙 **GitHub Repository:** [https://github.com/MS1201/Real-Estate-Project](https://github.com/MS1201/Real-Estate-Project)

---

## ✨ Key Features & Improvements

### 🎨 Visual & UX Upgrades
- **Glassmorphic Navigation Bar**: Responsive header with instant search, route indicators, mobile hamburger drawer, and quick "+ Post Ad" CTA.
- **Hero & Discovery Section**: High-converting hero banner with dual-tab search ("Buy" vs "Rent"), live counters, and ambient glow effects.
- **Interactive Property Slider**: Smooth Swiper carousel with autoplay, slide indicators, and direct listing cards.
- **Luxury Property Cards**: High-res image display, discount tags ("Save ₹X"), formatted Indian Rupee pricing (`₹`), and key spec badges (Beds, Baths, Sqft).
- **Responsive Mobile Navigation**: Dedicated mobile slide-out drawer ensuring 100% feature parity on mobile devices.
- **Professional Footer**: Real social icons (Facebook, X, Instagram, LinkedIn, GitHub), quick site links, support contacts, and legal notices.

### 🐛 Bug Fixes & Architectural Improvements
- **Route Access Protection**: Fixed critical bug where the entire website (Home, Search, About, Listing details) was locked behind `PrivateRoute`. Public browsing is now completely open, with auth enforced only for Profile, Create Listing, and Admin management.
- **Listing Auto-Approval**: Fixed issue where newly created user listings defaulted to unapproved and remained invisible on Search and Home. Legitimate listings are now automatically approved upon creation, while suspicious listings are flagged for review.
- **State & Compiler Cleanup**: Removed duplicate keys causing Vite build warnings and configured CSS nesting plugins in PostCSS.
- **Auth & Route Redirection**: Fixed broken links on admin login (pointing to nonexistent `/admin-dashboard`) and added `credentials: 'include'` across all authenticated endpoints to ensure secure JWT cookie handling.
- **Robust Pricing & Crash Prevention**: Made number formatting safe against undefined/null prices and guarded against orphaned landlord accounts in the payment controller.

### 🤖 Intelligent Features
- **AI Real Estate Assistant**: Floating AI chatbot answering inquiries about pricing, budget ranges, rental agreements, stamp duty, and listing guidelines.
- **Admin Dashboard**: Verification portal with auto-clean spam bot, pending approvals tab, total listings table, and user management.
- **Instant Booking & Payment**: Simulated UPI / PhonePe deep-linking and card payment checkout with instant balance transactions.
- **Geo-Location Detection**: 1-click OpenStreetMap reverse geocoding to auto-fill property address from device GPS coordinates.

---

## 🔑 Demo Credentials

To test the application immediately without registration:

| Role | Email | Password | Access |
|---|---|---|---|
| **Admin** | `admin@mern-estate.com` | `admin123` | Full Admin Dashboard (`/admin`), Listings & User Control |
| **Demo User** | `demo@mern-estate.com` | `demo1234` | Browse, Create Listings, Wallet Booking |

*(Both accounts are pre-configured with 1-click autofill buttons on the login screens)*

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Redux Toolkit, Redux Persist, React Router DOM v6, Tailwind CSS, Swiper, React Icons
- **Backend**: Node.js, Express.js, MongoDB Atlas (Mongoose), JWT, BcryptJS, Cookie-Parser
- **Media & Storage**: Cloudinary Media API
- **Deployment**: Render Web Service, Git / GitHub

---

## 📁 Repository Structure

```bash
Real-Estate-Project/
├── api/
│   ├── controllers/         # Auth, listing, admin, wallet, and chatbot logic
│   ├── models/              # User, Listing, and Transaction Mongoose schemas
│   ├── routes/              # Express API routers
│   ├── utils/               # Cloudinary, error handling, and JWT verification
│   ├── createAdmin.js       # Admin account creation script
│   ├── seed.js              # Sample listing seeder
│   └── index.js             # Express application entry point
├── client/
│   ├── src/
│   │   ├── components/      # Header, Footer, ListingItem, Chatbot, Contact, Routes
│   │   ├── pages/           # Home, Search, Listing, About, Profile, Admin, Auth
│   │   └── redux/           # Store & User Slice
│   ├── index.html           # HTML5 template with SEO metadata
│   ├── postcss.config.js    # PostCSS with tailwindcss/nesting
│   ├── tailwind.config.js   # Tailwind design tokens
│   └── vite.config.js       # Vite configuration with API proxy
├── render.yaml              # Render 1-click blueprint deployment specification
├── .env.example             # Backend environment template
├── client/.env.example      # Client environment template
└── package.json             # Root build and orchestration scripts
```

---

## ⚙️ Local Development Setup

### 1. Clone the repository
```bash
git clone https://github.com/MS1201/Real-Estate-Project.git
cd Real-Estate-Project
```

### 2. Install Dependencies
```bash
# Install root/backend packages
npm install

# Install client packages
npm --prefix client install
```

### 3. Setup Environment Variables

Create `api/.env`:
```env
PORT=3000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_jwt_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Create `client/.env`:
```env
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=mern_estate
```

### 4. Seed Initial Data (Optional)
```bash
node api/seed.js
node api/createAdmin.js
```

### 5. Run the Application
```bash
# Run both Backend API and Frontend Vite server concurrently
npm run dev:all
```
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`

---

## 🚀 Deployment on Render

### Method A: Blueprint Deployment (Recommended)
1. Fork or push this repository to your GitHub account (`https://github.com/MS1201/Real-Estate-Project`).
2. Log into [Render.com](https://render.com).
3. Click **New +** → **Blueprint**.
4. Connect this repository; Render will automatically detect `render.yaml`.
5. Fill in your `MONGO_URI` and `CLOUDINARY_*` environment secrets when prompted.
6. Click **Apply** to deploy.

### Method B: Manual Web Service
1. In Render, select **New +** → **Web Service**.
2. Connect your repository.
3. Configure settings:
   - **Environment:** `Node`
   - **Build Command:** `npm run build`
   - **Start Command:** `npm start`
4. Under **Environment Variables**, add:
   - `NODE_VERSION`: `20.11.0`
   - `MONGO_URI`: *Your MongoDB connection string*
   - `JWT_SECRET`: *A secure random secret*
   - `CLOUDINARY_CLOUD_NAME`: *Cloudinary name*
   - `CLOUDINARY_API_KEY`: *Cloudinary API key*
   - `CLOUDINARY_API_SECRET`: *Cloudinary API secret*
   - `VITE_CLOUDINARY_CLOUD_NAME`: *Cloudinary name*
   - `VITE_CLOUDINARY_UPLOAD_PRESET`: `mern_estate`
5. Click **Create Web Service**.

---

## 📄 License
This project is open-source under the [MIT License](LICENSE).
