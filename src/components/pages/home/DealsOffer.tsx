"use client";

import Card from "@/components/Card/Card";
import CardSkeleton from "@/components/Card/CardSkeleton";
import Container from "@/components/common/Container";
import { useGetAllOffersQuery } from "@/redux/features/storefront/storefront.api";
import { IProduct } from "@/types/products.types";
import { IOffers } from "@/types/storefront.types";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { Clock, Gift, Tag } from "lucide-react";
import moment from "moment";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { Navigation, Grid } from "swiper/modules";
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

    return `${days}d ${hours.toString().padStart(2, "0")}h ${minutes
      .toString()
      .padStart(2, "0")}m ${seconds.toString().padStart(2, "0")}s`;
  };

  return (
    <section className="bg-white py-12 md:py-16">
      <Container>
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-2">
              Special{" "}
              <span className="font-semibold text-rose-600">Offers</span>
            </h2>
            <p className="text-sm text-gray-500">
              Limited time deals on premium beauty products
            </p>
          </div>
        </div>

        {/* Offers Grid */}
        <div className="space-y-6">
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
                className="bg-white rounded-xl border border-gray-200 overflow-hidden"
              >
                {/* Offer Header */}
                <div className="bg-gray-50 border-b border-gray-200 p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-rose-100 p-3 rounded-lg">
                        <Gift className="w-5 h-5 text-rose-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-lg md:text-xl font-semibold text-gray-900">
                            {offer.title}
                          </h3>
                          {discountPercentage && (
                            <span className="bg-rose-100 text-rose-700 text-xs font-medium px-2 py-1 rounded">
                              {discountPercentage}% OFF
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">
                          {offer.subTitle || "Exclusive beauty deals"}
                        </p>
                      </div>
                    </div>

                    {/* Timer */}
                    {remainingTime > 0 ? (
                      <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-200">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-700">
                          {formatTime(remainingTime)}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">Offer ended</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Products Section */}
                <div className="p-6">
                  {/* Controls */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-500">
                      {offer.products.length}{" "}
                      {offer.products.length === 1 ? "item" : "items"} available
                    </span>

                    <div className="flex items-center gap-4">
                      <Link
                        href={`/offers/${offer._id}`}
                        className="text-sm text-rose-600 hover:text-rose-700 font-medium"
                      >
                        View all
                      </Link>

                      <div className="flex items-center gap-2">
                        <button
                          className={`swiper-button-prev-offer-${offer._id} w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-rose-600 hover:border-rose-200 transition-colors`}
                          aria-label="Previous products"
                        >
                          <ChevronLeftIcon className="h-4 w-4" />
                        </button>
                        <button
                          className={`swiper-button-next-offer-${offer._id} w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-rose-600 hover:border-rose-200 transition-colors`}
                          aria-label="Next products"
                        >
                          <ChevronRightIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Products Swiper */}
                  <Swiper
                    key={`${key}-${index}`}
                    modules={[Navigation, Grid]}
                    spaceBetween={16}
                    slidesPerView={isSmallScreen ? 2 : isMediumScreen ? 3 : 4}
                    navigation={{
                      nextEl: `.swiper-button-next-offer-${offer._id}`,
                      prevEl: `.swiper-button-prev-offer-${offer._id}`,
                    }}
                    grabCursor={true}
                    grid={{
                      rows: 2,
                      fill: "row",
                    }}
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
            );
          })}
        </div>
      </Container>

      {/* Custom styles for swiper */}
      <style jsx global>{`
        .deals-offer-swiper {
          margin: -4px -4px -12px -4px;
          padding: 4px 4px 12px 4px;
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
