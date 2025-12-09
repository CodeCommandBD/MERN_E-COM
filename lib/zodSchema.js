import { z } from "zod";

export const zSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .min(2, { message: "Name must be at least 2 characters" })
    .max(50, { message: "Name must be at most 50 characters" }),

  email: z
    .string()
    .email({ message: "Invalid email address" })
    .min(5, { message: "Email must be at least 5 characters" })
    .max(100, { message: "Email must be at most 100 characters" }),

  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .max(128, { message: "Password must be at most 128 characters" })
    .refine((val) => /[a-z]/.test(val), {
      message: "Password must contain at least one lowercase letter",
    })
    .refine((val) => /[A-Z]/.test(val), {
      message: "Password must contain at least one uppercase letter",
    })
    .refine((val) => /[0-9]/.test(val), {
      message: "Password must contain at least one number",
    })
    .refine((val) => /[^A-Za-z0-9]/.test(val), {
      message: "Password must contain at least one special character",
    }),

  otp: z
    .string()
    .regex(/^\d{6}$/, { message: "OTP must be exactly 6 digits (0-9)." }),

  _id: z.string().min(3, "_id is required."),
  alt: z.string().min(3, "Alt is required."),
  title: z.string().min(3, "Title is required."),
  slug: z.string().min(3, "Slug is required."),

  category: z.string().min(3, "Category is required."),
  mrp: z.union([
    z.number().positive("Expected a positive number"),
    z
      .string()
      .transform((val) => Number(val))
      .refine((val) => !isNaN(val) && val > 0, "please enter a valid number"),
  ]),
  sellingPrice: z.union([
    z.number().positive("Expected a positive number"),
    z
      .string()
      .transform((val) => Number(val))
      .refine((val) => !isNaN(val) && val > 0, "please enter a valid number"),
  ]),
  stock: z.union([
    z.number().min(0, "Stock cannot be negative"),
    z
      .string()
      .transform((val) => Number(val))
      .refine(
        (val) => !isNaN(val) && val >= 0,
        "Please enter a valid stock number"
      ),
  ]).optional().default(0),
  discountPercentage: z.union([
    z.number().min(0, "Discount cannot be negative"),
    z
      .string()
      .transform((val) => Number(val))
      .refine((val) => !isNaN(val) && val >= 0, "please enter a valid number"),
  ]),
  media: z.array(z.string()),
  description: z.string().min(3, "Description is required."),
  product: z.string().min(3, "Product is required."),
  color: z.string().min(3, "Color is required."),
  sku: z.string().min(3, "SKU is required."),
  size: z.string().min(1, "Size is required."),

  code: z.string().min(3, "Code is required."),
  validity: z.coerce.date(),
  miniShoppingAmount: z.union([
    z.number().positive("Expected a positive number"),
    z
      .string()
      .transform((val) => Number(val))
      .refine((val) => !isNaN(val) && val > 0, "please enter a valid number"),
  ]),
  userId: z.string().min(3, "User ID is required."),
  rating: z.union([
    z.number().positive("Expected a positive number"),
    z
      .string()
      .transform((val) => Number(val))
      .refine((val) => !isNaN(val) && val > 0, "please enter a valid number"),
  ]),
  review: z.string().min(5, "Review must be at least 5 characters"),
  coupon: z.string().min(3, "Coupon is required."),
  phone: z.string().min(11, "Phone number must be at least 11 characters"),
  country: z.string().min(3, "Country is required."),
  state: z.string().min(3, "State is required."),
  city: z.string().min(3, "City is required."),
  pincode: z.string().min(3, "Pincode is required."),
  landmark: z.string().min(3, "Landmark is required."),

  orderNote: z.string().min(5, "Order note must be at least 5 characters"),
  paymentMethod: z.string().min(3, "Payment method is required."),
});
