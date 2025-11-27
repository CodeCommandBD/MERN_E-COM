import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/dbConnection";
import { catchError, res } from "@/lib/helper";
import ProductVariantModel from "@/Models/Product.Variant.model";

export async function PUT(request) {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return res(false, 403, "Unauthorized");
    }
    await connectDB();
    const payload = await request.json();

    const ids = payload.ids || [];
    const deleteType = payload.deleteType;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res(false, 400, "Invalid or empty id list.");
    }

    const product = await ProductVariantModel.find({
      _id: { $in: ids },
    }).lean();
    if (!product.length) {
      return res(false, 404, "Data not found.");
    }
    if (!["SD", "RSD"].includes(deleteType)) {
      return res(
        false,
        400,
        "Invalid delete operation. Delete type should be SD or RSD for this route"
      );
    }
    if (deleteType === "SD") {
      await ProductVariantModel.updateMany(
        { _id: { $in: ids } },
        { $set: { deletedAt: new Date().toISOString() } }
      );
    } else {
      await ProductVariantModel.updateMany(
        { _id: { $in: ids } },
        { $set: { deletedAt: null } }
      );
    }

    return res(
      true,
      200,
      deleteType === "SD" ? "Data Moved into trash." : "Data restored."
    );
  } catch (error) {
    return catchError(error);
  }
}

export async function DELETE(request) {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return res(false, 403, "Unauthorized");
    }
    await connectDB();
    const payload = await request.json();

    const ids = payload.ids || [];
    const deleteType = payload.deleteType;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res(false, 400, "Invalid or empty id list.");
    }

    const product = await ProductVariantModel.find({
      _id: { $in: ids },
    }).lean();
    if (!product.length) {
      return res(false, 404, "Data not found.");
    }
    if (deleteType !== "PD") {
      return res(
        false,
        400,
        "Invalid delete operation. Delete type should be PD for this route"
      );
    }

    await ProductVariantModel.deleteMany({ _id: { $in: ids } });

    return res(true, 200, "Data deleted permanently");
  } catch (error) {
    return catchError(error);
  }
}
