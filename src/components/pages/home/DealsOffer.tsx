"use client";

import Card from "@/components/Card/Card";
import CardSkeleton from "@/components/Card/CardSkeleton";
import Container from "@/components/common/Container";
import { useGetAllOffersQuery } from "@/redux/features/storefront/storefront.api";
import { IProduct } from "@/types/products.types";
import { IOffers } from "@/types/storefront.types";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { Clock, Gift, Sparkles, Zap } from "lucide-react";
import moment from "moment";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { Autoplay, Grid, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const DealsOffer: React.FC = () => {
  const { data: offers, isLoading, isError } = useGetAllOffersQuery(undefined);
  console.log("deals data", offers);
  const [remainingTimes, setRemainingTimes] = useState<{
    [key: string]: number;
  }>({});
  const [key, setKey] = useState(0);
  const data = offers?.data as IOffers[];
  const isSmallScreen = useMediaQuery({ query: "(max-width: 640px)" });
  const isMediumScreen = useMediaQuery({ query: "(max-width: 1024px)" });
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (offers) {
      setKey((prevKey) => prevKey + 1);
    }
  }, [offers]);

  // Set up timers for all offers
  useEffect(() => {
    if (!data || data.length === 0) return;

    // Initialize remaining times for all offers
    const initialTimes: { [key: string]: number } = {};
    data.forEach((offer) => {
      const endDate = moment(offer.endDate).valueOf();
      const now = moment().valueOf();
      initialTimes[offer._id] = Math.max(0, endDate - now);
    });
    setRemainingTimes(initialTimes);

    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // Set up interval to update all timers
    timerRef.current = setInterval(() => {
      setRemainingTimes((prevTimes) => {
        const newTimes: { [key: string]: number } = {};
        let hasPositive = false;

        Object.keys(prevTimes).forEach((offerId) => {
          const newTime = Math.max(0, prevTimes[offerId] - 1000);
          newTimes[offerId] = newTime;
          if (newTime > 0) hasPositive = true;
        });

        // If all timers are zero, clear the interval
        if (!hasPositive && timerRef.current) {
          clearInterval(timerRef.current);
        }

        return newTimes;
      });
    }, 1000);

    // Cleanup on unmount
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [data]);

  if (isError || !offers) return null;

  if (!data || data.length === 0) return null;

  const renderTimer = (time: number): React.ReactNode => {
    const duration = moment.duration(time);
    const days = Math.floor(duration.asDays());
    const hours = duration.hours();
    const minutes = duration.minutes();
    const seconds = duration.seconds();

    return (
      <div className="flex items-center justify-center gap-2 sm:gap-3">
        <div className="flex flex-col items-center">
          <span className="text-xl sm:text-2xl md:text-3xl font-bold text-rose-600 bg-rose-50 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-lg flex items-center justify-center">
            {days}
          </span>
          <span className="text-xs text-gray-500 mt-1">Days</span>
        </div>
        <span className="text-rose-300 text-xl font-bold">:</span>
        <div className="flex flex-col items-center">
          <span className="text-xl sm:text-2xl md:text-3xl font-bold text-rose-600 bg-rose-50 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-lg flex items-center justify-center">
            {hours.toString().padStart(2, "0")}
          </span>
          <span className="text-xs text-gray-500 mt-1">Hours</span>
        </div>
        <span className="text-rose-300 text-xl font-bold">:</span>
        <div className="flex flex-col items-center">
          <span className="text-xl sm:text-2xl md:text-3xl font-bold text-rose-600 bg-rose-50 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-lg flex items-center justify-center">
            {minutes.toString().padStart(2, "0")}
          </span>
          <span className="text-xs text-gray-500 mt-1">Mins</span>
        </div>
        <span className="text-rose-300 text-xl font-bold">:</span>
        <div className="flex flex-col items-center">
          <span className="text-xl sm:text-2xl md:text-3xl font-bold text-rose-600 bg-rose-50 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-lg flex items-center justify-center">
            {seconds.toString().padStart(2, "0")}
          </span>
          <span className="text-xs text-gray-500 mt-1">Secs</span>
        </div>
      </div>
    );
  };

  return (
    <section className="bg-gradient-to-b from-white to-rose-50/30 py-8 md:py-12">
      <Container>
        {data.map((offer, index) => {
          const remainingTime = remainingTimes[offer._id] || 0;

          return (
            <div
              key={offer._id}
              className="relative bg-white rounded-2xl shadow-sm border border-rose-100 overflow-hidden mb-8 last:mb-0"
            >
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-rose-200/20 to-pink-200/20 rounded-full -mr-20 -mt-20"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-pink-200/20 to-rose-200/20 rounded-full -ml-16 -mb-16"></div>

              {/* Offer Header with Timer */}
              <div className="relative bg-gradient-to-r from-rose-600 to-pink-600 p-6 md:p-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                      <Gift className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">
                        {offer.title}
                      </h2>
                      <p className="text-rose-100 text-sm flex items-center gap-1">
                        <Sparkles className="w-4 h-4" />
                        {offer.subTitle ||
                          "Exclusive beauty deals just for you"}
                      </p>
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 md:px-6 md:py-4">
                    {remainingTime > 0 ? (
                      <div className="flex flex-col items-center">
                        <span className="text-xs text-rose-100 mb-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Hurry! Offer ends in
                        </span>
                        {renderTimer(remainingTime)}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-rose-100">
                        <Zap className="w-5 h-5" />
                        <span className="font-medium">
                          This offer has ended
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Products Section */}
              <div className="p-6 md:p-8">
                {/* Navigation and View All */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">
                      {offer.products.length}{" "}
                      {offer.products.length === 1 ? "product" : "products"} on
                      sale
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <Link
                      href={`/offers/${offer._id}`}
                      className="text-sm text-rose-600 hover:text-rose-700 transition-colors border-b border-rose-200 hover:border-rose-300 pb-0.5"
                    >
                      View all deals
                    </Link>

                    <div className="flex items-center gap-2 bg-gray-50 rounded-full p-1 border border-gray-100">
                      <button
                        className={`swiper-button-prev-offer-${offer._id} flex items-center justify-center w-8 h-8 rounded-full bg-white hover:bg-rose-50 text-gray-600 hover:text-rose-600 transition-all duration-300 focus:outline-none border border-gray-200 hover:border-rose-200`}
                        aria-label="Previous products"
                      >
                        <ChevronLeftIcon className="h-4 w-4" />
                      </button>
                      <span className="text-xs text-gray-300">|</span>
                      <button
                        className={`swiper-button-next-offer-${offer._id} flex items-center justify-center w-8 h-8 rounded-full bg-white hover:bg-rose-50 text-gray-600 hover:text-rose-600 transition-all duration-300 focus:outline-none border border-gray-200 hover:border-rose-200`}
                        aria-label="Next products"
                      >
                        <ChevronRightIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Products Swiper */}
                <div className="w-full h-full">
                  <Swiper
                    key={`${key}-${index}`}
                    modules={[Navigation, Autoplay, Grid]}
                    spaceBetween={isSmallScreen ? 12 : 20}
                    slidesPerView={isSmallScreen ? 2 : isMediumScreen ? 3 : 4}
                    navigation={{
                      nextEl: `.swiper-button-next-offer-${offer._id}`,
                      prevEl: `.swiper-button-prev-offer-${offer._id}`,
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
                    className="deals-offer-swiper"
                  >
                    {isLoading
                      ? Array.from({
                          length: isSmallScreen ? 4 : isMediumScreen ? 6 : 8,
                        }).map((_, idx) => (
                          <SwiperSlide key={idx}>
                            <CardSkeleton />
                          </SwiperSlide>
                        ))
                      : offer.products.map((product: IProduct) => (
                          <SwiperSlide key={product._id}>
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
                          </SwiperSlide>
                        ))}
                  </Swiper>
                </div>
              </div>
            </div>
          );
        })}
      </Container>

      {/* Custom styles for swiper */}
      <style jsx global>{`
        .deals-offer-swiper {
          margin: -5px -5px -15px -5px;
          padding: 5px 5px 15px 5px;
        }
        .deals-offer-swiper .swiper-wrapper {
          align-items: stretch;
        }
        .deals-offer-swiper .swiper-slide {
          height: auto;
          display: flex;
        }
      `}</style>
    </section>
  );
};

export default DealsOffer;
