// SEO Metadata for Checkout Page (noindex for privacy)
export const metadata = {
  title: "Checkout | E-Store",
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
