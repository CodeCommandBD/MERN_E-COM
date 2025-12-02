// Quick diagnostic - paste this in your browser console on the shop page
fetch("/api/shop?category=t-shirts")
  .then((r) => r.json())
  .then((data) => {
    console.log("API Response:", data);
    console.log("Products count:", data.data?.products?.length || 0);
  });

// Also check without any filters
fetch("/api/shop")
  .then((r) => r.json())
  .then((data) => {
    console.log("All products (no filter):", data.data?.products?.length || 0);
  });
