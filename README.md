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
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)

#  WearPoint - Premium E-Commerce Platform

### Modern Full-Stack Online Store with Admin Dashboard

[![Live Demo](https://img.shields.io/badge/_Live_Demo-Visit_WearPoint-7c3aed?style=for-the-badge)](https://wearpoint-nu.vercel.app)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://wearpoint-nu.vercel.app)

</div>

---

##  Table of Contents

- [ Introduction](#-introduction)
- [ System Architecture & Diagrams](#-system-architecture--diagrams)
  - [ER Diagram](#1️⃣-entity-relationship-diagram-er-diagram)
  - [Data Flow Diagram](#2️⃣-data-flow-diagram-dfd)
  - [Sequence Diagram](#3️⃣-sequence-diagram---checkout--payment-flow)
  - [Admin Dashboard Flow](#4️⃣-admin-dashboard-flow)
- [ Features](#-features)
- [ Tech Stack](#️-tech-stack)
- [ Project Structure](#-project-structure)
- [ Getting Started](#-getting-started)
- [ Environment Variables](#-environment-variables)
- [ Screenshots](#-screenshots)
- [ Demo & Links](#-demo--links)
- [ Contributing](#-contributing)
- [ License](#-license)
- [ About the Creator](#-about-the-creator)

---

##  Introduction

**WearPoint** is a production-ready, full-featured eCommerce platform built with **Next.js 16** and **React 19** using the App Router architecture. This is a modern men's fashion store designed for premium quality clothing and lifestyle products.

The platform features a stunning storefront with advanced filtering, secure **Stripe** payment processing, comprehensive admin dashboard with analytics, real-time customer support chat, and robust JWT authentication with OTP verification.

Optimized for **performance**, **SEO**, and **scalability**, WearPoint demonstrates best practices in modern full-stack development including server-side rendering, API routes, Redis caching, and Cloudinary media management.

---

##  System Architecture & Diagrams

### 1 Entity Relationship Diagram (ER Diagram)

This diagram shows how all database entities are connected in the WearPoint system.

```mermaid
erDiagram
    USER ||--o{ ORDER : places
    USER ||--o{ REVIEW : writes
    USER ||--o{ SUPPORT_CHAT : creates
    
    CATEGORY ||--o{ PRODUCT : contains
    CATEGORY ||--o{ PRODUCT_VARIANT : categorizes
    
    PRODUCT ||--o{ PRODUCT_VARIANT : has
    PRODUCT ||--o{ REVIEW : receives
    PRODUCT }o--o{ MEDIA : uses
    
    PRODUCT_VARIANT }o--o{ MEDIA : displays
    PRODUCT_VARIANT ||--o{ ORDER_ITEM : ordered_as
    
    ORDER ||--|{ ORDER_ITEM : contains
    ORDER }o--|| COUPON : applies
    ORDER ||--o| STRIPE_PAYMENT : paid_via
    
    USER {
        ObjectId _id PK
        string role "user/admin"
        string name
        string email UK
        string password
        object avatar
        boolean isEmailVerified
        string phone
        string address
        date dateOfBirth
        string gender
    }
    
    PRODUCT {
        ObjectId _id PK
        string name
        string slug UK
        ObjectId category FK
        number mrp
        number sellingPrice
        number discountPercentage
        string sku UK
        array media FK
        string description
        number stock
    }
    
    PRODUCT_VARIANT {
        ObjectId _id PK
        string color
        string size
        string name
        ObjectId product FK
        ObjectId category FK
        number mrp
        number sellingPrice
        number discountPercentage
        string sku
        number stock
        array media FK
    }
    
    ORDER {
        ObjectId _id PK
        ObjectId userId FK
        string guestId
        string orderNumber UK
        object customerInfo
        object shippingAddress
        array items
        object pricing
        string paymentMethod
        string paymentStatus
        string orderStatus
        string couponCode
    }
    
    ORDER_ITEM {
        ObjectId productId FK
        ObjectId variantId FK
        string name
        string image
        string color
        string size
        number quantity
        number sellingPrice
    }
    
    CATEGORY {
        ObjectId _id PK
        string name UK
        string slug UK
    }
    
    MEDIA {
        ObjectId _id PK
        string asset_id
        string public_id
        string secure_url
        string thumbnail_url
        string filename
        string alt
        string title
    }
    
    REVIEW {
        ObjectId _id PK
        ObjectId product FK
        ObjectId user FK
        number rating
        string title
        string review
    }
    
    COUPON {
        ObjectId _id PK
        string code UK
        number discountPercentage
        number miniShoppingAmount
        date validity
    }
    
    SUPPORT_CHAT {
        ObjectId _id PK
        string ticketNumber UK
        object customerInfo
        string status
        array messages
        ObjectId assignedTo FK
    }
    
    STRIPE_PAYMENT {
        ObjectId _id PK
        string sessionId UK
        ObjectId orderId FK
        string status
        number amount
    }
    
    OTP {
        ObjectId _id PK
        string email
        string otp
        date expiresAt
    }
```

---

### 2 Data Flow Diagram (DFD)

This diagram shows how data flows through the WearPoint system architecture.

```mermaid
flowchart TB
    subgraph CLIENT[" Client Layer"]
        BROWSER[" Browser"]
        subgraph FRONTEND["Next.js Frontend"]
            PAGES[" Pages<br/>(App Router)"]
            COMPONENTS[" Components"]
            REDUX[" Redux Store"]
            QUERY[" React Query"]
        end
    end
    
    subgraph SERVER[" Server Layer"]
        subgraph API["Next.js API Routes"]
            AUTH_API[" Auth API"]
            PRODUCT_API[" Product API"]
            ORDER_API[" Order API"]
            PAYMENT_API[" Stripe API"]
            MEDIA_API[" Media API"]
            SUPPORT_API[" Support API"]
        end
        
        subgraph MIDDLEWARE[" Middleware"]
            JWT_AUTH["JWT Validation"]
            RATE_LIMIT["Rate Limiting"]
            XSS_FILTER["XSS Protection"]
        end
    end
    
    subgraph EXTERNAL[" External Services"]
        STRIPE[" Stripe<br/>Payment Gateway"]
        CLOUDINARY[" Cloudinary<br/>Media CDN"]
        SMTP[" SMTP<br/>Email Service"]
    end
    
    subgraph DATABASE[" Database Layer"]
        MONGODB[(" MongoDB<br/>Primary Database")]
        REDIS[(" Redis<br/>Cache & Rate Limit")]
    end
    
    %% Client to Server Flow
    BROWSER --> PAGES
    PAGES <--> COMPONENTS
    COMPONENTS <--> REDUX
    COMPONENTS <--> QUERY
    QUERY <--> API
    
    %% API Processing
    API --> MIDDLEWARE
    MIDDLEWARE --> AUTH_API
    MIDDLEWARE --> PRODUCT_API
    MIDDLEWARE --> ORDER_API
    MIDDLEWARE --> PAYMENT_API
    MIDDLEWARE --> MEDIA_API
    MIDDLEWARE --> SUPPORT_API
    
    %% Server to Database
    AUTH_API <--> MONGODB
    PRODUCT_API <--> MONGODB
    ORDER_API <--> MONGODB
    SUPPORT_API <--> MONGODB
    
    %% Caching
    MIDDLEWARE <--> REDIS
    PRODUCT_API <--> REDIS
    
    %% External Services
    PAYMENT_API <--> STRIPE
    MEDIA_API <--> CLOUDINARY
    AUTH_API --> SMTP
    ORDER_API --> SMTP
    
    %% Styling
    classDef clientStyle fill:#e1f5fe,stroke:#01579b
    classDef serverStyle fill:#f3e5f5,stroke:#7b1fa2
    classDef dbStyle fill:#e8f5e9,stroke:#2e7d32
    classDef externalStyle fill:#fff3e0,stroke:#e65100
    
    class BROWSER,PAGES,COMPONENTS,REDUX,QUERY clientStyle
    class AUTH_API,PRODUCT_API,ORDER_API,PAYMENT_API,MEDIA_API,SUPPORT_API,JWT_AUTH,RATE_LIMIT,XSS_FILTER serverStyle
    class MONGODB,REDIS dbStyle
    class STRIPE,CLOUDINARY,SMTP externalStyle
```

---

### 3️ Sequence Diagram - Checkout & Payment Flow

This diagram shows the step-by-step process of how a customer completes a purchase.

```mermaid
sequenceDiagram
    autonumber
    participant C as  Customer
    participant F as  Frontend
    participant R as  Redux Store
    participant A as  API Routes
    participant DB as  MongoDB
    participant S as  Stripe
    participant E as  Email Service
    
    Note over C,E:  Shopping Phase
    C->>F: Browse Products
    F->>A: GET /api/product
    A->>DB: Query Products
    DB-->>A: Products Data
    A-->>F: Product List
    F-->>C: Display Products
    
    C->>F: Add to Cart
    F->>R: Update Cart State
    R-->>F: Cart Updated
    F-->>C: Show Cart Badge
    
    Note over C,E:  Cart Verification
    C->>F: Go to Checkout
    F->>A: POST /api/cart-verification
    A->>DB: Verify Stock & Prices
    DB-->>A: Verification Result
    A-->>F: Cart Valid/Invalid
    
    alt Cart Invalid
        F-->>C: Show Stock/Price Changes
        C->>F: Update Cart
    end
    
    Note over C,E:  Payment Phase
    C->>F: Enter Shipping Info
    C->>F: Select Payment Method
    
    alt Card Payment via Stripe
        F->>A: POST /api/stripe/checkout
        A->>S: Create Checkout Session
        S-->>A: Session URL
        A-->>F: Redirect URL
        F->>S: Redirect to Stripe
        C->>S: Enter Card Details
        S->>S: Process Payment
        S-->>C: Payment Success
        S->>A: Webhook: payment_intent.succeeded
        A->>DB: Update Payment Status
        A->>DB: Create/Update Order
    else Cash on Delivery
        F->>A: POST /api/order
        A->>DB: Create Order (pending)
        A->>DB: Decrease Stock
    end
    
    Note over C,E:  Confirmation Phase
    DB-->>A: Order Created
    A->>E: Send Order Confirmation
    E-->>C: Email: Order Confirmed
    A-->>F: Order Success Response
    F->>R: Clear Cart
    F-->>C: Show Success Page
    
    Note over C,E:  Order Tracking
    C->>F: View My Orders
    F->>A: GET /api/order
    A->>DB: Fetch User Orders
    DB-->>A: Orders List
    A-->>F: Orders Data
    F-->>C: Display Orders
```

---

### 4️ Admin Dashboard Flow

```mermaid
flowchart LR
    subgraph ADMIN[" Admin Panel"]
        LOGIN[" Admin Login"]
        DASH[" Dashboard"]
        
        subgraph MANAGE[" Management"]
            PROD[" Products"]
            CAT[" Categories"]
            ORD[" Orders"]
            CUST[" Customers"]
            REV[" Reviews"]
            COUP[" Coupons"]
            MED[" Media"]
            SUP[" Support"]
        end
    end
    
    subgraph ACTIONS[" Actions"]
        CRUD["CRUD Operations"]
        UPLOAD[" Upload Media"]
        STATUS[" Update Status"]
        REPLY[" Reply Chat"]
        EXPORT[" Export Data"]
    end
    
    subgraph DATA[" Data Layer"]
        API["API Routes"]
        DB[("MongoDB")]
        CDN["Cloudinary CDN"]
    end
    
    LOGIN --> DASH
    DASH --> PROD & CAT & ORD & CUST & REV & COUP & MED & SUP
    
    PROD --> CRUD
    CAT --> CRUD
    ORD --> STATUS
    CUST --> EXPORT
    REV --> STATUS
    COUP --> CRUD
    MED --> UPLOAD
    SUP --> REPLY
    
    CRUD --> API
    UPLOAD --> CDN
    STATUS --> API
    REPLY --> API
    EXPORT --> API
    
    API <--> DB
    CDN --> DB
```

---

##  Features

###  **Storefront (Customer-Facing)**
| Feature | Description |
|---------|-------------|
|  Dynamic Homepage | Featured products, banners, and categories |
|  Advanced Search | Fuzzy search with Fuse.js |
|  Product Filtering | Filter by category, price, size, color |
|  Product Variants | Multiple sizes, colors per product |
|  Rich Descriptions | CKEditor 5 powered content |
|  Responsive Design | Mobile-first, all devices |
|  Product Reviews | Customer ratings and reviews |

### 🛒 **Cart & Checkout**
| Feature | Description |
|---------|-------------|
|  Persistent Cart | Cart saved across sessions |
|  Cart Verification | Real-time stock validation |
|  Coupon Codes | Discount code support |
|  Stripe Payments | Secure card processing |
|  Order Confirmation | Email notifications |
|  Order Tracking | Track order status |

###  **User Authentication**
| Feature | Description |
|---------|-------------|
|  JWT Authentication | Secure token-based auth |
|  Email/Password | Traditional registration |
|  OAuth/SSO | Social login support |
|  OTP Verification | Email OTP for security |
|  Password Reset | Secure password recovery |
|  Profile Management | Update personal info & avatar |

###  **Admin Dashboard**
| Feature | Description |
|---------|-------------|
|  Analytics Dashboard | Sales, orders, revenue charts |
|  Dark/Light Theme | Theme toggle support |
|  Product Management | Full CRUD with variants |
|  Category Management | Create and manage categories |
|  Order Management | View, update, track orders |
|  Customer Management | View customer list and details |
|  Media Gallery | Cloudinary-powered media library |
|  Coupon Management | Create and manage coupons |
|  Review Moderation | Approve/reject reviews |
|  Customer Support | Real-time chat system |
|  Trash/Recovery | Soft delete with recovery |

###  **Media & UI**
| Feature | Description |
|---------|-------------|
|  Cloudinary CDN | Optimized image hosting |
|  Next.js Image | Automatic image optimization |
|  Tailwind + MUI | Modern UI components |
|  Theme Support | Dark/Light mode |
|  Radix UI | Accessible primitives |
|  Animations | Smooth transitions |

###  **Performance & Security**
| Feature | Description |
|---------|-------------|
|  React Query | Efficient data caching |
|  Redux Persist | State persistence |
|  Redis Caching | Rate limiting & caching |
|  XSS Protection | Input sanitization |
|  CSP Headers | Security headers |
|  Vercel Analytics | Performance monitoring |

---

## ⚙️ Tech Stack

###  **Core Framework**
| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.0.10 | App Router, SSR, API Routes |
| React | 19.1.0 | UI Components |
| Tailwind CSS | 4.x | Utility-first styling |

###  **UI Libraries**
| Library | Purpose |
|---------|---------|
| MUI (Material UI) 7 | Component library |
| Radix UI | Headless accessible primitives |
| shadcn/ui | Styled component system |
| Lucide React | Icon library |
| React Icons | Additional icons |
| Swiper | Touch slider/carousel |

###  **State & Data**
| Library | Purpose |
|---------|---------|
| Redux Toolkit | Global state management |
| Redux Persist | State persistence |
| TanStack Query | Data fetching & caching |
| React Hook Form | Form handling |
| Zod | Schema validation |

###  **Backend & Database**
| Technology | Purpose |
|------------|---------|
| MongoDB + Mongoose | Database & ODM |
| Redis | Caching & rate limiting |
| JWT (jose) | Authentication tokens |
| bcrypt | Password hashing |
| Stripe | Payment processing |
| Nodemailer | Email sending |

###  **Utilities**
| Library | Purpose |
|---------|---------|
| Cloudinary | Media management |
| CKEditor 5 | Rich text editing |
| Day.js | Date formatting |
| Fuse.js | Fuzzy search |
| Recharts | Data visualization |
| XSS | Security sanitization |
| Slugify | URL-friendly slugs |

---

##  Project Structure

```
MERN_E-COM/
├── 📂 app/
│   ├── 📂 (root)/
│   │   ├── 📂 (admin)/admin/       # Admin Dashboard Pages
│   │   │   ├── 📂 category/        # Category management
│   │   │   ├── 📂 coupon/          # Coupon management
│   │   │   ├── 📂 customers/       # Customer management
│   │   │   ├── 📂 dashboard/       # Analytics dashboard
│   │   │   ├── 📂 media/           # Media gallery
│   │   │   ├── 📂 orders/          # Order management
│   │   │   ├── 📂 product/         # Product management
│   │   │   ├── 📂 product-variant/ # Variant management
│   │   │   ├── 📂 reviews/         # Review moderation
│   │   │   ├── 📂 support/         # Customer support
│   │   │   └── 📂 trash/           # Deleted items
│   │   │
│   │   ├── 📂 (website)/           # Storefront Pages
│   │   │   ├── 📂 about/           # About page
│   │   │   ├── 📂 cart/            # Shopping cart
│   │   │   ├── 📂 checkout/        # Checkout page
│   │   │   ├── 📂 my-account/      # User profile
│   │   │   ├── 📂 my-orders/       # Order history
│   │   │   ├── 📂 order/           # Order details
│   │   │   ├── 📂 product/         # Product details
│   │   │   ├── 📂 shop/            # Product listing
│   │   │   ├── 📂 payment-success/ # Payment success
│   │   │   ├── 📂 payment-cancel/  # Payment cancel
│   │   │   ├── 📂 privacy-policy/  # Privacy policy
│   │   │   ├── 📂 return-policy/   # Return policy
│   │   │   └── 📂 terms-conditions/# Terms page
│   │   │
│   │   └── 📂 auth/                # Authentication Pages
│   │       ├── 📂 login/           # Login page
│   │       ├── 📂 register/        # Registration page
│   │       └── 📂 reset-password/  # Password reset
│   │
│   ├── 📂 api/                     # API Routes (20+ endpoints)
│   │   ├── 📂 auth/                # Authentication APIs
│   │   ├── 📂 category/            # Category CRUD
│   │   ├── 📂 coupon/              # Coupon APIs
│   │   ├── 📂 customers/           # Customer APIs
│   │   ├── 📂 dashboard/           # Analytics APIs
│   │   ├── 📂 media/               # Media upload APIs
│   │   ├── 📂 order/               # Order processing
│   │   ├── 📂 product/             # Product CRUD
│   │   ├── 📂 product-variant/     # Variant APIs
│   │   ├── 📂 review/              # Review APIs
│   │   ├── 📂 stripe/              # Payment webhooks
│   │   ├── 📂 support/             # Support chat APIs
│   │   └── 📂 user/                # User APIs
│   │
│   ├── 📄 layout.jsx               # Root layout
│   ├── 📄 globals.css              # Global styles
│   ├── 📄 robots.js                # SEO robots.txt
│   └── 📄 sitemap.js               # Dynamic sitemap
│
├── 📂 components/
│   ├── 📂 Application/             # App-specific components
│   │   ├── 📂 Admin/               # Admin dashboard components
│   │   └── 📂 Website/             # Storefront components
│   ├── 📂 Common/                  # Shared components
│   ├── 📂 Order/                   # Order components
│   ├── 📂 SEO/                     # SEO components
│   └── 📂 ui/                      # UI primitives (shadcn)
│
├── 📂 Models/                      # Mongoose Models
│   ├── 📄 user.models.js           # User model
│   ├── 📄 Product.model.js         # Product model
│   ├── 📄 Product.Variant.model.js # Variant model
│   ├── 📄 Order.model.js           # Order model
│   ├── 📄 category.model.js        # Category model
│   ├── 📄 Coupon.model.js          # Coupon model
│   ├── 📄 Review.model.js          # Review model
│   ├── 📄 Media.model.js           # Media model
│   ├── 📄 Otp.model.js             # OTP model
│   ├── 📄 StripePayment.model.js   # Payment model
│   └── 📄 SupportChat.model.js     # Support chat model
│
├── 📂 lib/                         # Utility functions (23 files)
├── 📂 hooks/                       # Custom React hooks
├── 📂 store/                       # Redux store
│   └── 📂 reducer/                 # Redux slices
├── 📂 email/                       # Email templates
├── 📂 public/assets/               # Static assets
│   ├── 📂 images/                  # Site images
│   ├── 📂 screenshots/             # App screenshots
│   └── 📂 email/                   # Email assets
│
├── 📄 package.json
├── 📄 next.config.mjs
├── 📄 tailwind.config.js
└── 📄 README.md
```

---

##  Getting Started

### Prerequisites

- **Node.js** 18.x or higher
- **pnpm** 10.x (recommended) or npm/yarn
- **MongoDB** database (local or Atlas)
- **Redis** (optional, for caching)
- **Stripe** account
- **Cloudinary** account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/CodeCommandBD/wearpoint.git
   cd wearpoint
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Configure your `.env.local` (see [Environment Variables](#-environment-variables))

4. **Run the development server**
   ```bash
   pnpm dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
pnpm build
pnpm start
```

---



```
 Environment Variables
Create a `.env.local` file in the root directory
# ===========================================
#  DATABASE
# ===========================================
MONGODB_URI=

# ===========================================
#  AUTHENTICATION
# ===========================================
JWT_SECRET=
# ===========================================
#  CLOUDINARY
# ===========================================
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# ===========================================
#  STRIPE
# ===========================================
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

# ===========================================
#  REDIS (Optional)
# ===========================================
REDIS_URL=

# ===========================================
#  EMAIL (SMTP)
# ===========================================
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
# ===========================================
#  APP URL
# ===========================================
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_APP_URL=
```

---

##  Screenshots

###  Storefront Pages

| Page | Screenshot |
|------|------------|
|  **Home Page** | ![Home Page](./public/assets/screenshots/home%20page.png) |
|  **Shop Page** | ![Shop Page](./public/assets/screenshots/shop%20page.png) |
|  **Product Details** | ![Product Details](./public/assets/screenshots/product%20details%20page.png) |
|  **Cart Page** | ![Cart Page](./public/assets/screenshots/cart%20page.png) |
|  **Checkout Page** | ![Checkout Page](./public/assets/screenshots/checkout%20page.png) |
|  **Order Page** | ![Order Page](./public/assets/screenshots/order%20page.png) |

###  User Authentication

| Page | Screenshot |
|------|------------|
|  **Login Page** | ![Login Page](./public/assets/screenshots/login%20page.png) |
|  **Sign Up Page** | ![Sign Up Page](./public/assets/screenshots/sign%20up%20page.png) |
|  **Verify Page** | ![Verify Page](./public/assets/screenshots/verify%20page.png) |
|  **Profile Page** | ![Profile Page](./public/assets/screenshots/profile%20page.png) |

###  Customer Support

| Page | Screenshot |
|------|------------|
|  **Customer Support** | ![Customer Support](./public/assets/screenshots/customer%20support%20.png) |

###  Admin Dashboard

| Page | Screenshot |
|------|------------|
|  **Dashboard (Dark)** | ![Admin Dashboard Dark](./public/assets/screenshots/admin%20dashboard%20dark%20mode.png) |
|  **Dashboard (Light)** | ![Admin Dashboard Normal](./public/assets/screenshots/admin%20dashboard%20normal.png) |

###  Admin - Product Management

| Page | Screenshot |
|------|------------|
|  **Add Product** | ![Add Product](./public/assets/screenshots/admin%20add%20product.png) |
|  **Product Variants** | ![Product Variants](./public/assets/screenshots/admin%20product%20variants.png) |

###  Admin - Category Management

| Page | Screenshot |
|------|------------|
|  **Add Category** | ![Add Category](./public/assets/screenshots/admin%20add%20category.png) |
|  **All Categories** | ![All Categories](./public/assets/screenshots/admin%20all%20category.png) |

###  Admin - Media & Orders

| Page | Screenshot |
|------|------------|
|  **Media Gallery** | ![Media Gallery](./public/assets/screenshots/admin%20media.png) |
|  **Order Management** | ![Order Management](./public/assets/screenshots/admin%20order.png) |

###  Admin - Support

| Page | Screenshot |
|------|------------|
|  **Customer Support** | ![Admin Customer Support](./public/assets/screenshots/admin%20customer%20support.png) |

---

##  Demo & Links

| Resource | Link |
|----------|------|
|  **Live Demo** | [https://wearpoint-nu.vercel.app](https://wearpoint-nu.vercel.app) |
|  **Support Email** | [shantokumar00@gmail.com](mailto:support@wearpoint.com) |
|  **Phone** | +8801638063569 |
|  **Location** | Uttara, Dhaka 1207, Bangladesh |



## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit** your changes
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push** to the branch
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open** a Pull Request

### Development Guidelines

- Follow the existing code style
- Write meaningful commit messages
- Update documentation as needed
- Test your changes thoroughly

---

## 📄 License

This project is **proprietary software**. All rights reserved.

⚠️ **Commercial License Required** - This software may not be copied, modified, distributed, or sold without express written permission from the copyright holder.

For licensing inquiries, please contact: shantokumar00@gmail.com

See the [LICENSE](LICENSE) file for complete terms.

---

##  About the Creator

<div align="center">

###  CodeCommandBD

Full-stack developer specializing in modern web technologies. Building premium e-commerce solutions with Next.js, React, and Node.js.

[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/CodeCommandBD)
[![Website](https://img.shields.io/badge/Website-7c3aed?style=for-the-badge&logo=vercel&logoColor=white)](https://wearpoint-nu.vercel.app)

---

###  Contact

| Channel | Contact |
|---------|---------|
| 📧 Email | shantokumar00@gmail.com |
| 🌐 Website | [wearpoint-nu.vercel.app](https://wearpoint-nu.vercel.app) |
| 📍 Location | Uttara, Dhaka, Bangladesh |

</div>

---

<div align="center">

**⭐ Star this repo if you found it helpful!**

---

**WearPoint.Ltd** © 2025 - All Rights Reserved

Made with ❤️ in Bangladesh

</div>
