"use client";

import { useGetAllBlogQuery } from "@/redux/features/blog.api";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import Container from "@/components/common/Container";
import { motion, useInView } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { Calendar, User, ArrowRight, BookOpen, Clock } from "lucide-react";

// Define TypeScript interfaces
interface Blog {
  id: string | number;
  title: string;
  slug: string;
  description?: string;
  thumbnail?: string;
  category?: string;
  publishedAt?: string;
  readingTime?: number;
  author?: {
    name: string;
    avatar?: string;
  };
}

interface QueryParam {
  name: string;
  value: string | number;
}

const NewsSection = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [imageErrors, setImageErrors] = useState<
    Record<string | number, boolean>
  >({});
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const { data: blogData, isLoading: blogLoading } = useGetAllBlogQuery([
    { name: "limit", value: 4 },
  ] as QueryParam[]);

  const blogs: Blog[] = blogData?.data || [];

  const handleImageError = (blogId: string | number) => {
    setImageErrors((prev) => ({ ...prev, [blogId]: true }));
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get consistent category colors
  const getCategoryColor = (category: string = "Beauty") => {
    const colors = {
      Skincare: "bg-sky-50 text-sky-600 border-sky-200",
      Makeup: "bg-rose-50 text-rose-600 border-rose-200",
      Haircare: "bg-purple-50 text-purple-600 border-purple-200",
      Wellness: "bg-emerald-50 text-emerald-600 border-emerald-200",
      Trends: "bg-amber-50 text-amber-600 border-amber-200",
      default: "bg-pink-50 text-pink-600 border-pink-200",
    };
    return colors[category as keyof typeof colors] || colors.default;
  };

  // Blog Card Component
  const BlogCard = ({ blog, index }: { blog: Blog; index: number }) => {
    const [isHovered, setIsHovered] = useState(false);
    const cardRef = useRef(null);
    const isCardInView = useInView(cardRef, { once: true, margin: "-50px" });
    const hasImageError = imageErrors[blog.id];

    return (
      <motion.article
        ref={cardRef}
        initial={{ opacity: 0, y: 30 }}
        animate={isCardInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 h-full flex flex-col"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Container - Fixed aspect ratio with object-cover */}
        <div className="relative w-full pt-[56.25%] bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
          {blog.thumbnail && !hasImageError ? (
            <>
              <Image
                src={blog.thumbnail}
                alt={blog.title || "Blog image"}
                fill
                className={`absolute inset-0 object-cover transition-transform duration-700 ${
                  isHovered ? "scale-105" : "scale-100"
                }`}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                onError={() => handleImageError(blog.id)}
                priority={index < 2}
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-pink-50 to-rose-50">
              <BookOpen className="w-12 h-12 text-pink-300" strokeWidth={1.5} />
            </div>
          )}

          {/* Category Badge - Fixed positioning */}
          <div
            className={`absolute top-3 left-3 z-10 ${getCategoryColor(blog.category)} px-2.5 py-1 rounded-full text-[10px] font-medium border shadow-sm backdrop-blur-sm`}
          >
            {blog.category || "Beauty"}
          </div>

          {/* Reading Time Badge */}
          {blog.readingTime && (
            <div className="absolute top-3 right-3 z-10 bg-white/90 backdrop-blur-sm text-gray-600 px-2.5 py-1 rounded-full text-[10px] font-medium border border-gray-200 shadow-sm flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{blog.readingTime} min</span>
            </div>
          )}
        </div>

        {/* Content - Flexible height */}
        <div className="p-4 flex-1 flex flex-col">
          {/* Author and Date */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="relative w-6 h-6 rounded-full overflow-hidden bg-gradient-to-br from-pink-100 to-rose-100 flex items-center justify-center">
                {blog.author?.avatar ? (
                  <Image
                    src={blog.author.avatar}
                    alt={blog.author.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <User className="w-3 h-3 text-pink-400" />
                )}
              </div>
              <span className="text-[10px] font-medium text-gray-700">
                {blog.author?.name || "Beauty Expert"}
              </span>
            </div>

            <div className="flex items-center gap-1 text-[9px] text-gray-400">
              <Calendar className="w-3 h-3" />
              {formatDate(blog.publishedAt) || "Recent"}
            </div>
          </div>

          {/* Title - Fixed height with line clamp */}
          <Link href={`/newspost/${blog.slug}`} className="mb-2">
            <h3 className="text-sm font-semibold text-gray-900 hover:text-rose-600 transition-colors line-clamp-2 min-h-[2.5rem]">
              {blog.title || "Untitled Blog Post"}
            </h3>
          </Link>

          {/* Description - Fixed height with line clamp */}
          <p className="text-xs text-gray-500 line-clamp-2 mb-3 flex-1">
            {blog.description ||
              "Discover the latest beauty tips and trends..."}
          </p>

          {/* Read More Link */}
          <div className="pt-2 border-t border-gray-100">
            <Link
              href={`/newspost/${blog.slug}`}
              className="inline-flex items-center text-[10px] font-medium text-rose-600 hover:text-rose-700 transition-colors group/link"
            >
              Read Article
              <ArrowRight className="w-3 h-3 ml-1 transition-transform group-hover/link:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </motion.article>
    );
  };

  // Loading Skeleton
  if (blogLoading) {
    return (
      <section className="bg-white py-12 md:py-16">
        <Container>
          {/* Header Skeleton */}
          <div className="text-center mb-10">
            <div className="h-6 w-32 bg-gray-100 rounded-full mx-auto mb-3 animate-pulse"></div>
            <div className="h-8 w-64 bg-gray-100 rounded-lg mx-auto mb-2 animate-pulse"></div>
            <div className="h-4 w-96 max-w-full bg-gray-100 rounded mx-auto animate-pulse"></div>
          </div>

          {/* Cards Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-xl border border-gray-100 overflow-hidden"
              >
                <div className="pt-[56.25%] bg-gray-100 animate-pulse"></div>
                <div className="p-4 space-y-3">
                  <div className="flex justify-between">
                    <div className="h-4 w-20 bg-gray-100 rounded animate-pulse"></div>
                    <div className="h-4 w-16 bg-gray-100 rounded animate-pulse"></div>
                  </div>
                  <div className="h-5 w-full bg-gray-100 rounded animate-pulse"></div>
                  <div className="h-4 w-full bg-gray-100 rounded animate-pulse"></div>
                  <div className="h-4 w-2/3 bg-gray-100 rounded animate-pulse"></div>
                  <div className="h-4 w-24 bg-gray-100 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    );
  }

  if (!blogs || blogs.length === 0) {
    return (
      <section className="bg-white py-12 md:py-16">
        <Container>
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-pink-50 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-pink-400" />
            </div>
            <h3 className="text-base font-medium text-gray-900 mb-1">
              No articles yet
            </h3>
            <p className="text-xs text-gray-500">Check back soon for updates</p>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="bg-white py-12 md:py-16">
      <Container>
        {/* Section Header - Simple & Clean */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 md:mb-12"
        >
          <span className="inline-block text-xs font-medium text-rose-600 uppercase tracking-wider mb-2">
            Our Journal
          </span>
          <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-2">
            Latest from the{" "}
            <span className="font-semibold text-rose-600">Blog</span>
          </h2>
          <p className="text-xs md:text-sm text-gray-500 max-w-2xl mx-auto">
            Expert beauty tips, skincare routines, and trend insights
          </p>
          <div className="w-12 h-0.5 bg-rose-200 mx-auto mt-4"></div>
        </motion.div>

        {/* Mobile Swiper */}
        {isMobile ? (
          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={12}
            slidesPerView={1.2}
            centeredSlides={true}
            pagination={{ clickable: true, dynamicBullets: true }}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            className="pb-10"
          >
            {blogs.map((blog, index) => (
              <SwiperSlide key={blog.id || index}>
                <BlogCard blog={blog} index={index} />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          /* Desktop Grid - Perfect 4-column layout */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {blogs.map((blog, index) => (
              <BlogCard key={blog.id || index} blog={blog} index={index} />
            ))}
          </div>
        )}

        {/* View All Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="text-center mt-8 md:mt-10"
        >
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-rose-600 transition-colors border-b border-gray-200 hover:border-rose-200 pb-0.5"
          >
            View all articles
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>
      </Container>

      {/* Global Styles */}
      <style jsx global>{`
        /* Swiper Pagination Styles */
        .swiper-pagination-bullet {
          width: 4px;
          height: 4px;
          background: #e5e7eb;
          opacity: 1;
          transition: all 0.3s;
        }
        .swiper-pagination-bullet-active {
          background: #f43f5e;
          width: 16px;
          border-radius: 4px;
        }
        .swiper-pagination {
          bottom: 0 !important;
        }

        /* Ensure images don't overflow */
        .swiper-slide {
          height: auto;
        }

        /* Smooth scrolling */
        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
      `}</style>
    </section>
  );
};

export default NewsSection;
