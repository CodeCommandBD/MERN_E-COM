import WebsiteBreadCrumb from "@/components/Application/Website/WebsiteBreadCrumb";

// SEO Metadata for Privacy Policy Page
export const metadata = {
  title: "Privacy Policy | WearPoint",
  description:
    "Read WearPoint's Privacy Policy. Learn how we collect, use, and protect your personal information when you shop with us.",
  alternates: {
    canonical: "/privacy-policy",
  },
};

// ISR: Revalidate static pages every 15 minutes
export const revalidate = 900;

const breadcrumb = {
  title: "Privacy Policy",
  links: [{ label: "Privacy Policy", href: "/privacy-policy" }],
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <WebsiteBreadCrumb props={breadcrumb} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-8">
          Privacy Policy
        </h1>

        <div className="prose prose-lg max-w-none text-gray-700">
          <p className="text-lg text-gray-600 mb-8">
            Last updated: December 2024
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              1. Information We Collect
            </h2>
            <p>
              We collect information you provide directly to us, including your
              name, email address, phone number, shipping address, and payment
              information when you make a purchase or create an account.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              2. How We Use Your Information
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Process and fulfill your orders</li>
              <li>Send order confirmations and shipping updates</li>
              <li>Respond to your questions and requests</li>
              <li>Improve our website and services</li>
              <li>Send promotional emails (with your consent)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              3. Information Sharing
            </h2>
            <p>
              We do not sell or share your personal information with third
              parties except as necessary to complete your orders (e.g.,
              shipping carriers, payment processors).
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              4. Data Security
            </h2>
            <p>
              We use industry-standard security measures to protect your
              personal information. All payment transactions are encrypted using
              SSL technology.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              5. Your Rights
            </h2>
            <p>
              You have the right to access, update, or delete your personal
              information at any time. Contact us at support@estore.com for any
              privacy-related requests.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              6. Contact Us
            </h2>
            <p>
              If you have questions about this Privacy Policy, please contact
              us:
            </p>
            <ul className="list-none mt-4 space-y-2">
              <li>
                <strong>Email:</strong> support@estore.com
              </li>
              <li>
                <strong>Phone:</strong> +8801777777777
              </li>
              <li>
                <strong>Address:</strong> 123 Fashion Avenue, New York, NY 10011, United States
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
