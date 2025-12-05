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
  RotateCcw,
  Star,
  Heart,
  CreditCard,
  Lock,
  Edit2,
  Calendar,
  Mail,
  Phone,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { WEBSITE_LOGIN, USER_DASHBOARD } from "@/Routes/WebsiteRoute";
import { showToast } from "@/lib/showToast";

export default function MyAccountPage() {
  const auth = useSelector((state) => state.authStore.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [gravatarUrl, setGravatarUrl] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
  });

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
            dateOfBirth: userData.dateOfBirth || "",
            gender: userData.gender || "",
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
      dateOfBirth: user.dateOfBirth || "",
      gender: user.gender || "",
    });
    setIsEditing(false);
  };

  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout");
      // Clear Redux state
      dispatch(logout());
      // Show success message
      showToast("success", "Logged out successfully!");
      // Redirect to home page
      setTimeout(() => {
        window.location.href = "/";
      }, 500);
    } catch (error) {
      console.error("Logout failed:", error);
      showToast("error", "Logout failed. Please try again.");
    }
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
          <Link href={WEBSITE_LOGIN}>
            <Button className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-2 rounded-lg">
              Login
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const avatarUrl = user.avatar?.url || gravatarUrl;

  const menuItems = [
    { icon: User, label: "My Accounts", href: USER_DASHBOARD, active: true },
    { icon: Package, label: "My Orders", href: "/my-orders", active: false },
    {
      icon: RotateCcw,
      label: "Returns & Cancel",
      href: "/returns",
      active: false,
    },
    {
      icon: Star,
      label: "My Rating & Reviews",
      href: "/reviews",
      active: false,
    },
    { icon: Heart, label: "My Wishlist", href: "/wishlist", active: false },
    { icon: CreditCard, label: "Payment", href: "/payment", active: false },
    {
      icon: Lock,
      label: "Change Password",
      href: "/change-password",
      active: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Profile</h1>

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
                  <Link
                    key={index}
                    href={item.href}
                    className={`flex items-center gap-3 px-6 py-3 transition-colors ${
                      item.active
                        ? "bg-blue-500 text-white"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
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
                    className="text-blue-500 hover:text-blue-600"
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
                    <button className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors">
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

                {/* Date of Birth */}
                <div>
                  <Label
                    htmlFor="dateOfBirth"
                    className="text-gray-700 font-medium mb-2 block"
                  >
                    Date Of Birth
                  </Label>
                  <div className="relative">
                    <Input
                      id="dateOfBirth"
                      name="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="bg-gray-50 border-gray-200"
                    />
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Gender */}
                <div>
                  <Label className="text-gray-700 font-medium mb-3 block">
                    Gender
                  </Label>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => isEditing && handleGenderChange("male")}
                      disabled={!isEditing}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${
                        formData.gender === "male"
                          ? "border-green-500 bg-green-50"
                          : "border-gray-200 bg-gray-50"
                      } ${
                        !isEditing
                          ? "cursor-not-allowed opacity-60"
                          : "cursor-pointer hover:border-green-300"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          formData.gender === "male"
                            ? "border-green-500"
                            : "border-gray-300"
                        }`}
                      >
                        {formData.gender === "male" && (
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        )}
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        Male
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => isEditing && handleGenderChange("female")}
                      disabled={!isEditing}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${
                        formData.gender === "female"
                          ? "border-pink-500 bg-pink-50"
                          : "border-gray-200 bg-gray-50"
                      } ${
                        !isEditing
                          ? "cursor-not-allowed opacity-60"
                          : "cursor-pointer hover:border-pink-300"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          formData.gender === "female"
                            ? "border-pink-500"
                            : "border-gray-300"
                        }`}
                      >
                        {formData.gender === "female" && (
                          <div className="w-3 h-3 rounded-full bg-pink-500"></div>
                        )}
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        Female
                      </span>
                    </button>
                  </div>
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
                      placeholder="+90-123456789"
                    />
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                </div>

                {/* Email (Read-only) */}
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
                      className="bg-gray-100 border-gray-200 cursor-not-allowed pl-12"
                    />
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                </div>

                {/* Action Buttons */}
                {isEditing && (
                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={handleSave}
                      disabled={saving}
                      className="bg-blue-500 hover:bg-blue-600 text-white"
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
          </div>
        </div>
      </div>
    </div>
  );
}
