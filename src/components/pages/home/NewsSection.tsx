"use client";

import { useGetAllBlogQuery } from "@/redux/features/blog.api";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Container from "@/components/common/Container";
import { motion } from "framer-motion";
// Import Swiper components
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

// Define TypeScript interfaces
interface Blog {
  id: string | number;
  title: string;
  slug: string;
  description?: string;
  thumbnail?: string;
  category?: string;
  publishedAt?: string;
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
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Check for mobile view on mount and window resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // 768px is typical md breakpoint
    };

    // Initial check
    checkMobile();

    // Add event listener for window resize
    window.addEventListener("resize", checkMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const { data: blogData, isLoading: blogLoading } = useGetAllBlogQuery([
    {
      name: "limit",
      value: 3,
    },
  ] as QueryParam[]);

  const blogs: Blog[] = blogData?.data || [];

  // Truncate description to specific length
  const truncateText = (text?: string, length: number = 120): string => {
    if (!text) return "";
    return text.length > length ? text.substring(0, length) + "..." : text;
  };

  // Format date if it exists in the data
  const formatDate = (dateString?: string): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // BlogCard component for reuse in both grid and swiper
  const BlogCard = ({ blog, index }: { blog: Blog; index: number }) => {
    const [hovered, setHovered] = useState(false);

    return (
      <div
        className="bg-white rounded-lg overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-lg h-full flex flex-col group"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="relative h-56 w-full overflow-hidden bg-gray-50">
          {blog.thumbnail ? (
            <Image
              src={blog.thumbnail}
              alt={blog.title || "Blog image"}
              fill
              className={`object-cover transition-transform duration-700 ${hovered ? "scale-105" : "scale-100"
                }`}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-pink-50 to-rose-50 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-pink-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}

          {/* Category badge */}
          {blog.category && (
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-rose-600 text-xs font-medium px-3 py-1.5 rounded-full shadow-sm border border-rose-100">
              {blog.category}
            </div>
          )}

          {/* Date badge */}
          {blog.publishedAt && (
            <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm text-gray-600 text-xs px-3 py-1.5 rounded-full shadow-sm border border-gray-100">
              {formatDate(blog.publishedAt)}
            </div>
          )}
        </div>

        <div className="p-6 flex flex-col flex-grow">
          {/* Author info if available */}
          {blog.author && (
            <div className="flex items-center mb-4">
              <div className="relative h-8 w-8 rounded-full overflow-hidden mr-3 border border-pink-100">
                {blog.author.avatar ? (
                  <Image
                    src={blog.author.avatar}
                    alt={blog.author.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-pink-100 to-rose-100 flex items-center justify-center text-rose-600 text-xs font-medium">
                    {blog.author.name.charAt(0)}
                  </div>
                )}
              </div>
              <span className="text-sm text-gray-500">{blog.author.name}</span>
            </div>
          )}

          <h3 className="text-lg font-semibold text-gray-800 mb-3 line-clamp-2">
            <Link
              href={`/newspost/${blog.slug}`}
              className="hover:text-rose-600 transition-colors duration-300"
            >
              {blog.title || "Untitled Blog Post"}
            </Link>
          </h3>

          <p className="text-sm text-gray-500 mb-5 line-clamp-3 flex-grow leading-relaxed">
            {truncateText(blog.description, 140)}
          </p>

          <div className="mt-auto pt-4">
            <Link
              href={`/newspost/${blog.slug}`}
              className="inline-flex items-center text-sm font-medium text-rose-600 hover:text-rose-700 transition-colors group"
            >
              Read Article
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-2 transform transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    );
  };

  // Loading state with skeleton UI
  if (blogLoading) {
    return (
      <section className="bg-white py-16 px-4 sm:px-6 lg:px-8">
        <Container>
          <div className="text-center mb-12">
            <div className="h-8 bg-gray-100 rounded w-48 mx-auto animate-pulse"></div>
            <div className="h-4 bg-gray-100 rounded w-64 mx-auto mt-4 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-lg border border-gray-100 overflow-hidden h-full"
              >
                <div className="relative h-48 w-full bg-gray-100 animate-pulse"></div>
                <div className="p-5 space-y-4">
                  <div className="h-5 bg-gray-100 rounded w-3/4 animate-pulse"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-100 rounded w-full animate-pulse"></div>
                    <div className="h-3 bg-gray-100 rounded w-full animate-pulse"></div>
                    <div className="h-3 bg-gray-100 rounded w-2/3 animate-pulse"></div>
                  </div>
                  <div className="h-4 bg-gray-100 rounded w-24 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    );
  }

  // No data state
  if (!blogs || blogs.length === 0) {
    return (
      <section className="bg-white py-16 px-4 sm:px-6 lg:px-8">
        <Container>
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-pink-50 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-pink-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No articles yet</h3>
            <p className="text-gray-500 max-w-md mx-auto text-sm">
              Check back soon for beauty tips, trends, and exclusive updates from our experts.
            </p>
          </div>
        </Container>
      </section>
    );
  }

  // Animation variants for desktop grid
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section className="bg-white py-12 md:py-16">
      <Container>
        {/* Section Header */}
        <div className="text-center mb-10 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-light text-gray-800 mb-3">
            Latest from our <span className="font-medium text-rose-600">Journal</span>
          </h2>
          <p className="text-sm text-gray-500 max-w-2xl mx-auto">
            Discover beauty tips, skincare routines, and expert advice
          </p>
          <div className="w-16 h-0.5 bg-rose-200 mx-auto mt-4"></div>
        </div>

        {/* Responsive Layout - Swiper for mobile, Grid for larger screens */}
        {isMobile ? (
          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={16}
            slidesPerView={1}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            className="pb-12"
          >
            {blogs.map((blog, index) => (
              <SwiperSlide key={blog.id || index} className="py-2">
                <BlogCard blog={blog} index={index} />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {blogs.map((blog, index) => (
              <motion.div key={blog.id || index} variants={itemVariants}>
                <BlogCard blog={blog} index={index} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* View All Link */}
        <div className="text-center mt-10">
          <Link
            href="/blog"
            className="inline-flex items-center text-sm text-gray-500 hover:text-rose-600 transition-colors border-b border-gray-200 hover:border-rose-200 pb-0.5"
          >
            View all articles
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5 ml-1.5"
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
          </Link>
        </div>
      </Container>

      {/* Custom styles for swiper pagination */}
      <style jsx global>{`
        .swiper-pagination-bullet {
          width: 6px;
          height: 6px;
          background: #e5e7eb;
          opacity: 1;
        }
        .swiper-pagination-bullet-active {
          background: #f43f5e;
          width: 20px;
          border-radius: 4px;
        }
        .swiper-pagination {
          bottom: 0 !important;
        }
      `}</style>
    </section>
  );
};

export default NewsSection;