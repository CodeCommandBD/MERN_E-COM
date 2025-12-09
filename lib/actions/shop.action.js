import { connectDB } from "@/lib/dbConnection";
import { escapeRegex } from "@/lib/escapeRegex";
import CategoryModel from "@/Models/category.model";
import ProductModel from "@/Models/Product.model";

export async function getShopProducts(searchParams) {
  try {
    await connectDB();

    // Filters
    const size = searchParams.size;
    const categorySlug = searchParams.category;
    const color = searchParams.color;
    const minPrice = parseInt(searchParams.minPrice) || 0;
    const maxPrice = parseInt(searchParams.maxPrice) || 0;
    const search = searchParams.q;

    // Sort
    const sort = searchParams.sort || "default_sorting";
    let sortQuery = {};
    if (sort === "default_sorting") {
      sortQuery = { createdAt: -1 };
    } else if (sort === "asc") {
      sortQuery = { name: 1 };
    } else if (sort === "desc") {
      sortQuery = { name: -1 };
    } else if (sort === "price_asc") {
      sortQuery = { sellingPrice: 1 };
    } else if (sort === "price_desc") {
      sortQuery = { sellingPrice: -1 };
    }

    // Pagination
    const page = parseInt(searchParams.page) || 0;
    const limit = parseInt(searchParams.limit) || 9;
    const skip = page * limit;

    // find category by slug
    let categoryId = [];
    if (categorySlug) {
      const slugs = categorySlug.split(",");
      const categoryData = await CategoryModel.find({
        deletedAt: null,
        slug: { $in: slugs },
      })
        .select("_id")
        .lean();
      categoryId = categoryData.map((category) => category._id);
    }

    // match stage
    let matchStage = { deletedAt: null };
    if (categoryId.length > 0) {
      matchStage.category = { $in: categoryId };
    }
    if (search) {
      // Escape special regex chars to prevent ReDoS attacks
      matchStage.name = { $regex: escapeRegex(search), $options: "i" };
    }

    // Add price filter to matchStage for better performance
    if (minPrice > 0 || maxPrice > 0) {
      matchStage.sellingPrice = {};
      if (minPrice > 0) matchStage.sellingPrice.$gte = minPrice;
      if (maxPrice > 0) matchStage.sellingPrice.$lte = maxPrice;
    }

    // aggregation pipeline
    const hasColorOrSizeFilter = size || color;

    const pipeline = [
      {
        $match: matchStage,
      },
      {
        $lookup: {
          from: "productVariants",
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
                  size
                    ? { $in: ["$$variant.size", size.split(",")] }
                    : { $literal: true },
                  color
                    ? { $in: ["$$variant.color", color.split(",")] }
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
    ];

    // Only require matching variants if color/size filters are selected
    if (hasColorOrSizeFilter) {
      pipeline.push({
        $match: {
          "variants.0": { $exists: true },
        },
      });
    }

    pipeline.push(
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
          from: "medias",
          localField: "media",
          foreignField: "_id",
          as: "media",
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "categoryInfo",
        },
      },
      {
        $addFields: {
          variants: {
            $map: {
              input: "$variants",
              as: "variant",
              in: {
                $mergeObjects: [
                  "$$variant",
                  {
                    categoryName: {
                      $arrayElemAt: [
                        {
                          $map: {
                            input: {
                              $filter: {
                                input: "$categoryInfo",
                                as: "cat",
                                cond: {
                                  $eq: ["$$cat._id", "$$variant.category"],
                                },
                              },
                            },
                            as: "matchedCat",
                            in: "$$matchedCat.name",
                          },
                        },
                        0,
                      ],
                    },
                  },
                ],
              },
            },
          },
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
            categoryName: 1,
          },
        },
      }
    );

    const products = await ProductModel.aggregate(pipeline);

    // check if more data exists
    let nextpage = null;
    if (products.length > limit) {
      nextpage = page + 1;
      products.pop();
    }

    return {
      success: true,
      products: JSON.parse(JSON.stringify(products)),
      nextpage,
    };
  } catch (error) {
    console.error("getShopProducts error:", error);
    return { success: false, products: [], nextpage: null };
  }
}
