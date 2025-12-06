export default function ProductLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left - Main Image Skeleton */}
        <div className="space-y-4">
          {/* Thumbnails */}
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
              />
            ))}
          </div>
          {/* Main Image */}
          <div className="w-full aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
        </div>

        {/* Right - Product Info Skeleton */}
        <div className="space-y-6">
          {/* Title */}
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse" />

          {/* Rating */}
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse" />

          {/* Price */}
          <div className="flex gap-4">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse" />
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse" />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 animate-pulse" />
          </div>

          {/* Color Options */}
          <div className="space-y-3">
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse" />
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-12 h-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"
                />
              ))}
            </div>
          </div>

          {/* Size Options */}
          <div className="space-y-3">
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-12 animate-pulse" />
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="w-12 h-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"
                />
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="space-y-3">
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse" />
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse" />
          </div>

          {/* Add to Cart Button */}
          <div className="h-14 bg-gray-200 dark:bg-gray-700 rounded-lg w-full animate-pulse" />
        </div>
      </div>
    </div>
  );
}
