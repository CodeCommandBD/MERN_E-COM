import { connectDB } from "@/lib/dbConnection";
import CategoryModel from "@/Models/category.model";
import ProductVariantModel from "@/Models/Product.Variant.model";
import ShopContent from "./ShopContent";
import { getShopProducts } from "@/lib/actions/shop.action";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Shop All Products | Premium E-Commerce Store",
  description:
    "Browse our extensive collection of high-quality fashion items. Filter by category, size, color, and price to find exactly what you're looking for.",
};

export default async function ShopPage({ searchParams }) {
  await connectDB();

  // Parse searchParams if it's a promise (Next.js 15+ compat, though 14 passes object usually, good practice)
  const params = await searchParams;

  // Fetch Categories
  const categories = await CategoryModel.find({ deletedAt: null }).lean();

  // Fetch Colors
  const colors = await ProductVariantModel.distinct("color");

  // Fetch Sizes
  const sizeOrder = {
    XS: 1,
    S: 2,
    M: 3,
    L: 4,
    XL: 5,
    XXL: 6,
    XXXL: 7,
    "2XL": 8,
    "3XL": 9,
    "4XL": 10,
    "5XL": 11,
  };
  let sizes = await ProductVariantModel.distinct("size");
  sizes = sizes.sort((a, b) => (sizeOrder[a] || 999) - (sizeOrder[b] || 999));

  // Fetch Initial Products
  const { products: initialProducts, nextpage: initialNextPage } =
    await getShopProducts(params || {});

  // Serialize to ensure they are safe for client components
  const categoriesPlain = JSON.parse(JSON.stringify(categories));
  const colorsPlain = JSON.parse(JSON.stringify(colors));
  const sizesPlain = JSON.parse(JSON.stringify(sizes));

  return (
    <ShopContent
      categories={categoriesPlain}
      colors={colorsPlain}
      sizes={sizesPlain}
      initialProducts={initialProducts}
      initialNextPage={initialNextPage}
    />
  );
}
