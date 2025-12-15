// SEO Metadata for My Orders Page (noindex for privacy)
export const metadata = {
  title: "My Orders | WearPoint",
  description:
    "View and track your WearPoint orders. Check order status, delivery updates, and manage your purchases securely.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function MyOrdersLayout({ children }) {
  return children;
}
