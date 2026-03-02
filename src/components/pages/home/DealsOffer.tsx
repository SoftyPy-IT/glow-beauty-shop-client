"use client";

import Card from "@/components/Card/Card";
import CardSkeleton from "@/components/Card/CardSkeleton";
import Container from "@/components/common/Container";
import { useGetAllOffersQuery } from "@/redux/features/storefront/storefront.api";
import { IProduct } from "@/types/products.types";
import { IOffers } from "@/types/storefront.types";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { Clock, Gift, Tag, Sparkles, Zap } from "lucide-react";
import moment from "moment";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { Navigation, Grid, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/grid";
import "swiper/css/navigation";

const DealsOffer: React.FC = () => {
  const { data: offers, isLoading, isError } = useGetAllOffersQuery(undefined);
  const [remainingTimes, setRemainingTimes] = useState<{
    [key: string]: number;
  }>({});
  const [key, setKey] = useState(0);
  const data = offers?.data as IOffers[];

  // Responsive breakpoints
  const isMobile = useMediaQuery({ query: "(max-width: 480px)" });
  const isTablet = useMediaQuery({ query: "(max-width: 768px)" });
  const isLaptop = useMediaQuery({ query: "(max-width: 1024px)" });
  const isDesktop = useMediaQuery({ query: "(max-width: 1280px)" });

  const timerRef = useRef<NodeJS.Timeout>();

  // Get slides per view based on screen size
  const getSlidesPerView = () => {
    if (isMobile) return 2;
    if (isTablet) return 3;
    if (isLaptop) return 4;
    if (isDesktop) return 4;
    return 5; // Desktop shows 5 products
  };

  // Get grid rows based on screen size
  const getGridRows = () => {
    if (isMobile) return 1;
    if (isTablet) return 1;
    return 2; // Show 2 rows on larger screens
  };

  useEffect(() => {
    if (offers) {
      setKey((prevKey) => prevKey + 1);
    }
  }, [offers]);

  // Set up timers for all offers
  useEffect(() => {
    if (!data || data.length === 0) return;

    const initialTimes: { [key: string]: number } = {};
    data.forEach((offer) => {
      const endDate = moment(offer.endDate).valueOf();
      const now = moment().valueOf();
      initialTimes[offer._id] = Math.max(0, endDate - now);
    });
    setRemainingTimes(initialTimes);

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      setRemainingTimes((prevTimes) => {
        const newTimes: { [key: string]: number } = {};
        let hasPositive = false;

        Object.keys(prevTimes).forEach((offerId) => {
          const newTime = Math.max(0, prevTimes[offerId] - 1000);
          newTimes[offerId] = newTime;
          if (newTime > 0) hasPositive = true;
        });

        if (!hasPositive && timerRef.current) {
          clearInterval(timerRef.current);
        }

        return newTimes;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [data]);

  if (isError || !offers) return null;
  if (!data || data.length === 0) return null;

  const formatTime = (time: number): string => {
    const duration = moment.duration(time);
    const days = Math.floor(duration.asDays());
    const hours = duration.hours();
    const minutes = duration.minutes();
    const seconds = duration.seconds();

    if (days > 0) {
      return `${days}d ${hours.toString().padStart(2, "0")}h`;
    }
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  // Get gradient based on offer index
  const getOfferGradient = (index: number) => {
    const gradients = [
      "from-rose-50/80 to-pink-50/80 border-rose-100/50",
      "from-purple-50/80 to-violet-50/80 border-purple-100/50",
      "from-blue-50/80 to-cyan-50/80 border-blue-100/50",
      "from-amber-50/80 to-orange-50/80 border-amber-100/50",
      "from-emerald-50/80 to-teal-50/80 border-emerald-100/50",
    ];
    return gradients[index % gradients.length];
  };

  const slidesPerView = getSlidesPerView();
  const gridRows = getGridRows();

  return (
    <section className="bg-white py-12 lg:py-16">
      <Container>
        {/* Section Header - Minimal */}
        <div className="flex items-center justify-between mb-8 lg:mb-10">
          <div>
            <h2 className="text-2xl lg:text-3xl font-light text-gray-900 mb-1">
              Special{" "}
              <span className="font-semibold text-rose-600">Offers</span>
            </h2>
            <p className="text-xs lg:text-sm text-gray-500">
              Limited time deals on premium beauty products
            </p>
          </div>
        </div>

        {/* Offers Grid */}
        <div className="space-y-4 lg:space-y-6">
          {data.map((offer, index) => {
            const remainingTime = remainingTimes[offer._id] || 0;
            const discountPercentage =
              offer.discountPercentage ||
              (offer.products[0]?.discount_price && offer.products[0]?.price
                ? Math.round(
                    ((offer.products[0].price -
                      offer.products[0].discount_price) /
                      offer.products[0].price) *
                      100,
                  )
                : null);

            return (
              <div
                key={offer._id}
                className={`relative bg-white rounded-xl lg:rounded-2xl border bg-gradient-to-br ${getOfferGradient(
                  index,
                )} shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden`}
              >
                {/* Offer Header - Compact */}
                <div className="relative border-b border-gray-100 bg-white/80 backdrop-blur-sm p-3 lg:p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="flex items-start gap-2 lg:gap-3">
                      <div className="relative shrink-0">
                        <div className="bg-white p-1.5 lg:p-2 rounded-lg shadow-xs">
                          <Gift className="w-4 h-4 lg:w-5 lg:h-5 text-rose-600" />
                        </div>
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 lg:gap-2 mb-0.5">
                          <h3 className="text-sm lg:text-base font-semibold text-gray-900 truncate max-w-[150px] lg:max-w-[200px]">
                            {offer.title}
                          </h3>
                          {discountPercentage && (
                            <span className="shrink-0 bg-rose-100 text-rose-700 text-[10px] lg:text-xs font-medium px-1.5 lg:px-2 py-0.5 rounded">
                              {discountPercentage}%
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] lg:text-xs text-gray-500 truncate max-w-[180px] lg:max-w-[250px]">
                          {offer.subTitle || "Exclusive beauty deals"}
                        </p>
                      </div>
                    </div>

                    {/* Timer - Compact */}
                    {remainingTime > 0 ? (
                      <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur-sm px-2 lg:px-3 py-1 lg:py-1.5 rounded-full border border-gray-200 shadow-xs shrink-0 self-start sm:self-auto">
                        <Clock className="w-3 h-3 lg:w-3.5 lg:h-3.5 text-rose-500" />
                        <span className="text-[10px] lg:text-xs font-medium text-gray-900">
                          {formatTime(remainingTime)}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-gray-400 bg-gray-50 px-2 lg:px-3 py-1 lg:py-1.5 rounded-full shrink-0 self-start sm:self-auto">
                        <Clock className="w-3 h-3 lg:w-3.5 lg:h-3.5" />
                        <span className="text-[10px] lg:text-xs">Ended</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Products Section - Compact */}
                <div className="p-3 lg:p-4">
                  {/* Controls - Minimal */}
                  <div className="flex items-center justify-between mb-3 lg:mb-4">
                    <div className="flex items-center gap-1.5 lg:gap-2">
                      <div className="flex items-center gap-1 bg-gray-100 px-1.5 lg:px-2 py-0.5 lg:py-1 rounded-full">
                        <Tag className="w-2.5 h-2.5 lg:w-3 lg:h-3 text-gray-500" />
                        <span className="text-[9px] lg:text-xs font-medium text-gray-600">
                          {offer.products.length}{" "}
                          {offer.products.length === 1 ? "item" : "items"}
                        </span>
                      </div>
                      {offer.products.length > 4 && (
                        <span className="flex items-center gap-0.5 text-[9px] lg:text-xs text-amber-600 bg-amber-50 px-1.5 lg:px-2 py-0.5 lg:py-1 rounded-full">
                          <Zap className="w-2.5 h-2.5 lg:w-3 lg:h-3" />
                          <span className="hidden xs:inline">Limited</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 lg:gap-3">
                      <Link
                        href={`/offers/${offer._id}`}
                        className="text-[10px] lg:text-xs font-medium text-rose-600 hover:text-rose-700 transition-colors flex items-center gap-0.5 group/link"
                      >
                        <span>View all</span>
                        <ChevronRightIcon className="w-2.5 h-2.5 lg:w-3 lg:h-3 transition-transform group-hover/link:translate-x-0.5" />
                      </Link>

                      <div className="flex items-center gap-1 lg:gap-1.5">
                        <button
                          className={`swiper-button-prev-offer-${offer._id} w-5 h-5 lg:w-6 lg:h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-rose-600 hover:border-rose-200 transition-all shadow-xs`}
                          aria-label="Previous products"
                        >
                          <ChevronLeftIcon className="h-3 w-3 lg:h-3.5 lg:w-3.5" />
                        </button>
                        <button
                          className={`swiper-button-next-offer-${offer._id} w-5 h-5 lg:w-6 lg:h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-rose-600 hover:border-rose-200 transition-all shadow-xs`}
                          aria-label="Next products"
                        >
                          <ChevronRightIcon className="h-3 w-3 lg:h-3.5 lg:w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Products Swiper - Optimized for 5 products */}
                  <Swiper
                    key={`${key}-${index}-${slidesPerView}`}
                    modules={[Navigation, Grid, Autoplay]}
                    spaceBetween={8}
                    slidesPerView={slidesPerView}
                    navigation={{
                      nextEl: `.swiper-button-next-offer-${offer._id}`,
                      prevEl: `.swiper-button-prev-offer-${offer._id}`,
                    }}
                    autoplay={{
                      delay: 5000,
                      disableOnInteraction: false,
                      pauseOnMouseEnter: true,
                    }}
                    grabCursor={true}
                    grid={{
                      rows: gridRows,
                      fill: "row",
                    }}
                    breakpoints={{
                      480: {
                        slidesPerView: 2,
                        grid: { rows: 1, fill: "row" },
                        spaceBetween: 10,
                      },
                      640: {
                        slidesPerView: 3,
                        grid: { rows: 1, fill: "row" },
                        spaceBetween: 12,
                      },
                      1024: {
                        slidesPerView: 4,
                        grid: { rows: 2, fill: "row" },
                        spaceBetween: 12,
                      },
                      1280: {
                        slidesPerView: 5,
                        grid: { rows: 2, fill: "row" },
                        spaceBetween: 15,
                      },
                    }}
                    className="deals-offer-swiper"
                  >
                    {isLoading
                      ? Array.from({
                          length: slidesPerView * gridRows,
                        }).map((_, idx) => (
                          <SwiperSlide key={idx}>
                            <div className="h-full w-full">
                              <CardSkeleton />
                            </div>
                          </SwiperSlide>
                        ))
                      : offer.products.map(
                          (product: IProduct, productIndex) => (
                            <SwiperSlide key={product._id}>
                              <div
                                className="h-full w-full animate-fadeIn"
                                style={{
                                  animationDelay: `${productIndex * 30}ms`,
                                }}
                              >
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
                            </SwiperSlide>
                          ),
                        )}
                  </Swiper>
                </div>
              </div>
            );
          })}
        </div>
      </Container>

      {/* Custom styles for swiper and cards */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }

        .deals-offer-swiper {
          margin: -2px -2px -8px -2px;
          padding: 2px 2px 8px 2px;
        }

        .deals-offer-swiper .swiper-wrapper {
          align-items: stretch;
        }

        .deals-offer-swiper .swiper-slide {
          height: auto;
          display: flex;
          transition: transform 0.2s ease;
        }

        .deals-offer-swiper .swiper-slide:hover {
          transform: translateY(-2px);
        }

        /* Ensure cards don't overflow */
        .deals-offer-swiper .swiper-slide > div {
          width: 100%;
          min-width: 0;
        }

        /* Hide autoplay on hover */
        .deals-offer-swiper:hover .swiper-button-prev,
        .deals-offer-swiper:hover .swiper-button-next {
          opacity: 1;
        }

        /* Responsive adjustments */
        @media (max-width: 480px) {
          .deals-offer-swiper {
            margin: 0 -2px;
          }
        }
      `}</style>
    </section>
  );
};

export default DealsOffer;
