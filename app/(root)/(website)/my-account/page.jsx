"use client";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "@/store/reducer/authReducer";
import axios from "axios";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  User,
  Package,
  Star,
  Lock,
  Edit2,
  Mail,
  Phone,
  LogOut,
  Eye,
  EyeOff,
  MapPin,
  CheckCircle,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { WEBSITE_LOGIN, USER_DASHBOARD } from "@/Routes/WebsiteRoute";
import { showToast } from "@/lib/showToast";
import { persistor } from "@/store/store";
import WebsiteBreadCrumb from "@/components/Application/Website/WebsiteBreadCrumb";

const breadcrumb = {
  title: "My Account",
  links: [
    {
      label: "My Account",
      href: "/my-account",
    },
  ],
};

export default function MyAccountPage() {
  const auth = useSelector((state) => state.authStore.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [gravatarUrl, setGravatarUrl] = useState("");
  const [activeSection, setActiveSection] = useState("account");
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const handleLoginRedirect = async () => {
    try {
      await axios.post("/api/auth/logout");
      dispatch(logout());
      await persistor.flush();
      window.location.href = WEBSITE_LOGIN;
    } catch (error) {
      console.error("Logout failed:", error);
      window.location.href = WEBSITE_LOGIN;
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (!auth?._id) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`/api/user/${auth._id}`);
        if (response.data.success) {
          const userData = response.data.data;
          setUser(userData);
          setFormData({
            name: userData.name || "",
            phone: userData.phone || "",
            address: userData.address || "",
          });

          // Generate Gravatar URL
          if (userData.email) {
            const email = userData.email.trim().toLowerCase();
            const hash = await generateMD5(email);
            setGravatarUrl(
              `https://www.gravatar.com/avatar/${hash}?s=200&d=identicon`
            );
          }
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        // If user not found or unauthorized (deleted from database), logout and redirect
        if (error.response?.status === 404 || error.response?.status === 401) {
          try {
            await axios.post("/api/auth/logout");
            dispatch(logout());
            await persistor.flush();
            showToast(
              "error",
              "Your session has expired or your account no longer exists. Please login again."
            );
            window.location.href = "/";
          } catch (logoutError) {
            console.error("Logout failed:", logoutError);
            // Clear local state even if logout API fails
            dispatch(logout());
            await persistor.flush();
            window.location.href = "/";
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [auth, router]);

  const generateMD5 = async (string) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(string);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGenderChange = (selectedGender) => {
    setFormData((prev) => ({
      ...prev,
      gender: selectedGender,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await axios.put("/api/user/update", formData);
      if (response.data.success) {
        setUser(response.data.data);
        setIsEditing(false);
        showToast("success", "Profile updated successfully");
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
      showToast(
        "error",
        error.response?.data?.message || "Failed to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user.name || "",
      phone: user.phone || "",
      address: user.address || "",
    });
    setIsEditing(false);
  };

  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout");
      // Clear Redux state
      dispatch(logout());
      // Flush redux-persist to ensure state is saved to localStorage
      await persistor.flush();
      // Show success message
      showToast("success", "Logged out successfully!");
      // Redirect to home page
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
      showToast("error", "Logout failed. Please try again.");
    }
  };

  const fetchOrders = async () => {
    if (ordersLoading || orders.length > 0) return;

    setOrdersLoading(true);
    try {
      let userEmail = auth.email;
      if (!userEmail && auth._id) {
        const userResponse = await axios.get(`/api/user/${auth._id}`);
        if (userResponse.data.success) {
          userEmail = userResponse.data.data.email;
        }
      }

      let params = `userId=${auth._id}`;
      if (userEmail) params += `&email=${userEmail}`;

      const response = await axios.get(`/api/order/user?${params}`);
      if (response.data.success) {
        setOrders(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleMenuClick = (section) => {
    setActiveSection(section);
    if (section === "orders") {
      fetchOrders();
    }
    if (section === "reviews") {
      fetchReviews();
    }
  };

  // Fetch user's reviews
  const fetchReviews = async () => {
    if (reviewsLoading || reviews.length > 0) return;

    setReviewsLoading(true);
    try {
      const response = await axios.get("/api/review/user");
      if (response.data.success) {
        setReviews(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    } finally {
      setReviewsLoading(false);
    }
  };

  // Handle password change
  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast("error", "New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      showToast("error", "Password must be at least 6 characters");
      return;
    }

    setPasswordLoading(true);
    try {
      const response = await axios.put(
        "/api/auth/change-password",
        passwordData
      );
      if (response.data.success) {
        showToast("success", "Password changed successfully");
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        showToast("error", response.data.message);
      }
    } catch (error) {
      showToast(
        "error",
        error.response?.data?.message || "Failed to change password"
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  // Render stars for rating
  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-700",
      confirmed: "bg-blue-100 text-blue-700",
      processing: "bg-purple-100 text-purple-700",
      shipped: "bg-indigo-100 text-indigo-700",
      delivered: "bg-green-100 text-green-700",
      cancelled: "bg-red-100 text-red-700",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
        <div className="bg-white rounded-2xl shadow-sm border-2 border-red-100 p-12 text-center max-w-md mx-4">
          <p className="text-red-500 text-lg mb-6">
            Please login to view your account
          </p>
          <Button
            onClick={handleLoginRedirect}
            className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-2 rounded-lg"
          >
            Login
          </Button>
        </div>
      </div>
    );
  }

  const avatarUrl = user.avatar?.url || gravatarUrl;

  const menuItems = [
    { icon: User, label: "My Accounts", section: "account" },
    { icon: Package, label: "My Orders", section: "orders" },
    { icon: Star, label: "My Rating & Reviews", section: "reviews" },
    { icon: Lock, label: "Change Password", section: "password" },
  ];

  return (
    <div className="min-h-screen bg-white">
      <WebsiteBreadCrumb props={breadcrumb} />
      <div className="bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                {/* User Info Header */}
                <div className="p-6 border-b">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={avatarUrl} alt={user.name} />
                      <AvatarFallback className="bg-primary text-white">
                        {user.name?.charAt(0)?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-xs text-gray-500">Hello</p>
                      <p className="font-semibold text-gray-900">{user.name}</p>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <nav className="py-2">
                  {menuItems.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => handleMenuClick(item.section)}
                      className={`w-full flex items-center gap-3 px-6 py-3 transition-colors ${
                        activeSection === item.section
                          ? "bg-primary text-white"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </button>
                  ))}

                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="text-sm font-medium">Logout</span>
                  </button>
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-9">
              {/* Account Section */}
              {activeSection === "account" && (
                <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Personal Information
                    </h2>
                    {!isEditing && (
                      <Button
                        onClick={() => setIsEditing(true)}
                        variant="ghost"
                        className="text-primary hover:text-primary/80"
                      >
                        <Edit2 className="w-4 h-4 mr-2" />
                        Change Profile Information
                      </Button>
                    )}
                  </div>

                  {/* Avatar */}
                  <div className="flex justify-center mb-8">
                    <div className="relative">
                      <Avatar className="w-32 h-32 border-4 border-gray-100">
                        <AvatarImage src={avatarUrl} alt={user.name} />
                        <AvatarFallback className="text-4xl bg-primary text-white">
                          {user.name?.charAt(0)?.toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      {isEditing && (
                        <button className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full hover:bg-primary/90 transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Form */}
                  <div className="space-y-6 max-w-2xl">
                    {/* Name */}
                    <div>
                      <Label
                        htmlFor="name"
                        className="text-gray-700 font-medium mb-2 block"
                      >
                        Name
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="bg-gray-50 border-gray-200"
                      />
                    </div>

                    {/* Phone Number */}
                    <div>
                      <Label
                        htmlFor="phone"
                        className="text-gray-700 font-medium mb-2 block"
                      >
                        Phone Number
                      </Label>
                      <div className="relative">
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="bg-gray-50 border-gray-200 pl-12"
                          placeholder="+880-1XXXXXXXXX"
                        />
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      </div>
                    </div>

                    {/* Address */}
                    <div>
                      <Label
                        htmlFor="address"
                        className="text-gray-700 font-medium mb-2 block"
                      >
                        Address
                      </Label>
                      <div className="relative">
                        <Input
                          id="address"
                          name="address"
                          type="text"
                          value={formData.address}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="bg-gray-50 border-gray-200 pl-12"
                          placeholder="Enter your address"
                        />
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      </div>
                    </div>

                    {/* Email with Verification Status */}
                    <div>
                      <Label
                        htmlFor="email"
                        className="text-gray-700 font-medium mb-2 block"
                      >
                        Email
                      </Label>
                      <div className="relative">
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={user.email}
                          disabled
                          className="bg-gray-100 border-gray-200 cursor-not-allowed pl-12 pr-28"
                        />
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          {user.isEmailVerified ? (
                            <span className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                              <CheckCircle className="w-3 h-3" />
                              Verified
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full">
                              <XCircle className="w-3 h-3" />
                              Not Verified
                            </span>
                          )}
                        </div>
                      </div>
                      {/* Verification Help Message */}
                      {!user.isEmailVerified && (
                        <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                          <p className="text-sm text-amber-800">
                            <strong>How to verify your email:</strong> Please
                            check your inbox for a verification email sent when
                            you registered. If you didn't receive it, contact
                            our support team at{" "}
                            <a
                              href="mailto:support@example.com"
                              className="text-amber-600 underline hover:text-amber-700"
                            >
                              support@example.com
                            </a>
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    {isEditing && (
                      <div className="flex gap-3 pt-4">
                        <Button
                          onClick={handleSave}
                          disabled={saving}
                          className="bg-primary hover:bg-primary/90 text-white"
                        >
                          {saving ? "Saving..." : "Save Changes"}
                        </Button>
                        <Button
                          onClick={handleCancel}
                          variant="outline"
                          disabled={saving}
                        >
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Orders Section */}
              {activeSection === "orders" && (
                <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    My Orders
                  </h2>

                  {ordersLoading ? (
                    <div className="flex justify-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-12">
                      <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No orders found</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div
                          key={order._id}
                          className="border rounded-lg p-4 hover:border-gray-300 transition-colors"
                        >
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <span className="text-sm font-medium text-gray-900">
                                  Order #{order._id.slice(-8).toUpperCase()}
                                </span>
                                <span
                                  className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                                    order.orderStatus
                                  )}`}
                                >
                                  {order.orderStatus?.charAt(0).toUpperCase() +
                                    order.orderStatus?.slice(1)}
                                </span>
                              </div>
                              <p className="text-sm text-gray-500">
                                {new Date(order.createdAt).toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  }
                                )}
                              </p>
                              <p className="text-sm font-medium text-gray-900 mt-1">
                                ৳{order.totalAmount?.toLocaleString()}
                              </p>
                            </div>
                            <Link href={`/order/${order._id}`}>
                              <Button variant="outline" size="sm">
                                View Details
                              </Button>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* My Rating & Reviews Section */}
              {activeSection === "reviews" && (
                <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    My Rating & Reviews
                  </h2>

                  {reviewsLoading ? (
                    <div className="flex justify-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                  ) : reviews.length === 0 ? (
                    <div className="text-center py-12">
                      <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">
                        You haven't written any reviews yet
                      </p>
                      <p className="text-gray-400 text-sm mt-2">
                        Purchase a product and share your experience!
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {reviews.map((review) => (
                        <div
                          key={review._id}
                          className="border rounded-lg p-4 hover:border-gray-300 transition-colors"
                        >
                          <div className="flex gap-4">
                            {/* Product Image */}
                            <div className="flex-shrink-0">
                              <img
                                src={
                                  review.product?.image || "/placeholder.png"
                                }
                                alt={review.product?.name}
                                className="w-20 h-20 object-cover rounded-lg bg-gray-100"
                              />
                            </div>
                            {/* Review Content */}
                            <div className="flex-1 min-w-0">
                              <Link
                                href={`/product/${
                                  review.product?.url || review.product?._id
                                }`}
                                className="text-sm font-semibold text-gray-900 hover:text-primary line-clamp-1"
                              >
                                {review.product?.name || "Product"}
                              </Link>
                              <div className="flex items-center gap-1 mt-1">
                                {renderStars(review.rating)}
                                <span className="text-sm text-gray-500 ml-2">
                                  {new Date(
                                    review.createdAt
                                  ).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </span>
                              </div>
                              <h4 className="font-medium text-gray-800 mt-2">
                                {review.title}
                              </h4>
                              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                {review.review}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Change Password Section */}
              {activeSection === "password" && (
                <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Change Password
                  </h2>

                  <form
                    onSubmit={handlePasswordChange}
                    className="max-w-md space-y-6"
                  >
                    {/* Current Password */}
                    <div>
                      <Label
                        htmlFor="currentPassword"
                        className="text-gray-700 font-medium mb-2 block"
                      >
                        Current Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="currentPassword"
                          type={showCurrentPassword ? "text" : "password"}
                          value={passwordData.currentPassword}
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              currentPassword: e.target.value,
                            })
                          }
                          placeholder="Enter current password"
                          className="bg-gray-50 border-gray-200 pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowCurrentPassword(!showCurrentPassword)
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showCurrentPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* New Password */}
                    <div>
                      <Label
                        htmlFor="newPassword"
                        className="text-gray-700 font-medium mb-2 block"
                      >
                        New Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          type={showNewPassword ? "text" : "password"}
                          value={passwordData.newPassword}
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              newPassword: e.target.value,
                            })
                          }
                          placeholder="Enter new password"
                          className="bg-gray-50 border-gray-200 pr-10"
                          required
                          minLength={6}
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showNewPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        Must be at least 6 characters
                      </p>
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <Label
                        htmlFor="confirmPassword"
                        className="text-gray-700 font-medium mb-2 block"
                      >
                        Confirm New Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          value={passwordData.confirmPassword}
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              confirmPassword: e.target.value,
                            })
                          }
                          placeholder="Confirm new password"
                          className="bg-gray-50 border-gray-200 pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={passwordLoading}
                      className="w-full bg-primary hover:bg-primary/90"
                    >
                      {passwordLoading
                        ? "Changing Password..."
                        : "Change Password"}
                    </Button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
