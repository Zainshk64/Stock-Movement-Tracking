export default function ProductDetailSkeleton() {
  return (
    <div className="py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Image Skeleton */}
          <div className="aspect-square rounded-3xl bg-background animate-pulse" />

          {/* Details Skeleton */}
          <div className="space-y-6">
            {/* Brand */}
            <div className="h-4 w-24 bg-background rounded animate-pulse" />

            {/* Title */}
            <div className="space-y-2">
              <div className="h-8 w-full bg-background rounded animate-pulse" />
              <div className="h-8 w-2/3 bg-background rounded animate-pulse" />
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="h-5 w-28 bg-background rounded animate-pulse" />
              <div className="h-5 w-20 bg-background rounded animate-pulse" />
            </div>

            {/* Price */}
            <div className="flex items-center gap-3">
              <div className="h-10 w-32 bg-background rounded animate-pulse" />
              <div className="h-6 w-24 bg-background rounded animate-pulse" />
            </div>

            {/* Stock */}
            <div className="h-5 w-28 bg-background rounded animate-pulse" />

            {/* Description */}
            <div className="space-y-2">
              <div className="h-4 w-full bg-background rounded animate-pulse" />
              <div className="h-4 w-full bg-background rounded animate-pulse" />
              <div className="h-4 w-3/4 bg-background rounded animate-pulse" />
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <div className="h-12 w-36 bg-background rounded-xl animate-pulse" />
              <div className="h-12 w-40 bg-background rounded-xl animate-pulse" />
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-3">
              <div className="h-14 bg-background rounded-xl animate-pulse" />
              <div className="h-14 bg-background rounded-xl animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}