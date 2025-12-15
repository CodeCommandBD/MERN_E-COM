// SEO Metadata for My Account Page (noindex for privacy)
export const metadata = {
  title: "My Account – WearPoint | Manage Your Profile",
  description:
    "Manage your WearPoint account, update profile information, view order history, track reviews, and change password securely.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function MyAccountLayout({ children }) {
  return children;
}
