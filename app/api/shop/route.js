import { connectDB } from "@/lib/dbConnection";
import { catchError, res } from "@/lib/helper";
import CategoryModel from "@/Models/category.model";
import ProductModel from "@/Models/Product.model";

export async function GET(request) {
  try {
    await connectDB();
    const searchParams = request.nextUrl.searchParams;

    // Filters
    const size = searchParams.get("size");
    const categorySlug = searchParams.get("category");
    const color = searchParams.get("color");
    const minPrice = parseInt(searchParams.get("minPrice")) || 0;
    const maxPrice = parseInt(searchParams.get("maxPrice")) || 0;
    const search = searchParams.get("q");

    // Sort
    const sort = searchParams.get("sort") || "default_sorting";
    let sortQuery = {};
    if (sort === "default_sorting") {
      sortQuery = { createdAt: -1 };
    } else if (sort === "asc") {
      sortQuery = { name: 1 };
    } else if (sort === "desc") {
      sortQuery = { name: -1 };
    } else if (sort === "price_asc") {
      sortQuery = { price: 1 };
    } else if (sort === "price_desc") {
      sortQuery = { price: -1 };
    }

    // Pagination
    const page = parseInt(searchParams.get("page")) || 0;
    const limit = parseInt(searchParams.get("limit")) || 9;
    const skip = page * limit;

    // find category by slug
    let categoryId = null;
    if (categorySlug) {
      const categoryData = await CategoryModel.findOne({
        deletedAt: null,
        slug: categorySlug,
      })
        .select("_id")
        .lean();
      if (categoryData) {
        categoryId = categoryData._id;
      }
    }

    // match stage
    let matchStage = {};
    if (categoryId) {
      matchStage.category = categoryId;
    }
    if (search) {
      matchStage.name = { $regex: search, $options: "i" };
    }

    // aggregation pipeline
    const products = await ProductModel.aggregate([
      {
        $match: matchStage,
      },
      {
        $sort: sortQuery,
      },
      {
        $skip: skip,
      },
      {
        $limit: limit + 1,
      },
      {
        $lookup: {
          from: "productvariants",
          localField: "_id",
          foreignField: "product",
          as: "variants",
        },
      },
      {
        $addFields: {
          variants: {
            $filter: {
              input: "$variants",
              as: "variant",
              cond: {
                $and: [
                  size ? { $eq: ["$$variant.size", size] } : { $literal: true },
                  color
                    ? { $eq: ["$$variant.color", color] }
                    : { $literal: true },
                  minPrice > 0
                    ? { $gte: ["$$variant.sellingPrice", minPrice] }
                    : { $literal: true },
                  maxPrice > 0
                    ? { $lte: ["$$variant.sellingPrice", maxPrice] }
                    : { $literal: true },
                ],
              },
            },
          },
        },
      },
      {
        $match: {
          "variants.0": { $exists: true },
        },
      },
      {
        $lookup: {
          from: "medias",
          localField: "media",
          foreignField: "_id",
          as: "media",
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          slug: 1,
          mrp: 1,
          discountPercentage: 1,
          sellingPrice: 1,
          media: {
            _id: 1,
            secure_url: 1,
            alt: 1,
          },
          variants: {
            color: 1,
            size: 1,
            sellingPrice: 1,
            discountPercentage: 1,
            mrp: 1,
          },
        },
      },
    ]);

    // check if more data exists
    let nextpage = null;
    if (products.length > limit) {
      nextpage = page + 1;
      products.pop();
    }
    return res(true, 200, "Products fetched successfully", products, nextpage);
  } catch (error) {
    return catchError(error);
  }
}
