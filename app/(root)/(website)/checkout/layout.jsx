// SEO Metadata for Checkout Page (noindex for privacy)
export const metadata = {
  title: "Checkout | WearPoint",
  description:
    "Complete your order securely. Multiple payment options including Cash on Delivery and Credit/Debit Cards.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CheckoutLayout({ children }) {
  return children;
}
