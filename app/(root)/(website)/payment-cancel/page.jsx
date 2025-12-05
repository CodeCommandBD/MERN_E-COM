"use client";
import Link from "next/link";
import { XCircle, ShoppingCart, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WEBSITE_CHECKOUT, WEBSITE_SHOP } from "@/Routes/WebsiteRoute";

export default function PaymentCancel() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white border border-gray-300 rounded-lg p-8 md:p-12 text-center">
        {/* Icon */}
        <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-12 h-12 text-orange-600" />
        </div>

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
          Payment Cancelled
        </h1>

        {/* Description */}
        <p className="text-gray-600 mb-8">
          Your payment was cancelled. No charges were made to your card. You can
          try again or choose a different payment method.
        </p>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button asChild className="w-full" size="lg">
            <Link href={WEBSITE_CHECKOUT}>
              <ArrowLeft className="w-5 h-5 mr-2" />
              Return to Checkout
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full" size="lg">
            <Link href={WEBSITE_SHOP}>
              <ShoppingCart className="w-5 h-5 mr-2" />
              Continue Shopping
            </Link>
          </Button>
        </div>

        {/* Help Text */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Need help?{" "}
            <a
              href="mailto:support@example.com"
              className="text-primary hover:underline font-medium"
            >
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
