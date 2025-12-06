"use client";
import WebsiteBreadCrumb from "@/components/Application/Website/WebsiteBreadCrumb";
import {
  Users,
  Target,
  Award,
  Heart,
  ShoppingBag,
  Truck,
  Shield,
  Headphones,
} from "lucide-react";

const breadcrumb = {
  title: "About Us",
  links: [
    {
      label: "About",
      href: "/about",
    },
  ],
};

const stats = [
  { number: "10K+", label: "Happy Customers" },
  { number: "500+", label: "Products" },
  { number: "50+", label: "Categories" },
  { number: "24/7", label: "Support" },
];

const values = [
  {
    icon: Heart,
    title: "Quality First",
    description:
      "We never compromise on the quality of our products. Every item is carefully selected and tested.",
  },
  {
    icon: Users,
    title: "Customer Focus",
    description:
      "Our customers are at the heart of everything we do. Your satisfaction is our top priority.",
  },
  {
    icon: Shield,
    title: "Trust & Security",
    description:
      "Shop with confidence. We ensure secure transactions and protect your personal information.",
  },
  {
    icon: Award,
    title: "Best Prices",
    description:
      "We offer competitive prices without compromising quality. Get the best value for your money.",
  },
];

const features = [
  {
    icon: ShoppingBag,
    title: "Wide Selection",
    description:
      "Browse through our extensive collection of trendy clothing and accessories.",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description:
      "Quick and reliable shipping to get your orders to you as fast as possible.",
  },
  {
    icon: Shield,
    title: "Secure Payment",
    description:
      "Multiple secure payment options including cards and cash on delivery.",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description:
      "Our customer support team is always ready to help you with any queries.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <WebsiteBreadCrumb props={breadcrumb} />

      {/* Hero Section */}
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Welcome to <span className="text-primary">E-Store</span>
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed">
              We are passionate about bringing you the latest fashion trends at
              affordable prices. Our mission is to make quality fashion
              accessible to everyone, everywhere.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-primary/5 border-y-2 border-primary/10">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-primary mb-1">
                  {stat.number}
                </div>
                <div className="text-gray-600 text-sm lg:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div>
              <div className="inline-block px-4 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
                Our Story
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                Building the Future of Online Fashion
              </h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Founded with a vision to revolutionize the way people shop for
                fashion, E-Store has grown from a small startup to a trusted
                destination for fashion enthusiasts across the country.
              </p>
              <p className="text-gray-600 leading-relaxed">
                We believe that everyone deserves to look and feel their best.
                That's why we carefully curate our collection to bring you the
                latest trends, timeless classics, and everything in between –
                all at prices that won't break the bank.
              </p>
            </div>
            <div className="relative">
              <div className="aspect-square bg-primary/5 rounded-2xl border-2 border-primary/20 flex items-center justify-center">
                <div className="text-center p-8">
                  <Target className="w-16 h-16 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Our Mission
                  </h3>
                  <p className="text-gray-600">
                    To provide high-quality, fashionable clothing that empowers
                    individuals to express their unique style with confidence.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-12 lg:py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-10">
            <div className="inline-block px-4 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
              Our Values
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
              What We Stand For
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl border-2 border-primary/10 text-center"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-10">
            <div className="inline-block px-4 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
              Why Choose Us
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
              The E-Store Advantage
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-xl border-2 border-primary/10 hover:border-primary/30 transition-colors"
              >
                <div className="w-12 h-12 bg-primary text-white rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="py-12 lg:py-16 bg-primary/5 border-y-2 border-primary/10">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
            Have Questions?
          </h2>
          <p className="text-gray-600 mb-6">
            We'd love to hear from you! Our team is always ready to assist you
            with any questions or concerns.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:support@estore.com"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors"
            >
              Contact Us
            </a>
            <a
              href="/shop"
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-primary font-medium rounded-lg border-2 border-primary hover:bg-primary/5 transition-colors"
            >
              Shop Now
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
