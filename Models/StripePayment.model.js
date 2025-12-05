import mongoose from "mongoose";

const stripePaymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    sessionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    paymentIntentId: {
      type: String,
      default: null,
    },
    customerId: {
      type: String,
      default: null,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
      default: "usd",
    },
    status: {
      type: String,
      required: true,
      enum: ["pending", "processing", "succeeded", "failed", "cancelled"],
      default: "pending",
    },
    customerEmail: {
      type: String,
      required: true,
      trim: true,
    },
    customerName: {
      type: String,
      required: true,
      trim: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    paymentCompletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const StripePaymentModel =
  mongoose.models.StripePayment ||
  mongoose.model("StripePayment", stripePaymentSchema);

export default StripePaymentModel;
