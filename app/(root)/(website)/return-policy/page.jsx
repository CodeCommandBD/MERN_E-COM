import WebsiteBreadCrumb from "@/components/Application/Website/WebsiteBreadCrumb";

// SEO Metadata for Return Policy
export const metadata = {
  title: "Return Policy | E-Store",
  description:
    "Learn about E-Store's 7-day return policy. Easy returns and refunds for your peace of mind when shopping with us.",
  alternates: {
    canonical: "/return-policy",
  },
};

// ISR: Revalidate static pages every 15 minutes
export const revalidate = 900;

const breadcrumb = {
  title: "Return Policy",
  links: [{ label: "Return Policy", href: "/return-policy" }],
};

export default function ReturnPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <WebsiteBreadCrumb props={breadcrumb} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-8">
          Return Policy
        </h1>

        <div className="prose prose-lg max-w-none text-gray-700">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
            <p className="text-lg font-semibold text-green-800">
              7-Day Easy Return Policy
            </p>
            <p className="text-green-700 mt-2">
              We offer hassle-free returns within 7 days of delivery for a full
              refund or exchange.
            </p>
          </div>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              1. Return Eligibility
            </h2>
            <p>To be eligible for a return, items must be:</p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Unused, unwashed, and in original condition</li>
              <li>In original packaging with all tags attached</li>
              <li>Returned within 7 days of delivery</li>
              <li>Accompanied by proof of purchase (order confirmation)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              2. Non-Returnable Items
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Items marked as &quot;Final Sale&quot; or
                &quot;Non-Returnable&quot;
              </li>
              <li>Undergarments and intimate apparel</li>
              <li>Items damaged due to customer misuse</li>
              <li>Items without original tags or packaging</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              3. How to Initiate a Return
            </h2>
            <ol className="list-decimal pl-6 space-y-2">
              <li>
                Contact our customer support at support@estore.com or call
                +8801777777777
              </li>
              <li>Provide your order number and reason for return</li>
              <li>
                Our team will provide return instructions and arrange pickup
              </li>
              <li>Pack the item securely in its original packaging</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              4. Refund Process
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Refunds are processed within 5-7 business days after receiving
                the returned item
              </li>
              <li>
                For card payments, refunds will be credited to the original
                payment method
              </li>
              <li>
                For Cash on Delivery orders, refunds will be made via bank
                transfer
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              5. Exchanges
            </h2>
            <p>
              We offer free exchanges for different sizes or colors, subject to
              availability. Contact our support team to arrange an exchange.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              6. Damaged or Defective Items
            </h2>
            <p>
              If you receive a damaged or defective item, please contact us
              within 48 hours of delivery with photos of the damage. We will
              arrange a free replacement or full refund.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              7. Contact Us
            </h2>
            <p>For return-related queries, contact us:</p>
            <ul className="list-none mt-4 space-y-2">
              <li>
                <strong>Email:</strong> support@estore.com
              </li>
              <li>
                <strong>Phone:</strong> +8801777777777
              </li>
              <li>
                <strong>Hours:</strong> 10:00 AM - 8:00 PM (Saturday - Thursday)
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
