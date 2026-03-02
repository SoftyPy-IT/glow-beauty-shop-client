"use client";

import Card from "@/components/Card/Card";
import CardSkeleton from "@/components/Card/CardSkeleton";
import Container from "@/components/common/Container";
import ServerErrorMessage from "@/components/common/ServerErrorMessage";
import { useGetAllProductsQuery } from "@/redux/features/products/product.api";
import { IProduct } from "@/types/products.types";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import {
  Sparkles,
  Flower2,
  Gem,
  Heart,
  Star,
  Award,
  Shield,
  Crown,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import {
  Autoplay,
  Grid,
  Navigation,
  EffectFade,
  Parallax,
} from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/grid";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import "swiper/css/parallax";

const FeatureProducts = () => {
  const isSmallScreen = useMediaQuery({ query: "(max-width: 640px)" });
  const isMediumScreen = useMediaQuery({ query: "(max-width: 1024px)" });
  const [isHovering, setIsHovering] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const {
    data: products,
    isLoading,
    error,
  } = useGetAllProductsQuery([{ name: "is_featured", value: true }]);

  const [key, setKey] = useState(0);
  const data = products?.data as IProduct[];

  useEffect(() => {
    if (products) {
      setKey((prevKey) => prevKey + 1);
    }
  }, [products]);

  if (error) return <ServerErrorMessage />;

  if (!data || data.length === 0) return null;

  return (
    <section className="relative bg-gradient-to-b from-[#fdf2f8] via-white to-[#fff1f2] py-10 md:py-12 overflow-hidden">
      <Container>
        <div className="relative">
          <div className="text-center mb-5">
            <div className="inline-flex  gap-3 mb-4">
              <div className="h-px w-8 bg-gradient-to-r from-transparent via-rose-300 to-rose-300"></div>
              <div className="flex items-center gap-2 text-rose-500">
                <Gem className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-[0.3em]">
                  Exclusive Selection
                </span>
                <Gem className="w-4 h-4" />
              </div>
              <div className="h-px w-8 bg-gradient-to-l from-transparent via-rose-300 to-rose-300"></div>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-gray-900 mb-4 tracking-tight">
              Featured{" "}
              <span className="relative">
                <span className="font-semibold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                  Collections
                </span>
                <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-rose-300 to-pink-300 transform scale-x-75 mx-auto"></div>
              </span>
            </h2>
          </div>

          {/* Advanced Navigation Controls */}
          <div className="flex justify-between items-center mb-10 px-2">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-rose-400 to-pink-400 rounded-lg blur-md opacity-50"></div>
                <div className="relative bg-white px-4 py-2 rounded-lg shadow-md border border-rose-200">
                  <span className="text-sm font-semibold text-gray-800">
                    <span className="text-rose-600">{data?.length || 0}</span>{" "}
                    Exclusive Pieces
                  </span>
                </div>
              </div>
              <div className="h-6 w-px bg-gradient-to-b from-transparent via-rose-200 to-transparent"></div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4].map((dot) => (
                  <div
                    key={dot}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                      dot === activeIndex + 1
                        ? "bg-rose-500 w-4"
                        : "bg-rose-200"
                    }`}
                  ></div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                className="group relative w-12 h-12 rounded-full bg-white shadow-lg border border-rose-200 
                  hover:shadow-2xl hover:shadow-rose-200/50 transition-all duration-500
                  focus:outline-none focus:ring-2 focus:ring-rose-300 focus:ring-offset-2
                  overflow-hidden"
                onClick={() => {
                  const prev = document.querySelector(
                    ".custom-swiper-button-prev-feature",
                  ) as HTMLButtonElement;
                  prev?.click();
                }}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-rose-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <ChevronLeftIcon className="relative w-5 h-5 mx-auto text-gray-600 group-hover:text-white transition-colors duration-500" />
              </button>
              <button
                className="group relative w-12 h-12 rounded-full bg-white shadow-lg border border-rose-200 
                  hover:shadow-2xl hover:shadow-rose-200/50 transition-all duration-500
                  focus:outline-none focus:ring-2 focus:ring-rose-300 focus:ring-offset-2
                  overflow-hidden"
                onClick={() => {
                  const next = document.querySelector(
                    ".custom-swiper-button-next-feature",
                  ) as HTMLButtonElement;
                  next?.click();
                }}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-rose-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <ChevronRightIcon className="relative w-5 h-5 mx-auto text-gray-600 group-hover:text-white transition-colors duration-500" />
              </button>
            </div>
          </div>

          {/* Spectacular Products Grid */}
          <div className="relative">
            {/* Hidden navigation buttons for Swiper */}
            <button className="custom-swiper-button-prev-feature hidden"></button>
            <button className="custom-swiper-button-next-feature hidden"></button>

            <Swiper
              key={key}
              modules={[Navigation, Autoplay, Grid, EffectFade, Parallax]}
              spaceBetween={isSmallScreen ? 12 : 15}
              slidesPerView={isSmallScreen ? 2 : isMediumScreen ? 3 : 5}
              navigation={{
                nextEl: ".custom-swiper-button-next-feature",
                prevEl: ".custom-swiper-button-prev-feature",
              }}
              autoplay={{
                delay: 2000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              grabCursor={true}
              grid={{
                rows: 2,
                fill: "row",
              }}
              speed={1000}
              parallax={true}
              onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
              className="featured-products-swiper"
            >
              {isLoading
                ? Array.from({
                    length: isSmallScreen ? 4 : isMediumScreen ? 6 : 8,
                  }).map((_, index) => (
                    <SwiperSlide key={index}>
                      <div className="transform transition-all duration-500 hover:scale-[1.02] hover:-translate-y-2">
                        <CardSkeleton />
                      </div>
                    </SwiperSlide>
                  ))
                : data?.map((product, index) => (
                    <SwiperSlide
                      key={product._id}
                      className="swiper-slide group/slide"
                    >
                      <div
                        className="relative animate-fade-in-up"
                        style={{ animationDelay: `${index * 80}ms` }}
                      >
                        {/* Stunning Badge System */}
                        {index === 0 && (
                          <div className="absolute -top-3 -right-3 z-20">
                            <div className="relative">
                              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-amber-400 rounded-full blur-md animate-pulse"></div>
                              <div className="relative bg-gradient-to-r from-yellow-400 to-amber-400 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-xl flex items-center gap-1">
                                <Crown className="w-3 h-3" />
                                <span>EDITOR'S CHOICE</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {index === 1 && (
                          <div className="absolute -top-3 -right-3 z-20">
                            <div className="relative">
                              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-md animate-pulse"></div>
                              <div className="relative bg-gradient-to-r from-purple-400 to-pink-400 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-xl flex items-center gap-1">
                                <Award className="w-3 h-3" />
                                <span>BESTSELLER</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {index === 2 && (
                          <div className="absolute -top-3 -right-3 z-20">
                            <div className="relative">
                              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full blur-md animate-pulse"></div>
                              <div className="relative bg-gradient-to-r from-emerald-400 to-teal-400 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-xl flex items-center gap-1">
                                <Sparkles className="w-3 h-3" />
                                <span>NEW ARRIVAL</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Magical Hover Effect Container */}
                        <div className="relative group/card perspective-1000">
                          {/* Glow Effect on Hover */}
                          <div className="absolute -inset-0.5 bg-gradient-to-r from-rose-400 to-pink-400 rounded-2xl opacity-0 group-hover/card:opacity-100 blur-xl transition-all duration-700 group-hover/card:duration-300"></div>

                          {/* Card Container with 3D Transform */}
                          <div className="relative transform-gpu transition-all duration-700 hover:rotate-y-6 hover:scale-105 hover:-translate-y-4">
                            {/* Shine Effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover/card:opacity-100 -translate-x-full group-hover/card:translate-x-full transition-all duration-1000 ease-in-out z-10 pointer-events-none rounded-2xl"></div>

                            {/* Floating Animation */}
                            <div className="animate-float-slow">
                              <Card
                                item={{
                                  id: product._id,
                                  name: product.name,
                                  code: product.code,
                                  price: product.price,
                                  img1: product.thumbnail,
                                  img2: product.images[0],
                                  slug: product.slug,
                                  category: product.category?.name,
                                  rating: product.rating,
                                  reviewCount: product.reviews.length,
                                  subCategory: product.subCategory?.name,
                                  mainCategory: product.mainCategory?.name,
                                  availableStock: product.quantity,
                                }}
                              />
                            </div>
                          </div>

                          {/* Quick Actions Overlay */}
                          <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover/card:opacity-100 transition-all duration-500 transform translate-y-2 group-hover/card:translate-y-0 rounded-b-2xl">
                            <div className="flex items-center justify-between">
                              <button className="flex-1 mr-2 bg-white text-gray-900 text-xs font-semibold py-2 px-3 rounded-full hover:bg-rose-500 hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                                Quick View
                              </button>
                              <button className="w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-rose-500 group/btn transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110">
                                <Heart className="w-4 h-4 text-gray-600 group-hover/btn:text-white transition-colors" />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Product Rating Preview */}
                        <div className="absolute top-3 left-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full shadow-lg z-10 opacity-0 group-hover/slide:opacity-100 transition-all duration-500 transform -translate-y-2 group-hover/slide:translate-y-0">
                          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                          <span className="text-xs font-semibold text-gray-700">
                            {product.rating || 4.5}
                          </span>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
            </Swiper>

            {/* Dynamic Gradient Overlays */}
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#fdf2f8] via-[#fdf2f8]/80 to-transparent pointer-events-none z-10"></div>
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#fff1f2] via-[#fff1f2]/80 to-transparent pointer-events-none z-10"></div>
          </div>

          {/* Grand Finale CTA */}
          <div className="text-center mt-12 md:mt-15">
            <div className="relative inline-block group/cta">
              <a
                href="/products?featured=true"
                className="relative flex items-center gap-3 bg-gradient-to-r from-rose-600 to-pink-600 text-white px-10 py-4 rounded-full shadow-2xl hover:shadow-rose-200/50 transition-all duration-500 transform hover:scale-105 hover:-translate-y-1"
              >
                <span className="text-lg font-semibold tracking-wide">
                  EXPLORE THE COLLECTION
                </span>
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center group-hover/cta:translate-x-1 transition-transform duration-300">
                  <ChevronRightIcon className="w-5 h-5" />
                </div>
              </a>
            </div>
          </div>
        </div>
      </Container>

      {/* Global Styles for Advanced Animations */}
      <style jsx global>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }

        @keyframes float-slow {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }

        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s cubic-bezier(0.23, 1, 0.32, 1) forwards;
          opacity: 0;
        }

        .perspective-1000 {
          perspective: 1000px;
        }

        .hover\\:rotate-y-6:hover {
          transform: rotateY(6deg);
        }

        .featured-products-swiper {
          margin: -15px -15px -25px -15px;
          padding: 15px 15px 25px 15px;
        }

        .featured-products-swiper .swiper-wrapper {
          align-items: stretch;
        }

        .featured-products-swiper .swiper-slide {
          height: auto;
          display: flex;
          transition: all 0.3s ease;
        }

        .featured-products-swiper .swiper-slide:hover {
          z-index: 50;
        }

        /* Custom Scrollbar */
        .featured-products-swiper::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        .featured-products-swiper::-webkit-scrollbar-track {
          background: linear-gradient(to right, #fce7f3, #fff1f2);
          border-radius: 10px;
        }

        .featured-products-swiper::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #f9a8d4, #fda4af);
          border-radius: 10px;
          border: 2px solid transparent;
        }

        .featured-products-swiper::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #f472b6, #fb7185);
        }

        /* Loading Animation */
        .shimmer {
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.3),
            transparent
          );
          background-size: 1000px 100%;
          animation: shimmer 2s infinite;
        }
      `}</style>
    </section>
  );
};

export default FeatureProducts;
