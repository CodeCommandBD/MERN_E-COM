// SEO Metadata for Cart Page (noindex to prevent duplicate content)
export const metadata = {
  title: "Shopping Cart | WearPoint",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CartLayout({ children }) {
  return children;
}
