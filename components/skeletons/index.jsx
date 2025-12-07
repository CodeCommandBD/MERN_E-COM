// Skeleton loader components for preventing layout shift

export function ProductCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-square bg-gray-200 rounded-lg mb-3" />
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
      <div className="h-5 bg-gray-200 rounded w-1/3" />
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function TestimonialSkeleton() {
  return (
    <div className="animate-pulse py-8 md:py-12 px-4 md:px-6 lg:px-16">
      <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-8" />
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-100 rounded-xl p-6">
              <div className="h-8 w-8 bg-gray-200 rounded mb-4" />
              <div className="space-y-2 mb-6">
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-5/6" />
                <div className="h-4 bg-gray-200 rounded w-4/6" />
              </div>
              <div className="h-5 bg-gray-200 rounded w-1/3 mb-2" />
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((j) => (
                  <div key={j} className="h-4 w-4 bg-gray-200 rounded" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function SliderSkeleton() {
  return <div className="w-full aspect-[16/5] bg-gray-200 animate-pulse" />;
}

export function BannerSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-2 gap-4">
        <div className="h-40 bg-gray-200 animate-pulse rounded-lg" />
        <div className="h-40 bg-gray-200 animate-pulse rounded-lg" />
      </div>
    </div>
  );
}
