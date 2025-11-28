import { ADMIN_CATEGORY_ADD, ADMIN_CATEGORY_SHOW, ADMIN_COUPON_ADD, ADMIN_COUPON_SHOW, ADMIN_CUSTOMER_SHOW, ADMIN_DASHBOARD, ADMIN_MEDIA_SHOW, ADMIN_PRODUCT_ADD, ADMIN_PRODUCT_SHOW, ADMIN_PRODUCT_VARIANT_SHOW, ADMIN_REVIEW_SHOW } from "@/Routes/AdminPanelRoute";

const searchData = [
   {
       label: "Dashboard",
       description: "View website analytics and reports",
       url: ADMIN_DASHBOARD,
       keywords: ["dashboard", "overview", "analytics", "insights"]
   },
   {
       label: "Category",
       description: "Manage product categories",
       url: ADMIN_CATEGORY_SHOW,
       keywords: ["category", "product category"]
   },
   {
       label: "Add Category",
       description: "Add new product categories",
       url: ADMIN_CATEGORY_ADD,
       keywords: ["add category", "new category"]
   },
   {
       label: "Product",
       description: "Manage all product listings",
       url: ADMIN_PRODUCT_SHOW,
       keywords: ["products", "product list"]
   },
   {
       label: "Add Product",
       description: "Add a new product to the catalog",
       url: ADMIN_PRODUCT_ADD,
       keywords: ["new product", "add product"]
   },
   {
       label: "Product Variant",
       description: "Manage all product variants",
       url: ADMIN_PRODUCT_VARIANT_SHOW,
       keywords: ["products variants", "variants"]
   },
   {
       label: "Coupon",
       description: "Manage active discount coupons",
       url: ADMIN_COUPON_SHOW,
       keywords: ["discount", "promo", "coupon"]
   },
   {
       label: "Add Coupon",
       description: "Create a new discount coupon",
       url: ADMIN_COUPON_ADD,
       keywords: ["add coupon", "new coupon", "promotion", "offers"]
   },
   {
       label: "Orders",
       description: "Manage customer orders",
       url: '',
       keywords: ["orders"]
   },
   {
       label: "Customers",
       description: "View and manage customer information",
       url: ADMIN_CUSTOMER_SHOW,
       keywords: ["customers", "users"]
   },
   {
       label: "Review",
       description: "Manage customer reviews and feedback",
       url: ADMIN_REVIEW_SHOW,
       keywords: ["ratings", "feedback"]
   },

   {
       label: "Media",
       description: "Manage website media files",
       url: ADMIN_MEDIA_SHOW,
       keywords: ["images", "videos"]
   },

];

export default searchData;


