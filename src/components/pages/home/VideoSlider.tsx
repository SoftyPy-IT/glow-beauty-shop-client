"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  X,
  ShoppingCart,
  Play,
  ExternalLink,
} from "lucide-react";
import Container from "@/components/common/Container";

interface Product {
  id: number;
  title: string;
  category: string;
  price: number;
  originalPrice: number;
  image: string;
  description: string;
}

interface VideoSlide {
  id: number;
  videoSrc: string;
  category: string;
  title: string;
  relatedProducts: Product[];
}

const VideoSliderProfessional = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedSlide, setSelectedSlide] = useState<VideoSlide | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const modalVideoRef = useRef<HTMLVideoElement>(null);
  const sliderVideoRefs = useRef<{ [key: number]: HTMLVideoElement | null }>(
    {},
  );

  // Array of 10 different video files
  const videoFiles = [
    "/videos/video1.mp4",
    "/videos/video2.mp4",
    "/videos/video3.mp4",
    "/videos/video4.mp4",
    "/videos/video5.mp4",
    "/videos/video6.mp4",
    "/videos/video7.mp4",
    "/videos/video8.mp4",
    "/videos/video9.mp4",
    "/videos/video10.mp4",
  ];

  // Categories and titles for variety
  const categories = [
    "Bath & Body Care",
    "Make up",
    "Accessories",
    "Skin Care",
    "Hair Care",
    "Bath & Body Care",
    "Make up",
    "Accessories",
    "Skin Care",
    "Hair Care",
  ];

  const titles = [
    "BALD SPOTS AND",
    "EVENING ELEGANCE",
    "SUMMER BREEZE",
    "WINTER CARE",
    "PARTY READY",
    "NATURAL BEAUTY",
    "BRIDAL COLLECTION",
    "PROFESSIONAL",
    "QUICK DAILY",
    "WEEKEND SPECIAL",
  ];

  // Generate slides data with 10 different videos
  const slides: VideoSlide[] = Array.from({ length: 10 }).map((_, index) => ({
    id: index + 1,
    videoSrc: videoFiles[index],
    category: categories[index],
    title: titles[index],
    relatedProducts: [
      {
        id: 101 + index,
        title: "Premium Serum",
        category: "Skin Care",
        price: 1850,
        originalPrice: 2300,
        image:
          "https://images.unsplash.com/photo-1571781418606-5a2b8c9f7b7e?w=400&h=400&fit=crop",
        description: "Advanced formula for radiant skin.",
      },
      {
        id: 102 + index,
        title: "Velvet Lipstick",
        category: "Make up",
        price: 999,
        originalPrice: 1150,
        image:
          "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&h=400&fit=crop",
        description: "Long-lasting professional finish.",
      },
    ],
  }));

  const handleNext = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev + 1) % slides.length);
    setTimeout(() => setIsTransitioning(false), 600);
  }, [slides.length, isTransitioning]);

  const handlePrev = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
    setTimeout(() => setIsTransitioning(false), 600);
  }, [slides.length, isTransitioning]);

  // Autoplay effect - slides from right to left automatically
  useEffect(() => {
    if (!isAutoPlay || isModalOpen) {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
      return;
    }

    autoPlayRef.current = setInterval(() => {
      handleNext(); // This moves to next slide (right to left effect)
    }, 4000); // 4 seconds for smooth automatic sliding

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [isAutoPlay, isModalOpen, handleNext]);

  // Pause autoplay when user interacts
  const handleManualNavigation = (callback: () => void) => {
    setIsAutoPlay(false);
    callback();
    setTimeout(() => setIsAutoPlay(true), 5000);
  };

  // Reset video when modal opens
  useEffect(() => {
    if (isModalOpen && modalVideoRef.current) {
      modalVideoRef.current.currentTime = 0;
      modalVideoRef.current.play().catch((error) => {
        console.warn("Video autoplay was prevented:", error);
      });
    }

    if (isModalOpen) {
      Object.values(sliderVideoRefs.current).forEach((video) => {
        if (video) video.pause();
      });
    } else {
      Object.values(sliderVideoRefs.current).forEach((video) => {
        if (video) video.play().catch(() => {});
      });
    }
  }, [isModalOpen, selectedSlide?.id]);

  const openModal = (slide: VideoSlide) => {
    setSelectedSlide(slide);
    setIsModalOpen(true);
    setIsAutoPlay(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsAutoPlay(true);
    if (modalVideoRef.current) {
      modalVideoRef.current.pause();
      modalVideoRef.current.currentTime = 0;
    }
  };

  const getVisibleSlides = () => {
    const visible = [];
    // Show 6 slides for the design (from -2 to 3 gives 6 slides)
    for (let i = -2; i <= 3; i++) {
      const index = (currentIndex + i + slides.length) % slides.length;
      visible.push({
        ...slides[index],
        displayIndex: i,
      });
    }
    return visible;
  };

  const getSlideStyles = (pos: number) => {
    // Center is at position 0 and 1 for 6 slides
    const isCenter = pos === 0 || pos === 1;
    const scale = isCenter ? 1.1 : 0.8 - Math.abs(pos) * 0.1;
    const zIndex = 50 - Math.abs(pos) * 5;
    const opacity = isCenter ? 1 : 0.5 - Math.abs(pos) * 0.1;

    // Right to left sliding effect - positive positions move right, negative move left
    const translateX = pos * 160; // Slightly reduced spacing for 6 slides

    return {
      transform: `translateX(${translateX}px) scale(${scale})`,
      zIndex,
      opacity: opacity < 0.3 ? 0.3 : opacity,
      transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
    };
  };

  return (
    <Container>
      <div className="w-full bg-white py-5 px-4 overflow-hidden select-none">
        <div className="mb-3">
          <h2 className="text-2xl font-black text-black tracking-tighter uppercase ">
            FEATURED IN VIDEOS
          </h2>
        </div>

        {/* Main Slider - 6 slides visible */}
        <div className="relative h-[680px] flex justify-center items-center">
          <div className="relative w-full h-full flex justify-center items-center">
            {getVisibleSlides().map((slide, idx) => {
              const styles = getSlideStyles(slide.displayIndex);
              const isCenter =
                slide.displayIndex === 0 || slide.displayIndex === 1;

              return (
                <div
                  key={`${slide.id}-${idx}`}
                  className="absolute cursor-pointer group"
                  style={styles}
                  onClick={() => isCenter && openModal(slide)}
                >
                  <div className="w-60 md:w-68 bg-white rounded-3xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.1)] relative border border-gray-100">
                    {/* Video Container - Increased height */}
                    <div className="relative h-[380px] md:h-[420px] bg-gray-100">
                      <video
                        ref={(el) => {
                          if (el) sliderVideoRefs.current[slide.id] = el;
                        }}
                        src={slide.videoSrc}
                        className="w-full h-full object-cover"
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="metadata"
                      />

                      {/* Play Button Overlay for center slides */}
                      {isCenter && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                          <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                            <Play className="w-6 h-6 text-black fill-black ml-1" />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Compact Content Section - Title, Category, Price and Arrow */}
                    <div className="p-4 flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-base font-bold text-black leading-tight line-clamp-1">
                          {slide.title}
                        </h3>
                        <p className="text-xs text-gray-400 uppercase tracking-wide mt-0.5">
                          {slide.category}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm font-black text-black">
                            ₱{slide.relatedProducts[0].price}
                          </span>
                          {slide.relatedProducts[0].originalPrice >
                            slide.relatedProducts[0].price && (
                            <span className="text-xs text-gray-400 line-through">
                              ₱{slide.relatedProducts[0].originalPrice}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Arrow Icon Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openModal(slide);
                        }}
                        className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-pink-500 hover:text-white transition-all duration-300 group"
                      >
                        <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 pointer-events-none">
            <button
              onClick={() => handleManualNavigation(handlePrev)}
              className="pointer-events-auto w-12 h-12 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-all duration-300 flex items-center justify-center border border-gray-200"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>
            <button
              onClick={() => handleManualNavigation(handleNext)}
              className="pointer-events-auto w-12 h-12 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-all duration-300 flex items-center justify-center border border-gray-200"
              aria-label="Next slide"
            >
              <ChevronRight className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Dot Navigation */}
        <div className="flex justify-center gap-2 mt-8">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setIsAutoPlay(false);
                setCurrentIndex(i);
                setTimeout(() => setIsAutoPlay(true), 5000);
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === currentIndex
                  ? "w-8 bg-pink-500"
                  : "w-2 bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        {/* Enhanced E-commerce Modal - Full Video Left, 2 Products Right */}
        {isModalOpen && selectedSlide && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-white w-full max-w-6xl rounded-3xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] relative">
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 z-20 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Left Side - Full Video */}
              <div className="w-full md:w-3/5 h-[400px] md:h-[600px] bg-black">
                <video
                  ref={modalVideoRef}
                  src={selectedSlide.videoSrc}
                  className="w-full h-full object-contain"
                  autoPlay
                  loop
                  playsInline
                  controls
                />
              </div>

              {/* Right Side - 2 Related Products with Add to Cart */}
              <div className="w-full md:w-2/5 p-8 overflow-y-auto">
                <div className="mb-6">
                  <span className="text-xs font-semibold text-pink-500 uppercase tracking-wider">
                    {selectedSlide.category}
                  </span>
                  <h2 className="text-2xl font-bold text-black mt-1">
                    {selectedSlide.title}
                  </h2>
                </div>

                <div className="space-y-6">
                  <h3 className="font-semibold text-gray-900 text-lg">
                    Featured Products
                  </h3>

                  {/* Product 1 */}
                  <div className="bg-gray-50 rounded-2xl p-5 hover:shadow-lg transition-shadow">
                    <div className="flex gap-4">
                      <img
                        src={selectedSlide.relatedProducts[0].image}
                        alt={selectedSlide.relatedProducts[0].title}
                        className="w-24 h-24 rounded-xl object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 text-lg">
                          {selectedSlide.relatedProducts[0].title}
                        </h4>
                        <p className="text-sm text-gray-500 mt-1">
                          {selectedSlide.relatedProducts[0].category}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="font-black text-xl text-black">
                            ₱{selectedSlide.relatedProducts[0].price}
                          </span>
                          {selectedSlide.relatedProducts[0].originalPrice >
                            selectedSlide.relatedProducts[0].price && (
                            <span className="text-sm text-gray-400 line-through">
                              ₱{selectedSlide.relatedProducts[0].originalPrice}
                            </span>
                          )}
                        </div>
                        <button className="mt-3 w-full bg-black text-white py-3 rounded-xl hover:bg-pink-600 transition-colors flex items-center justify-center gap-2 font-medium">
                          <ShoppingCart className="w-4 h-4" />
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Product 2 */}
                  <div className="bg-gray-50 rounded-2xl p-5 hover:shadow-lg transition-shadow">
                    <div className="flex gap-4">
                      <img
                        src={selectedSlide.relatedProducts[1].image}
                        alt={selectedSlide.relatedProducts[1].title}
                        className="w-24 h-24 rounded-xl object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 text-lg">
                          {selectedSlide.relatedProducts[1].title}
                        </h4>
                        <p className="text-sm text-gray-500 mt-1">
                          {selectedSlide.relatedProducts[1].category}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="font-black text-xl text-black">
                            ₱{selectedSlide.relatedProducts[1].price}
                          </span>
                          {selectedSlide.relatedProducts[1].originalPrice >
                            selectedSlide.relatedProducts[1].price && (
                            <span className="text-sm text-gray-400 line-through">
                              ₱{selectedSlide.relatedProducts[1].originalPrice}
                            </span>
                          )}
                        </div>
                        <button className="mt-3 w-full bg-black text-white py-3 rounded-xl hover:bg-pink-600 transition-colors flex items-center justify-center gap-2 font-medium">
                          <ShoppingCart className="w-4 h-4" />
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* View All Link */}
                  <button className="w-full mt-4 text-pink-500 hover:text-pink-600 font-medium text-center">
                    View All Products →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Container>
  );
};

export default VideoSliderProfessional;
