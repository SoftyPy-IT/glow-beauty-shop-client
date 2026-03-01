"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  X,
  ShoppingCart,
  Play,
  ExternalLink,
} from "lucide-react";

// Assuming these are the real video imports provided in the snippet
// Note: In a real environment, these paths would need to exist
const videos = [
  "/assets/video/video.mp4",
  "/assets/video/video.mp4",
  "/assets/video/video.mp4",
  "/assets/video/video.mp4",
  "/assets/video/video.mp4",
  "/assets/video/video.mp4",
  "/assets/video/video.mp4",
  "/assets/video/video.mp4",
  "/assets/video/video.mp4",
  "/assets/video/video.mp4",
  "/assets/video/video.mp4",
  "/assets/video/video.mp4",
];

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
  thumbnail: string;
  category: string;
  title: string;
  relatedProducts: Product[];
}

const VideoSliderAdvanced = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedSlide, setSelectedSlide] = useState<VideoSlide | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  // Mock data for the slides
  const slides: VideoSlide[] = videos.map((src, index) => ({
    id: index + 1,
    videoSrc: src,
    thumbnail: `https://images.unsplash.com/photo-${1596704017254 + index}-9b121068fb31?q=80&w=500&auto=format&fit=crop`,
    category: index % 2 === 0 ? "Skin Care" : "Make up",
    title: `Featured Beauty Look ${index + 1}`,
    relatedProducts: [
      {
        id: 101,
        title: "Dark Spot Serum",
        category: "Skin Care",
        price: 1850,
        originalPrice: 2300,
        image:
          "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=200&auto=format&fit=crop",
        description: "Advanced Niacinamide formula for spot correction.",
      },
      {
        id: 102,
        title: "Matte Lipstick",
        category: "Make up",
        price: 999,
        originalPrice: 1200,
        image:
          "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?q=80&w=200&auto=format&fit=crop",
        description: "Long-lasting velvet matte finish.",
      },
      {
        id: 103,
        title: "Hydrating Cream",
        category: "Skin Care",
        price: 2100,
        originalPrice: 2500,
        image:
          "https://images.unsplash.com/photo-1556228578-8c89e6adf883?q=80&w=200&auto=format&fit=crop",
        description: "24h moisture lock for radiant skin.",
      },
    ],
  }));

  useEffect(() => {
    if (!isAutoPlay) return;
    autoPlayRef.current = setInterval(() => {
      handleNext();
    }, 5000);
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [isAutoPlay, currentIndex]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const openModal = (slide: VideoSlide) => {
    setSelectedSlide(slide);
    setIsModalOpen(true);
    setIsAutoPlay(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsAutoPlay(true);
  };

  const getVisibleSlides = () => {
    const visible = [];
    // Show 6 slides for a professional look
    for (let i = -3; i <= 2; i++) {
      visible.push(slides[(currentIndex + i + slides.length) % slides.length]);
    }
    return visible;
  };

  const getSlideStyles = (index: number) => {
    const positions = [-3, -2, -1, 0, 1, 2];
    const pos = positions[index];

    // Professional 3D Stack Effect
    const scale = pos === 0 ? 1.1 : 1 - Math.abs(pos) * 0.12;
    const zIndex = 50 - Math.abs(pos) * 10;
    const opacity = 1 - Math.abs(pos) * 0.25;
    const translateX = pos * 160; // Narrower width for 6 slides

    return {
      transform: `translateX(${translateX}px) scale(${scale})`,
      zIndex,
      opacity,
    };
  };

  return (
    <div className="w-full bg-white py-20 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto mb-16">
        <h2 className="text-4xl font-extrabold text-black tracking-tighter uppercase">
          Featured in Videos
        </h2>
      </div>

      {/* Main Slider Area */}
      <div className="relative h-[650px] flex justify-center items-center">
        <div className="relative w-full h-full flex justify-center items-center">
          {getVisibleSlides().map((slide, index) => {
            const styles = getSlideStyles(index);
            return (
              <div
                key={`${slide.id}-${index}`}
                className="absolute transition-all duration-1000 ease-in-out cursor-pointer group"
                style={styles}
                onClick={() => index === 3 && openModal(slide)}
              >
                <div className="w-48 md:w-56 h-[500px] md:h-[580px] bg-white rounded-3xl overflow-hidden shadow-2xl relative">
                  <img
                    src={slide.thumbnail}
                    alt={slide.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />

                  {/* Play Icon */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30">
                      <Play className="w-8 h-8 text-white fill-white" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <p className="text-xs font-bold uppercase tracking-widest text-white/70 mb-1">
                      {slide.category}
                    </p>
                    <h3 className="text-lg font-bold leading-tight mb-4">
                      {slide.title}
                    </h3>
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        openModal(slide);
                      }}
                      className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-black hover:bg-gray-200 transition-colors"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation */}
        <button
          onClick={handlePrev}
          className="absolute left-4 md:left-12 z-50 p-4 bg-white/80 backdrop-blur-md rounded-full shadow-xl hover:bg-white transition-all"
        >
          <ChevronLeft className="w-6 h-6 text-black" />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-4 md:right-12 z-50 p-4 bg-white/80 backdrop-blur-md rounded-full shadow-xl hover:bg-white transition-all"
        >
          <ChevronRight className="w-6 h-6 text-black" />
        </button>
      </div>

      {/* Advanced Modal */}
      {isModalOpen && selectedSlide && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-6xl rounded-[2rem] overflow-hidden flex flex-col md:flex-row h-[90vh] md:h-[80vh] shadow-2xl relative animate-in zoom-in-95 duration-300">
            <button
              onClick={closeModal}
              className="absolute top-6 right-6 z-[110] p-2 bg-black/10 hover:bg-black/20 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-black" />
            </button>

            {/* Left: Video Player */}
            <div className="w-full md:w-[60%] h-1/2 md:h-full bg-black relative">
              <video
                src={selectedSlide.videoSrc}
                className="w-full h-full object-cover"
                autoPlay
                loop
                controls
              />
            </div>

            {/* Right: Related Products Slider */}
            <div className="w-full md:w-[40%] h-1/2 md:h-full p-8 flex flex-col bg-gray-50 overflow-y-auto">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-black mb-2">
                  {selectedSlide.title}
                </h2>
                <p className="text-gray-500 text-sm">
                  Shop the products featured in this video.
                </p>
              </div>

              <div className="flex-1 space-y-6">
                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">
                  Featured Products
                </h3>
                <div className="space-y-4">
                  {selectedSlide.relatedProducts.map((product) => (
                    <div
                      key={product.id}
                      className="bg-white p-4 rounded-2xl shadow-sm flex gap-4 group hover:shadow-md transition-shadow"
                    >
                      <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                          <h4 className="font-bold text-black leading-tight group-hover:text-pink-600 transition-colors">
                            {product.title}
                          </h4>
                          <p className="text-xs text-gray-500 line-clamp-1 mt-1">
                            {product.description}
                          </p>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-baseline gap-2">
                            <span className="font-bold text-lg">
                              ₹{product.price}
                            </span>
                            <span className="text-xs text-gray-400 line-through">
                              ₹{product.originalPrice}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <button className="p-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
                              <ShoppingCart className="w-4 h-4" />
                            </button>
                            <a
                              href={`/product/${product.id}`}
                              className="p-2 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button className="mt-8 w-full bg-black text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-all shadow-lg">
                View All Products
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoSliderAdvanced;
