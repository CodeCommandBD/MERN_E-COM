import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  variantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProductVariant",
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    required: true,
  },
  mrp: {
    type: Number,
    required: true,
  },
  sellingPrice: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  url: {
    type: String,
    required: true,
  },
});

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    // Guest identifier - used to track guest orders before login
    guestId: {
      type: String,
      default: null,
    },
    orderNumber: {
      type: String,
      unique: true,
    },
    // Customer Information
    customerInfo: {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      email: {
        type: String,
        required: true,
        trim: true,
      },
      phone: {
        type: String,
        required: true,
        trim: true,
      },
    },
    // Shipping Address
    shippingAddress: {
      landmark: {
        type: String,
        required: true,
        trim: true,
      },
      city: {
        type: String,
        required: true,
        trim: true,
      },
      state: {
        type: String,
        required: true,
        trim: true,
      },
      country: {
        type: String,
        required: true,
        trim: true,
      },
      pincode: {
        type: String,
        required: true,
        trim: true,
      },
    },
    // Order Items
    items: [orderItemSchema],
    // Pricing
    pricing: {
      subtotal: {
        type: Number,
        required: true,
      },
      discount: {
        type: Number,
        default: 0,
      },
      couponDiscount: {
        type: Number,
        default: 0,
      },
      shippingFee: {
        type: Number,
        default: 0,
      },
      total: {
        type: Number,
        required: true,
      },
    },
    // Payment Information
    paymentMethod: {
      type: String,
      required: true,
      enum: ["cash", "card"],
    },
    paymentStatus: {
      type: String,
      required: true,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    transactionId: {
      type: String,
      default: null,
    },
    // Order Status
    orderStatus: {
      type: String,
      required: true,
      enum: [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },
    // Additional Information
    orderNote: {
      type: String,
      trim: true,
      default: "",
    },
    couponCode: {
      type: String,
      trim: true,
      default: null,
    },
    // Timestamps for tracking
    paidAt: {
      type: Date,
      default: null,
    },
    shippedAt: {
      type: Date,
      default: null,
    },
    deliveredAt: {
      type: Date,
      default: null,
    },
    cancelledAt: {
      type: Date,
      default: null,
    },
    deletedAt: {
      type: Date,
      default: null,
      index: true,
    },
  },
  { timestamps: true }
);

// Generate order number before saving
orderSchema.pre("save", async function (next) {
  if (this.isNew && !this.orderNumber) {
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    this.orderNumber = `ORD-${timestamp}-${random}`;
  }
  next();
});

// Performance indexes for common queries
orderSchema.index({ userId: 1, orderStatus: 1 });
orderSchema.index({ orderStatus: 1, createdAt: -1 });
orderSchema.index({ "customerInfo.email": 1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ createdAt: -1 });

const OrderModel =
  mongoose.models.Order || mongoose.model("Order", orderSchema);

export default OrderModel;
