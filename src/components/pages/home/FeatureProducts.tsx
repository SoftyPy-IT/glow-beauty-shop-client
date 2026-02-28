"use client";

import Card from "@/components/Card/Card";
import CardSkeleton from "@/components/Card/CardSkeleton";
import Container from "@/components/common/Container";
import ServerErrorMessage from "@/components/common/ServerErrorMessage";
import { useGetAllProductsQuery } from "@/redux/features/products/product.api";
import { IProduct } from "@/types/products.types";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { Autoplay, Grid, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const FeatureProducts = () => {
  const isSmallScreen = useMediaQuery({ query: "(max-width: 640px)" });
  const isMediumScreen = useMediaQuery({ query: "(max-width: 1024px)" });
  const {
    data: products,
    isLoading,
    error,
  } = useGetAllProductsQuery([{ name: "is_featured", value: true }]);

  const [key, setKey] = useState(0); // Key state to force re-render
  const data = products?.data as IProduct[];

  useEffect(() => {
    if (products) {
      setKey((prevKey) => prevKey + 1); // Update key on data load
    }
  }, [products]);

  if (error) return <ServerErrorMessage />;

  if (!data || data.length === 0) return null;

  return (
    <section className="bg-white py-8 md:py-12">
      <Container>
        <div className="relative py-4 md:py-6">
          {/* Section Header */}
          <div className="flex flex-col items-center justify-center mb-8 md:mb-10">
            <div className="inline-flex items-center gap-2 text-rose-600 mb-3">
              <Sparkles className="w-5 h-5" />
              <span className="text-sm font-medium uppercase tracking-wider">Curated Selection</span>
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-light text-gray-800 mb-3 text-center">
              Featured <span className="font-medium text-rose-600">Products</span>
            </h2>
            <p className="text-sm text-gray-500 max-w-2xl mx-auto text-center px-4">
              Discover our handpicked selection of premium beauty essentials
            </p>
            <div className="w-16 h-0.5 bg-rose-200 mx-auto mt-4"></div>
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-end mb-6">
            <div className="flex items-center gap-2 bg-white border border-gray-100 rounded-full p-1 shadow-sm">
              <button
                className={`custom-swiper-button-prev-feature flex items-center justify-center w-8 h-8 rounded-full bg-white hover:bg-rose-50 text-gray-600 hover:text-rose-600 transition-all duration-300 focus:outline-none border border-gray-100 hover:border-rose-200`}
                aria-label="Previous products"
              >
                <ChevronLeftIcon className="h-4 w-4" />
              </button>
              <span className="text-xs text-gray-400 px-1">|</span>
              <button
                className={`custom-swiper-button-next-feature flex items-center justify-center w-8 h-8 rounded-full bg-white hover:bg-rose-50 text-gray-600 hover:text-rose-600 transition-all duration-300 focus:outline-none border border-gray-100 hover:border-rose-200`}
                aria-label="Next products"
              >
                <ChevronRightIcon className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Products Swiper */}
          <Swiper
            key={key}
            modules={[Navigation, Autoplay, Grid]}
            spaceBetween={isSmallScreen ? 12 : 20}
            slidesPerView={isSmallScreen ? 2 : isMediumScreen ? 3 : 4}
            navigation={{
              nextEl: ".custom-swiper-button-next-feature",
              prevEl: ".custom-swiper-button-prev-feature",
            }}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            grabCursor={true}
            grid={{
              rows: 2,
              fill: "row",
            }}
            speed={600}
            className="featured-products-swiper pb-2"
          >
            {isLoading
              ? Array.from({
                length: isSmallScreen ? 4 : isMediumScreen ? 6 : 8,
              }).map((_, index) => (
                <SwiperSlide key={index}>
                  <CardSkeleton />
                </SwiperSlide>
              ))
              : data?.map((product) => (
                <SwiperSlide key={product._id} className="swiper-slide">
                  <Card
                    key={product._id}
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
                </SwiperSlide>
              ))}
          </Swiper>

          {/* View All Link */}
          <div className="text-center mt-8 md:mt-10">
            <a
              href="/products?featured=true"
              className="inline-flex items-center text-sm text-gray-500 hover:text-rose-600 transition-colors border-b border-gray-200 hover:border-rose-200 pb-0.5 group"
            >
              View all featured products
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5 ml-1.5 transform transition-transform group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </a>
          </div>
        </div>
      </Container>

      {/* Custom styles for swiper */}
      <style jsx global>{`
        .featured-products-swiper {
          margin: -5px -5px -15px -5px;
          padding: 5px 5px 15px 5px;
        }
        .featured-products-swiper .swiper-wrapper {
          align-items: stretch;
        }
        .featured-products-swiper .swiper-slide {
          height: auto;
          display: flex;
        }
      `}</style>
    </section>
  );
};

export default FeatureProducts;