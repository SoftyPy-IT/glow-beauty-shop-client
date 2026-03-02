import React from "react";
import { Heart, ShoppingBag } from "lucide-react";

const CardSkeleton = () => {
  return (
    <div className="relative w-full h-full animate-pulse">
      <div className="relative w-full bg-white rounded-xl overflow-hidden border border-gray-100 h-full">
        {/* Badge Placeholder */}
        <div className="absolute top-3 left-3 z-10">
          <div className="h-5 w-12 bg-gray-200 rounded-full"></div>
        </div>

        {/* Wishlist Button Placeholder */}
        <div className="absolute top-3 right-3 z-10 w-8 h-8 bg-gray-200 rounded-full"></div>

        {/* Image Container */}
        <div className="relative w-full aspect-square overflow-hidden bg-gray-100">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-shimmer"></div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Category and Rating */}
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="h-3 w-20 bg-gray-200 rounded"></div>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-3 h-3 bg-gray-200 rounded-full"></div>
              ))}
            </div>
          </div>

          {/* Product Name */}
          <div className="space-y-2 mb-3">
            <div className="h-4 w-full bg-gray-200 rounded"></div>
            <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2">
            <div className="h-6 w-16 bg-gray-200 rounded"></div>
            <div className="h-4 w-12 bg-gray-200 rounded"></div>
          </div>

          {/* Stock Status Placeholder */}
          <div className="flex items-center gap-1 mt-3">
            <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
            <div className="h-3 w-24 bg-gray-200 rounded"></div>
          </div>

          {/* Add to Cart Button Placeholder */}
          <div className="mt-4">
            <div className="h-10 w-full bg-gray-200 rounded-lg flex items-center justify-center gap-2">
              <ShoppingBag className="w-4 h-4 text-gray-300" />
              <div className="h-3 w-16 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Shimmer Animation Styles */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
};

export default CardSkeleton;
