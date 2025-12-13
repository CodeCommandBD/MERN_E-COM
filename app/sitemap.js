import { connectDB } from "@/lib/dbConnection";
import Product from "@/Models/Product.model";
import Category from "@/Models/category.model";

// Use the public site URL, not the API base, to avoid "/api" in sitemap links
const BASE_URL = "https://wearpoint-nu.vercel.app";

// const BASE_URL =
//   process.env.NEXT_PUBLIC_SITE_URL ||
//   process.env.NEXT_PUBLIC_APP_URL ||
//   (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export default async function sitemap() {
  // Connect to database
  await connectDB();

  // Static pages
  const staticPages = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/shop`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/cart`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
    // Policy pages
    {
      url: `${BASE_URL}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terms-conditions`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/return-policy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // Fetch all active (non-deleted) products
  let productPages = [];
  try {
    const products = await Product.find({ deletedAt: null })
      .select("slug updatedAt")
      .lean();

    productPages = products.map((product) => ({
      url: `${BASE_URL}/product/${product.slug}`,
      lastModified: product.updatedAt || new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    }));
  } catch (error) {
    console.error("Error fetching products for sitemap:", error);
  }

  // Fetch all active categories for category pages
  let categoryPages = [];
  try {
    const categories = await Category.find({ deletedAt: null })
      .select("slug updatedAt")
      .lean();

    categoryPages = categories.map((category) => ({
      url: `${BASE_URL}/shop/category/${category.slug}`,
      lastModified: category.updatedAt || new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    }));
  } catch (error) {
    console.error("Error fetching categories for sitemap:", error);
  }

  return [...staticPages, ...productPages, ...categoryPages];
}
