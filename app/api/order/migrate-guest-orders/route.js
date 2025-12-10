import { connectDB } from "@/lib/dbConnection";
import { isAuthenticated } from "@/lib/authentication";
import { res } from "@/lib/helper";
import OrderModel from "@/Models/Order.model";

/**
 * Migrate guest orders to authenticated user
 * Called after user logs in to attach guest orders to their account
 */
export async function POST(request) {
  try {
    const auth = await isAuthenticated();
    
    if (!auth.isAuth) {
      return res(false, 401, "User not authenticated");
    }

    await connectDB();

    const body = await request.json();
    const { guestId } = body;

    if (!guestId) {
      return res(false, 400, "Guest ID is required");
    }

    // Find all orders with this guestId and no userId
    const guestOrders = await OrderModel.find({
      guestId: guestId,
      userId: null,
      deletedAt: null,
    });

    if (guestOrders.length === 0) {
      return res(true, 200, "No guest orders to migrate", { migratedCount: 0 });
    }

    // Update all guest orders with the user's ID
    const updateResult = await OrderModel.updateMany(
      {
        guestId: guestId,
        userId: null,
        deletedAt: null,
      },
      {
        userId: auth._id,
      }
    );

    console.log(
      `Migrated ${updateResult.modifiedCount} guest orders for user ${auth._id} with guestId ${guestId}`
    );

    return res(true, 200, "Guest orders migrated successfully", {
      migratedCount: updateResult.modifiedCount,
    });
  } catch (error) {
    console.error("Error migrating guest orders:", error);
    return res(
      false,
      500,
      error.message || "Failed to migrate guest orders"
    );
  }
}
