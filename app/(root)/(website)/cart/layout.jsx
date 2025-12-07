// SEO Metadata for Cart Page (noindex to prevent duplicate content)
export const metadata = {
  title: "Shopping Cart | E-Store",
  description:
    "Review your shopping cart items. Free shipping on all orders. Secure checkout with multiple payment options.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function CartLayout({ children }) {
  return children;
}
