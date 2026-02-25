import { motion } from 'framer-motion';

export default function ProductCardSkeleton() {
  return (
    <div className="bg-surface border border-border rounded-2xl overflow-hidden">
      {/* Image Skeleton */}
      <div className="aspect-square bg-background animate-pulse" />

      {/* Content Skeleton */}
      <div className="p-5 space-y-3">
        {/* Brand */}
        <div className="h-3 w-16 bg-background rounded animate-pulse" />

        {/* Title */}
        <div className="space-y-2">
          <div className="h-4 w-full bg-background rounded animate-pulse" />
          <div className="h-4 w-2/3 bg-background rounded animate-pulse" />
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="h-3 w-20 bg-background rounded animate-pulse" />
          <div className="h-3 w-12 bg-background rounded animate-pulse" />
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <div className="h-6 w-24 bg-background rounded animate-pulse" />
          <div className="h-4 w-16 bg-background rounded animate-pulse" />
        </div>

        {/* Button */}
        <div className="h-10 w-full bg-background rounded-xl animate-pulse mt-4" />
      </div>
    </div>
  );
}