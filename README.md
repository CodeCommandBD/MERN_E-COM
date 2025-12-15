<div align="center">

![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-000000?style=for-the-badge&logo=shadcnui&logoColor=white)
![MUI](https://img.shields.io/badge/MUI_7-007FFF?style=for-the-badge&logo=mui&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-008CDD?style=for-the-badge&logo=stripe&logoColor=white)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-FF4154?style=for-the-badge&logo=react-query&logoColor=white)
![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-764ABC?style=for-the-badge&logo=redux&logoColor=white)

# 🛍️ Next.js E-Commerce Platform

### Modern Full-Stack Online Store with Admin Dashboard

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Visit_Site-success?style=for-the-badge)](https://next-ecommerce-beta-mocha.vercel.app)

</div>

---

## 📋 Table of Contents

- [📖 Introduction](#-introduction)
- [✨ Features](#-features)
- [⚙️ Tech Stack](#️-tech-stack)
- [🚀 Getting Started](#-getting-started)
- [🔐 Environment Variables](#-environment-variables)
- [📦 Project Structure](#-project-structure)
- [🖼️ Screenshots](#️-screenshots)
- [🔗 Demo & Links](#-demo--links)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [👤 About the Creator](#-about-the-creator)

---

## 📖 Introduction

A modern, production-ready **eCommerce platform** built with **Next.js 16** and **React 19** using the App Router architecture. This full-stack solution features a beautiful storefront, comprehensive admin dashboard, secure payment processing with **Stripe**, and robust authentication.

Designed with **scalability**, **performance**, and **SEO** in mind, this project showcases best practices in modern web development including server-side rendering, API routes, state management with Redux Toolkit, and data fetching with TanStack Query.

---

## ✨ Features

### 🛍️ **Storefront**
- Dynamic product catalog with categories and filtering
- Advanced search with fuzzy matching (Fuse.js)
- Product variants (size, color, etc.)
- Rich product descriptions with CKEditor
- Responsive, mobile-first design
- SEO optimized with dynamic sitemaps and meta tags

### 🛒 **Cart & Checkout**
- Persistent shopping cart
- Real-time cart verification
- Coupon code support
- Secure checkout with **Stripe** payment integration
- Order tracking and history

### 👤 **User Authentication**
- JWT-based authentication
- Email/password registration and login
- OAuth/SSO integration
- OTP verification support
- Secure password hashing with bcrypt

### 🧑‍💼 **Admin Dashboard**
- Modern dark/light theme toggle
- Product management (CRUD operations)
- Category management
- Order management and tracking
- Customer management
- Media gallery with Cloudinary integration
- Dashboard analytics with Recharts
- Coupon management
- Review moderation
- Support chat system

### 🖼️ **Media & UI**
- Cloudinary CDN for image hosting
- Optimized image delivery with Next.js Image
- Beautiful UI with Tailwind CSS + MUI + Radix UI
- Smooth animations and transitions
- Dark/Light theme support

### 📊 **Performance & Optimization**
- React Query for efficient data fetching and caching
- Redux Toolkit with persistence
- Redis caching support
- Optimized builds with Turbopack
- Vercel Analytics & Speed Insights

---

## ⚙️ Tech Stack

### 📦 **Core Framework**
| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.0.10 | App Router, SSR, API Routes |
| React | 19.1.0 | UI Components |
| Tailwind CSS | 4.x | Utility-first styling |

### 🎨 **UI Libraries**
- **MUI (Material UI) 7** - Component library
- **Radix UI** - Headless accessible primitives
- **shadcn/ui** - Styled component system
- **Lucide React** & **React Icons** - Icon sets
- **Swiper** - Touch slider/carousel

### 🧠 **State & Data Management**
- **Redux Toolkit** - Global state management
- **Redux Persist** - State persistence
- **TanStack Query** - Data fetching & caching
- **React Hook Form** + **Zod** - Form handling & validation

### 📂 **Backend & Database**
- **MongoDB** + **Mongoose** - Database & ODM
- **Redis** - Caching & rate limiting
- **JWT (jose)** - Authentication tokens
- **bcrypt** - Password hashing
- **Stripe** - Payment processing

### 🛠️ **Utilities**
- **Cloudinary** - Media management
- **CKEditor 5** - Rich text editing
- **Nodemailer** - Email sending
- **Day.js** - Date formatting
- **Fuse.js** - Fuzzy search
- **Recharts** - Data visualization
- **XSS** - Security sanitization

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.x or higher
- **pnpm** (recommended) or npm/yarn
- **MongoDB** database
- **Redis** (optional, for caching)
- **Stripe** account
- **Cloudinary** account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/nextjs-ecommerce.git
   cd nextjs-ecommerce
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your credentials (see [Environment Variables](#-environment-variables))

4. **Run the development server**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
pnpm build
pnpm start
```

---

## 🔐 Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Stripe
STRIPE_SECRET_KEY=sk_live_xxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# Redis (Optional)
REDIS_URL=redis://localhost:6379

# Email (Nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 📦 Project Structure

```
├── app/
│   ├── (root)/
│   │   ├── (admin)/          # Admin dashboard pages
│   │   ├── (website)/        # Storefront pages
│   │   └── auth/             # Authentication pages
│   ├── api/                  # API routes
│   │   ├── auth/             # Authentication endpoints
│   │   ├── category/         # Category CRUD
│   │   ├── coupon/           # Coupon management
│   │   ├── customers/        # Customer management
│   │   ├── dashboard/        # Analytics data
│   │   ├── media/            # Media management
│   │   ├── order/            # Order processing
│   │   ├── product/          # Product CRUD
│   │   ├── product-variant/  # Variant management
│   │   ├── review/           # Review system
│   │   ├── stripe/           # Payment webhooks
│   │   └── support/          # Support chat
│   ├── globals.css           # Global styles
│   ├── layout.jsx            # Root layout
│   └── robots.js             # SEO robots.txt
├── components/
│   ├── Application/          # App-specific components
│   ├── Common/               # Shared components
│   ├── Order/                # Order components
│   ├── SEO/                  # SEO components
│   └── ui/                   # UI primitives (shadcn)
├── Models/                   # Mongoose models
├── lib/                      # Utility functions
├── hooks/                    # Custom React hooks
├── store/                    # Redux store
│   └── reducer/              # Redux slices
├── email/                    # Email templates
└── public/                   # Static assets
```

---

## 🖼️ Screenshots

> 📸 Add your screenshots to a `screenshots/` folder and update the paths below.

| Page | Screenshot |
|------|------------|
| 🏠 Home Page | `![Home](./screenshots/home-page.png)` |
| 🛍️ Shop Page | `![Shop](./screenshots/shop-page.png)` |
| 📦 Product Details | `![Product](./screenshots/product-details.png)` |
| 🛒 Cart Page | `![Cart](./screenshots/cart-page.png)` |
| 💳 Checkout | `![Checkout](./screenshots/checkout-page.png)` |
| 📊 Admin Dashboard | `![Dashboard](./screenshots/admin-dashboard.png)` |
| 🗂️ Product Management | `![Products](./screenshots/products.png)` |
| 📷 Media Gallery | `![Media](./screenshots/media.png)` |
| 🧾 Order Details | `![Orders](./screenshots/order-details.png)` |

---

## 🔗 Demo & Links

| Resource | Link |
|----------|------|
| 🚀 **Live Demo** | [https://next-ecommerce-beta-mocha.vercel.app](https://next-ecommerce-beta-mocha.vercel.app) |
| 📹 **YouTube Tutorial** | [Developer Goswami](https://www.youtube.com/@developergoswami) |

### 🔑 Admin Demo Credentials

| Field | Value |
|-------|-------|
| Email | `admin@gmail.com` |
| Password | `Admin@2025` |
| OTP | `123456` |

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Write meaningful commit messages
- Update documentation as needed
- Add tests for new features

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👤 About the Creator

<div align="center">

### Developer Goswami

Passionate software developer creating beginner-friendly tutorials and in-depth coding videos.

[![YouTube](https://img.shields.io/badge/YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://www.youtube.com/@developergoswami)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/developer-goswami/)
[![Instagram](https://img.shields.io/badge/Instagram-E1306C?style=for-the-badge&logo=instagram&logoColor=white)](https://www.instagram.com/developer_goswami/)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Goswami2021Vaibhav)

</div>

---

<div align="center">

**⭐ Star this repo if you found it helpful!**

Made with ❤️ by Developer Goswami

</div>