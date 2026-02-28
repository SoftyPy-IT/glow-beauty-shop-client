"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import "swiper/css";
import "swiper/css/autoplay";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Container from "@/components/common/Container";
import { useGetCategoriesTreeQuery } from "@/redux/features/products/category.api";
import Image from "next/image";

export type TCategory = {
  _id: string;
  name: string;
  image: string;
  slug: string;
};

const CategoriesSection = () => {
  const { data: categories, isLoading } = useGetCategoriesTreeQuery(undefined);
  const data = categories as TCategory[] | undefined;
  const [key, setKey] = useState(0);

  useEffect(() => {
    if (categories) {
      setKey((prevKey) => prevKey + 1);
    }
  }, [categories]);

  return (
    <section className="py-8 sm:py-12 bg-gradient-to-b from-white to-rose-50/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Shop by <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-rose-600">Category</span>
          </h2>
          <p className="text-sm sm:text-base text-pink-400 max-w-2xl mx-auto">
            Discover our wide range of beauty products tailored for your needs
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-pink-300 to-rose-300 mx-auto mt-4 rounded-full"></div>
        </div>

        <Swiper
          key={key}
          modules={[Autoplay]}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          loop={true}
          speed={800}
          breakpoints={{
            320: {
              slidesPerView: 2.5,
              spaceBetween: 12
            },
            480: {
              slidesPerView: 3,
              spaceBetween: 15
            },
            640: {
              slidesPerView: 4,
              spaceBetween: 20
            },
            768: {
              slidesPerView: 4,
              spaceBetween: 25
            },
            1024: {
              slidesPerView: 5,
              spaceBetween: 30
            },
            1280: {
              slidesPerView: 6,
              spaceBetween: 30
            },
          }}
          className="categories-swiper pb-4"
        >
          {isLoading
            ? Array.from({ length: 6 }).map((_, index) => (
              <SwiperSlide key={`skeleton-${index}`}>
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 bg-gradient-to-r from-pink-100 to-rose-100 rounded-2xl animate-pulse shadow-sm"></div>
                  <div className="mt-3 h-4 w-20 bg-pink-100 rounded-full animate-pulse"></div>
                </div>
              </SwiperSlide>
            ))
            : data?.map((category) => (
              <SwiperSlide key={category._id}>
                <Link
                  href={`/categories/${category.slug}`}
                  className="group block"
                >
                  <div className="flex flex-col items-center">
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-pink-50 to-rose-50 p-4 shadow-md hover:shadow-xl transition-all duration-300 group-hover:scale-105 border border-pink-100">
                      <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 mx-auto">
                        <Image
                          src={category.image}
                          alt={category.name}
                          fill
                          sizes="(max-width: 640px) 80px, (max-width: 768px) 96px, (max-width: 1024px) 112px, 128px"
                          className="object-contain transition-transform duration-500 group-hover:scale-110"
                          priority
                        />
                      </div>
                      {/* Decorative elements */}
                      <div className="absolute top-2 right-2 w-2 h-2 bg-pink-300 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="absolute bottom-2 left-2 w-3 h-3 bg-rose-300 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                    <p className="mt-3 text-xs sm:text-sm font-medium text-gray-700 uppercase tracking-wide group-hover:text-rose-600 transition-colors">
                      {category.name.length > 12
                        ? `${category.name.slice(0, 12)}...`
                        : category.name}
                    </p>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
        </Swiper>

        {/* Show All Link */}
        <div className="flex justify-center mt-8 sm:mt-10">
          <Link
            href="/products/categories"
            className="inline-flex items-center gap-2 text-sm sm:text-base font-medium text-pink-600 hover:text-rose-600 transition-colors group"
          >
            <span>Browse All Categories</span>
            <svg
              className="w-4 h-4 group-hover:translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Custom CSS for Swiper */}
      <style jsx global>{`
        .categories-swiper {
          padding: 10px 5px;
          margin: -10px -5px;
        }
        .categories-swiper .swiper-slide {
          height: auto;
          display: flex;
          justify-content: center;
        }
      `}</style>
    </section>
  );
};

export default CategoriesSection;