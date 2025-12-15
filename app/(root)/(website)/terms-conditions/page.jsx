import WebsiteBreadCrumb from "@/components/Application/Website/WebsiteBreadCrumb";

// SEO Metadata for Terms & Conditions
export const metadata = {
  title: "Terms & Conditions | WearPoint",
  description:
    "Read WearPoint's Terms and Conditions. Understand your rights and responsibilities when using our website and making purchases.",
  alternates: {
    canonical: "/terms-conditions",
  },
};

// ISR: Revalidate static pages every 15 minutes
export const revalidate = 900;

const breadcrumb = {
  title: "Terms & Conditions",
  links: [{ label: "Terms & Conditions", href: "/terms-conditions" }],
};

export default function TermsConditionsPage() {
  return (
    <div className="min-h-screen bg-white">
      <WebsiteBreadCrumb props={breadcrumb} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-8">
          Terms & Conditions
        </h1>

        <div className="prose prose-lg max-w-none text-gray-700">
          <p className="text-lg text-gray-600 mb-8">
            Last updated: December 2024
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              1. Agreement to Terms
            </h2>
            <p>
              By accessing and using WearPoint website, you agree to be bound by
              these Terms and Conditions. If you do not agree to these terms,
              please do not use our website.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              2. Use of Website
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>You must be at least 18 years old to make purchases</li>
              <li>
                You are responsible for maintaining the confidentiality of your
                account
              </li>
              <li>You agree not to use the website for any unlawful purpose</li>
              <li>
                We reserve the right to refuse service to anyone for any reason
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              3. Products and Pricing
            </h2>
            <p>
              All product descriptions and prices are subject to change without
              notice. We make every effort to display accurate product
              information, but we do not guarantee that all information is
              complete or error-free.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              4. Orders and Payment
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>All orders are subject to acceptance and availability</li>
              <li>We accept Cash on Delivery and Credit/Debit Card payments</li>
              <li>Prices are displayed in Bangladeshi Taka (BDT)</li>
              <li>We reserve the right to cancel orders for any reason</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              5. Shipping and Delivery
            </h2>
            <p>
              We offer free shipping on all orders within Bangladesh. Delivery
              times are estimates and may vary based on your location and
              product availability.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              6. Intellectual Property
            </h2>
            <p>
              All content on this website, including text, graphics, logos, and
              images, is the property of WearPoint and protected by copyright
              laws.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              7. Contact Information
            </h2>
            <p>For questions about these Terms & Conditions, contact us:</p>
            <ul className="list-none mt-4 space-y-2">
              <li>
                <strong>Email:</strong> support@estore.com
              </li>
              <li>
                <strong>Phone:</strong> +8801777777777
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
