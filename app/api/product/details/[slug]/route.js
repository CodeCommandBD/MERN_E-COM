import { connectDB } from "@/lib/dbConnection";
import { catchError, res } from "@/lib/helper";
import ProductModel from "@/Models/Product.model";
import MediaModel from "@/Models/Media.model";
import ProductVariantModel from "@/Models/Product.Variant.model";
import ReviewModel from "@/Models/Review.model";

export async function GET(request, { params }) {
  try {
    await connectDB();

    const getProduct = await params;
    const slug = getProduct.slug;

    const searchParams = await request.nextUrl.searchParams;
    const color = searchParams.get("color");
    const size = searchParams.get("size");

    const filter = {
      deletedAt: null,
    };

    if (!slug) {
      return res(false, 404, "Product not found.");
    }

    filter.slug = slug;

    // get product
    const product = await ProductModel.findOne(filter)
      .populate("media", "secure_url")
      .lean();

    if (!product) {
      return res(false, 404, "Product not found.");
    }

    // get product variant
    const variantFilter = {
      product: product._id,
    };

    if (size) {
      variantFilter.size = size;
    }
    if (color) {
      variantFilter.color = color;
    }

    const variant = await ProductVariantModel.findOne(variantFilter)
      .populate("media", "secure_url")
      .lean();

    if (!variant) {
      return res(false, 404, "Variant not found.");
    }

    // get color and size

    const getColor = await ProductVariantModel.distinct("color", {
      product: product._id,
    });
    const getSize = await ProductVariantModel.aggregate([
      { $match: { product: product._id } },
      { $sort: { size: 1 } },
      {
        $group: {
          _id: "$size",
          first: { $first: "$size" },
        },
      },
      { $sort: { first: 1 } },
      { $project: { _id: 0, size: "$_id" } },
    ]);

    // get review

    const review = await ReviewModel.countDocuments({
      product: product._id,
    });

    const productData = {
      products: product,
      variant: variant,
      getColor: getColor,
      getSize: getSize.length ? getSize.map((item) => item.size) : [],
      reviewCount: review,
    };

    return res(true, 200, "Product found.", productData);
  } catch (error) {
    return catchError(error);
  }
}
