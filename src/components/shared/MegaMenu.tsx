"use client";

import React, { useMemo, useState, useRef, useEffect, Fragment } from "react";
import { Popover, Transition } from "@headlessui/react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ChevronDown } from "lucide-react";
import { ScrollShadow } from "@heroui/react";

interface SubCategory {
  _id: string;
  name: string;
  slug: string;
  category: string;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
  subCategories?: {
    subCategory: SubCategory;
    serial: number;
    _id: string;
  }[];
  mainCategory?: string;
}

interface CategoryTree {
  _id: string;
  name: string;
  image: string;
  slug: string;
  categories: {
    category: Category;
    serial: number;
    _id: string;
  }[];
}

// Helper function to determine the correct link for a category
const getCategoryLink = (
  categoryName: string,
  categorySlug: string,
): string => {
  return categoryName.toUpperCase() === "COMBO"
    ? "/products/combo"
    : `/categories/${categorySlug}`;
};

// Hover-enabled popover component with improved touch support
interface HoverPopoverProps {
  category: CategoryTree;
}

const HoverPopover: React.FC<HoverPopoverProps> = ({ category }) => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Delay constants for better UX
  const OPEN_DELAY = 100;
  const CLOSE_DELAY = 300;

  let openTimeout = useRef<NodeJS.Timeout | null>(null);
  let closeTimeout = useRef<NodeJS.Timeout | null>(null);

  // Handle touch events for mobile devices
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isOpen) {
      e.preventDefault();
      setIsOpen(true);
    }
  };

  const handleMouseEnter = () => {
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current);
      closeTimeout.current = null;
    }

    if (!isOpen) {
      openTimeout.current = setTimeout(() => {
        setIsOpen(true);
      }, OPEN_DELAY);
    }
  };

  const handleMouseLeave = () => {
    if (openTimeout.current) {
      clearTimeout(openTimeout.current);
      openTimeout.current = null;
    }

    closeTimeout.current = setTimeout(() => {
      setIsOpen(false);
    }, CLOSE_DELAY);
  };

  // Handle clicks outside to close menu
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        isOpen &&
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      if (openTimeout.current) clearTimeout(openTimeout.current);
      if (closeTimeout.current) clearTimeout(closeTimeout.current);
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscapeKey);
    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isOpen]);

  return (
    <div
      className="inline-block"
      ref={popoverRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Popover>
        {({ open, close }) => (
          <>
            <Popover.Button
              ref={buttonRef}
              className={`inline-flex uppercase items-center gap-x-1 text-pink-600 hover:text-rose-600 font-medium outline-none transition duration-200 rounded-full px-3 py-1.5 ${isOpen ? "bg-pink-50 text-rose-600" : ""
                }`}
              onClick={() => setIsOpen(!isOpen)}
              onTouchStart={handleTouchStart}
              aria-expanded={isOpen}
              aria-label={`${category.name} menu`}
            >
              <Link
                href={getCategoryLink(category.name, category.slug)}
                className="focus:outline-none focus:underline"
                onClick={() => {
                  setIsOpen(false);
                  close();
                }}
              >
                {category.name}
              </Link>
              <ChevronDown
                className={`h-3 w-3 transition-transform ${isOpen ? "rotate-180" : ""
                  }`}
                aria-hidden="true"
              />
            </Popover.Button>

            <Transition
              as={Fragment}
              show={isOpen}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 -translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 -translate-y-1"
            >
              <Popover.Panel
                static
                className="absolute top-full z-10 w-screen max-w-6xl overflow-hidden rounded-2xl mx-auto bg-white shadow-xl border border-pink-100 left-1/2 transform -translate-x-1/2"
              >
                <div className="grid grid-cols-12 gap-4 p-4 md:p-6">
                  {/* Left Side - Image (hidden on small screens, span-3 on larger) */}
                  {category.image && (
                    <div className="hidden md:block md:col-span-4 lg:col-span-3">
                      <div className="relative h-64 md:h-80 lg:h-96 w-full overflow-hidden rounded-xl group">
                        <Image
                          src={category.image}
                          alt={category.name}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-pink-900/70 via-pink-800/40 to-transparent" />
                        <div className="absolute bottom-4 left-4">
                          <p className="text-lg uppercase font-bold text-white">
                            {category.name}
                          </p>
                          <Link
                            href={getCategoryLink(category.name, category.slug)}
                            className="text-sm text-pink-100 hover:text-white transition duration-200 focus:outline-none focus:underline"
                            onClick={() => {
                              setIsOpen(false);
                              close();
                            }}
                          >
                            View All →
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Right Side - Categories (span-12 on small, span-8/9 on larger) */}
                  <div
                    className={`col-span-12 ${category.image
                        ? "md:col-span-8 lg:col-span-9"
                        : "col-span-12"
                      }`}
                  >
                    {category.categories && category.categories.length > 0 && (
                      <ColumnizedCategories
                        mainCategorySlug={category.slug}
                        category={category}
                        onClose={() => {
                          setIsOpen(false);
                          close();
                        }}
                      />
                    )}
                  </div>
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </div>
  );
};

export default function ModernMegaMenu({
  navigation,
}: {
  navigation: CategoryTree[];
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when window resizes to desktop size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobileMenuOpen]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const handleOutsideClick = (e: MouseEvent) => {
      const mobileMenu = document.getElementById("mobile-menu");
      const mobileMenuButton = document.getElementById("mobile-menu-button");

      if (
        mobileMenu &&
        mobileMenuButton &&
        !mobileMenu.contains(e.target as Node) &&
        !mobileMenuButton.contains(e.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isMobileMenuOpen]);

  return (
    <nav className="relative bg-white">
      {/* Desktop Navigation */}
      <div className="hidden lg:block">
        <div className="container mx-auto">
          <div className="py-1 px-4">
            {/* Scrollable Main Navigation - Fixed horizontal scrolling issue */}
            <div className="flex justify-center">
              <ScrollShadow hideScrollBar orientation="horizontal">
                <div className="inline-flex items-center text-sm min-w-max">
                  <Link
                    href="/"
                    className="text-pink-600 hover:text-rose-600 font-medium transition duration-200 focus:outline-none focus:text-rose-600 px-3 py-1.5 rounded-full hover:bg-pink-50"
                  >
                    HOME
                  </Link>
                  <Link
                    href="/products"
                    className="text-pink-600 hover:text-rose-600 font-medium transition duration-200 focus:outline-none focus:text-rose-600 px-3 py-1.5 rounded-full hover:bg-pink-50"
                  >
                    SHOP
                  </Link>
                  <Link
                    href="/products/combo"
                    className="text-pink-600 hover:text-rose-600 font-medium transition duration-200 focus:outline-none focus:text-rose-600 px-3 py-1.5 rounded-full hover:bg-pink-50"
                  >
                    COMBO
                  </Link>

                  {navigation?.map((category) => {
                    // Always show all main categories
                    const hasContent =
                      category.categories && category.categories.length > 0;

                    return hasContent ? (
                      // Categories with subcategories get a hover-enabled dropdown mega menu
                      <HoverPopover key={category._id} category={category} />
                    ) : (
                      // Categories with no subcategories just get a regular link
                      <Link
                        key={category._id}
                        href={getCategoryLink(category.name, category.slug)}
                        className="text-pink-600 uppercase hover:text-rose-600 font-medium transition duration-200 focus:outline-none focus:text-rose-600 px-3 py-1.5 rounded-full hover:bg-pink-50"
                      >
                        {category.name}
                      </Link>
                    );
                  })}
                </div>
              </ScrollShadow>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

interface ColumnizedCategoriesProps {
  mainCategorySlug?: string;
  category: CategoryTree;
  onClose: () => void;
}

const ColumnizedCategories: React.FC<ColumnizedCategoriesProps> = ({
  mainCategorySlug,
  category,
  onClose,
}) => {
  // Sort categories by their serial number
  const sortedCategories = useMemo(
    () => [...category.categories].sort((a, b) => a.serial - b.serial),
    [category.categories],
  );

  // Responsive columns - fewer on smaller screens
  const columnsCount = 3;

  // Group categories into columns while preserving serial order
  const categoriesColumns = useMemo(() => {
    const columns: Category[][] = Array.from(
      { length: columnsCount },
      () => [],
    );

    // Calculate items per column by distributing evenly
    const totalItems = sortedCategories.length;
    const itemsPerColumn = Math.ceil(totalItems / columnsCount);

    // Distribute categories across columns in serial order
    sortedCategories.forEach((item, index) => {
      // Determine which column this item belongs to
      const columnIndex = Math.floor(index / itemsPerColumn);

      // Ensure we don't exceed column count (fallback to last column)
      const targetColumnIndex =
        columnIndex < columnsCount ? columnIndex : columnsCount - 1;

      // Add the category to the appropriate column
      columns[targetColumnIndex].push(item.category);
    });

    return columns;
  }, [sortedCategories, columnsCount]);

  return (
    <div className="pl-2 md:pl-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 border-t border-pink-100">
        {categoriesColumns.map((column, columnIndex) => (
          <div
            key={columnIndex}
            className={`
              space-y-3
              py-4
              px-2
              ${columnIndex < columnsCount - 1
                ? "md:border-r border-pink-100"
                : ""
              }
            `}
          >
            {column.map((category) => (
              <div key={category._id} className="space-y-2 group">
                <Link
                  href={
                    category.name.toUpperCase() === "COMBO"
                      ? "/products/combo"
                      : `/categories/${mainCategorySlug}/${category.slug}`
                  }
                  className="
                    block 
                    text-sm 
                    font-semibold 
                    text-gray-900 
                    group-hover:text-rose-600 
                    transition 
                    duration-200 
                    pb-1
                    border-b 
                    border-transparent 
                    group-hover:border-rose-300
                    focus:outline-none
                    focus:text-rose-600
                  "
                  onClick={onClose}
                >
                  {category.name.length > 25
                    ? category.name.slice(0, 25) + "..."
                    : category.name}
                </Link>

                {category.subCategories &&
                  category.subCategories.length > 0 && (
                    <ul className="space-y-1 mt-2">
                      {category.subCategories.map((subCat, index) => (
                        <li
                          key={subCat._id}
                          className={`
                            ${index < (category.subCategories?.length ?? 0) - 1
                              ? "border-b border-pink-50"
                              : ""
                            }
                            py-1
                          `}
                        >
                          <Link
                            href={
                              subCat.subCategory.name.toUpperCase() === "COMBO"
                                ? "/products/combo"
                                : `/categories/${mainCategorySlug}/${category.slug}/${subCat.subCategory.slug}`
                            }
                            className="
                              block 
                              text-xs 
                              text-gray-600 
                              hover:text-rose-600 
                              hover:pl-1 
                              transition-all 
                              duration-200
                              focus:outline-none
                              focus:text-rose-600
                            "
                            onClick={onClose}
                          >
                            {subCat.subCategory.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};