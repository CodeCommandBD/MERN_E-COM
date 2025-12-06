import dbConnection from "@/lib/dbConnection";
import Product from "@/Models/Product";
import Category from "@/Models/Category";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

export default async function sitemap() {
  // Connect to database
  await dbConnection();

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
  ];

  // Fetch all published products
  let productPages = [];
  try {
    const products = await Product.find({ status: "published" })
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

  // Fetch all categories for category pages
  let categoryPages = [];
  try {
    const categories = await Category.find({ status: "active" })
      .select("slug updatedAt")
      .lean();

    categoryPages = categories.map((category) => ({
      url: `${BASE_URL}/shop?category=${category.slug}`,
      lastModified: category.updatedAt || new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    }));
  } catch (error) {
    console.error("Error fetching categories for sitemap:", error);
  }

  return [...staticPages, ...productPages, ...categoryPages];
}
