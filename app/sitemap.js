import { connectDB } from "@/lib/dbConnection";
import Product from "@/Models/Product.model";
import Category from "@/Models/category.model";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://wearpoint-nu.vercel.app";

export default async function sitemap() {
  // IMPORTANT: DB connect only here
  await connectDB();

  const now = new Date();

  // ✅ Static pages (SEO-safe only)
  const staticPages = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/shop`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    // ❌ cart page বাদ (SEO best practice)
    {
      url: `${BASE_URL}/privacy-policy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terms-conditions`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/return-policy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // ✅ Product pages
  let productPages = [];
  try {
    const products = await Product.find({ deletedAt: null })
      .select("slug updatedAt")
      .lean();

    productPages = products.map((p) => ({
      url: `${BASE_URL}/product/${p.slug}`,
      lastModified: p.updatedAt || now,
      changeFrequency: "weekly",
      priority: 0.7,
    }));
  } catch (err) {
    console.error("Sitemap product error:", err);
  }

  // ✅ Category pages
  let categoryPages = [];
  try {
    const categories = await Category.find({ deletedAt: null })
      .select("slug updatedAt")
      .lean();

    categoryPages = categories.map((c) => ({
      url: `${BASE_URL}/shop/category/${c.slug}`,
      lastModified: c.updatedAt || now,
      changeFrequency: "weekly",
      priority: 0.6,
    }));
  } catch (err) {
    console.error("Sitemap category error:", err);
  }

  return [...staticPages, ...productPages, ...categoryPages];
}
