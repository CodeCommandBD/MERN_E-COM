// SEO Metadata for My Account Page (noindex for privacy)
export const metadata = {
  title: "My Account – E-Store | Manage Your Profile",
  description:
    "Manage your E-Store account, update profile information, view order history, track reviews, and change password securely.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function MyAccountLayout({ children }) {
  return children;
}
