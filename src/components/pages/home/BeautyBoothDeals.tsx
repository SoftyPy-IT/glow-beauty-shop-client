/* eslint-disable @next/next/no-img-element */
import Container from "@/components/common/Container";
import React from "react";
import eye from "@/assets/eyes/beauty.webp";
import lip from "@/assets/eyes/beauty2.webp";
import face from "@/assets/eyes/beauty3.webp";
import Image from "next/image";
import Link from "next/link";

const BeautySection = () => {
  const categories = [
    {
      name: "Face",
      image: face,
      href: "/categories/skin-care/cleansers",
    },
    {
      name: "Eyes",
      image: eye,
      href: "/categories/eyes-eyebrows",
    },
    {
      name: "Lips",
      image: lip,
      href: "/categories/makeup/lipstick",
    },
  ];

  return (
    <Container>
      <div className="p-8 font-sans">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold tracking-tight text-black">
            TOP 3 OF BEAUTY
          </h2>
          <Link
            href="/categories"
            className="flex items-center gap-1 px-4 py-1.5 text-sm font-medium border border-gray-200 rounded-full hover:bg-gray-50 transition-colors"
          >
            See All
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
              />
            </svg>
          </Link>
        </div>

        {/* Main Content Card */}
        <div className="bg-[#EED8C5] rounded-xl py-16 px-4">
          <div className="flex justify-center items-center gap-8 md:gap-16 flex-wrap">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className="flex flex-col items-center gap-4 group cursor-pointer"
              >
                {/* Image Container with Gradient Border */}
                <div className="relative p-1 rounded-full bg-gradient-to-tr from-[#FFD6E8] via-[#D1E9FF] to-[#FFD6E8]">
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-2 border-white shadow-sm">
                    <Image
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                </div>
                {/* Category Label */}
                <span className="text-lg font-bold text-black tracking-wide">
                  {category.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Container>
  );
};

export default BeautySection;
