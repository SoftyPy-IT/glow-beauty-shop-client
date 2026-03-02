import { addToCart, changeItemQuantity } from "@/redux/features/cart";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import formatPrice from "@/utils/formatPrice";
import { truncate } from "lodash";
import { ShoppingBag, Star, Heart, Eye, Award, Shield } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FC, useState, useEffect } from "react";

interface ItemType {
  id: string;
  name: string;
  code: string;
  price: number;
  img1: string;
  img2: string;
  slug: string;
  discount?: number;
  isNew?: boolean;
  category?: string;
  mainCategory?: string;
  subCategory?: string;
  link?: string;
  rating?: number;
  reviewCount?: number;
  availableStock: number;
}

interface Props {
  item: ItemType;
  className?: string;
}

const RatingStars: FC<{
  rating: number;
  reviewCount?: number;
  size?: "sm" | "md";
}> = ({ rating, reviewCount, size = "sm" }) => {
  const totalStars = 5;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  const starSize = size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5";

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[...Array(totalStars)].map((_, index) => (
          <Star
            key={index}
            className={`${starSize} ${
              index < fullStars
                ? "fill-amber-400 text-amber-400"
                : index === fullStars && hasHalfStar
                  ? "fill-amber-400 text-amber-400"
                  : "fill-gray-200 text-gray-200"
            } transition-colors`}
            strokeWidth={1.5}
          />
        ))}
      </div>
      {reviewCount && reviewCount > 0 && (
        <span className="text-[10px] text-gray-400 font-medium">
          ({reviewCount})
        </span>
      )}
    </div>
  );
};

const Card: FC<Props> = ({ item, className = "" }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [currentImage, setCurrentImage] = useState(item.img1);
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.cartItems);
  const router = useRouter();

  const {
    id,
    name,
    code,
    slug,
    price,
    img1,
    img2,
    discount,
    isNew,
    category,
    mainCategory,
    subCategory,
    rating = 0,
    reviewCount,
    availableStock,
  } = item;

  const itemLink = item.link || `/products/${encodeURIComponent(slug)}`;
  const discountedPrice = discount && discount > 0 ? price - discount : price;
  const hasDiscount = discount && discount > 0;
  const savingsPercentage = hasDiscount
    ? Math.round((discount! / price) * 100)
    : 0;
  const isOutOfStock = availableStock <= 0;

  useEffect(() => {
    setCurrentImage(img1);
    setImageError(false);
  }, [img1]);

  const handleImageError = () => {
    setImageError(true);
    setCurrentImage("/images/placeholder-product.jpg");
  };

  const handleMouseEnter = () => {
    if (img2 && !imageError) {
      setCurrentImage(img2);
    }
  };

  const handleMouseLeave = () => {
    setCurrentImage(img1);
  };

  const addToCartHandler = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;

    setIsLoading(true);

    const cartItem = {
      productId: id,
      name,
      code,
      thumbnail: img1,
      price: discountedPrice,
      quantity: 1,
      totalPrice: discountedPrice,
      variants: [],
      availableStock,
    };

    const existingCartItem = cartItems.find(
      (ci) => ci.productId === cartItem.productId,
    );

    if (existingCartItem) {
      dispatch(
        changeItemQuantity({
          productId: cartItem.productId,
          quantity: existingCartItem.quantity + 1,
        }),
      );
    } else {
      dispatch(addToCart(cartItem));
    }

    setTimeout(() => setIsLoading(false), 600);
  };

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const quickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Implement quick view modal logic here
    console.log("Quick view:", id);
  };

  return (
    <div className={`group relative w-full h-full ${className}`}>
      <div className="relative w-full bg-white rounded-xl overflow-hidden transition-all duration-300 flex flex-col hover:shadow-lg hover:shadow-gray-200/50 border border-gray-100 h-full group">
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
          {isNew && (
            <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg flex items-center gap-1">
              <Award className="w-3 h-3" />
              NEW
            </span>
          )}
          {hasDiscount && (
            <span className="bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg">
              -{savingsPercentage}%
            </span>
          )}
          {isOutOfStock && (
            <span className="bg-gradient-to-r from-gray-700 to-gray-800 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg">
              Out of Stock
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={toggleWishlist}
          className="absolute top-3 right-3 z-10 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white shadow-md hover:shadow-lg transform hover:scale-110"
          aria-label="Add to wishlist"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isWishlisted ? "fill-rose-500 text-rose-500" : "text-gray-600"
            }`}
          />
        </button>

        {/* Image Container */}
        <div
          className="relative w-full aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 cursor-pointer"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <Link
            href={itemLink}
            className="block w-full h-full"
            target={item.link ? "_blank" : undefined}
            rel={item.link ? "noopener noreferrer" : undefined}
          >
            <Image
              src={currentImage}
              alt={name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
              priority={false}
              className="object-contain transition-transform duration-700 group-hover:scale-110 p-4"
              onError={handleImageError}
            />
          </Link>

          {/* Quick View Button */}
          <button
            onClick={quickView}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-1.5 rounded-full text-xs font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:shadow-lg flex items-center gap-1 border border-gray-200"
          >
            <Eye className="w-3.5 h-3.5" />
            Quick View
          </button>

          {/* Add to cart button - Bottom overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-white/90 via-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
            <button
              onClick={addToCartHandler}
              disabled={isLoading || isOutOfStock}
              className={`w-full bg-gray-900 text-white py-2.5 px-4 text-xs font-semibold flex items-center justify-center gap-2 transition-all duration-300 rounded-lg transform hover:scale-[1.02] active:scale-[0.98] shadow-lg ${
                isLoading || isOutOfStock
                  ? "opacity-50 cursor-not-allowed bg-gray-700"
                  : "hover:bg-gray-800 hover:shadow-xl"
              }`}
            >
              <ShoppingBag
                className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
              />
              <span>
                {isOutOfStock
                  ? "Out of Stock"
                  : isLoading
                    ? "Adding..."
                    : "Add to Cart"}
              </span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col">
          {/* Category and Rating */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1 min-w-0">
              {(mainCategory || subCategory || category) && (
                <Link
                  href={`/category/${mainCategory || subCategory || category}`}
                  className="text-[10px] text-gray-400 hover:text-rose-500 uppercase tracking-wider font-medium transition-colors"
                >
                  {mainCategory || subCategory || category}
                </Link>
              )}
            </div>
            <RatingStars rating={rating} reviewCount={reviewCount} size="sm" />
          </div>

          {/* Product Name */}
          <Link
            href={itemLink}
            className="mb-2 group/name"
            target={item.link ? "_blank" : undefined}
          >
            <h3 className="text-sm font-medium text-gray-900 group-hover/name:text-rose-500 transition-colors duration-300 leading-snug line-clamp-2">
              {truncate(name, { length: 50, separator: " " })}
            </h3>
          </Link>

          {/* Price and Savings */}
          <div className="mt-auto">
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-xl font-bold text-gray-900">
                {formatPrice(discountedPrice)}
              </span>
              {hasDiscount && (
                <span className="text-sm text-gray-400 line-through">
                  {formatPrice(price)}
                </span>
              )}
            </div>

            {/* Stock Status */}
            {availableStock > 0 && availableStock < 10 && (
              <div className="flex items-center gap-1 mt-2">
                <Shield className="w-3 h-3 text-amber-500" />
                <span className="text-[10px] text-amber-600 font-medium">
                  Only {availableStock} left in stock
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Hover Border Effect */}
        <div className="absolute inset-0 border-2 border-transparent group-hover:border-rose-200 rounded-xl pointer-events-none transition-all duration-300"></div>
      </div>
    </div>
  );
};

export default Card;
