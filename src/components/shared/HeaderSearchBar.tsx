/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useCallback, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { debounce } from "lodash";
import { useGetAllProductsQuery } from "@/redux/features/products/product.api";
import { TQueryParam } from "@/types/global.types";
import { IProduct } from "@/types/products.types";
import formatPrice from "@/utils/formatPrice";

interface HeaderSearchBarProps {
  onClose: () => void;
}

const HeaderSearchBar: React.FC<HeaderSearchBarProps> = ({ onClose }) => {
  const [params, setParams] = useState<TQueryParam[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    data: products,
    isLoading,
    isFetching,
  } = useGetAllProductsQuery([...params]);

  const debouncedSearch = useCallback(
    debounce((search: string) => {
      setParams([{ name: "searchTerm", value: search }]);
    }, 300),
    [],
  );

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }

    const handleClickOutside = (event: { target: any }) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        onClose();
      }
    };

    const handleEscape = (event: { key: string }) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const search = e.target.value;
    setSearchTerm(search);
    debouncedSearch(search);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setParams([]);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-md z-50 flex items-start justify-center pt-20 animate-in fade-in duration-300">
      <div
        ref={searchRef}
        className="w-full max-w-4xl bg-white/95 backdrop-blur-sm shadow-2xl rounded-3xl mx-4 overflow-hidden border border-pink-200 animate-in slide-in-from-top duration-300"
      >
        {/* Search Input */}
        <div className="p-6 border-b border-pink-100">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-5">
              <Search
                className={`w-5 h-5 transition-all duration-300 ${
                  isFocused ? "text-rose-500 scale-110" : "text-pink-300"
                }`}
              />
            </div>

            <input
              ref={inputRef}
              type="search"
              className={`w-full py-4 pl-14 pr-14 text-base bg-gradient-to-r from-pink-50/50 to-rose-50/50 border-2 rounded-2xl outline-none transition-all duration-300
                ${
                  isFocused
                    ? "border-rose-300 shadow-lg shadow-rose-100/50"
                    : "border-pink-200 hover:border-pink-300"
                }
                placeholder:text-pink-300 text-gray-700`}
              placeholder="Search for beauty products, brands, categories..."
              value={searchTerm}
              onChange={handleSearch}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />

            {/* Clear button */}
            <div className="absolute inset-y-0 right-0 flex items-center pr-4">
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="p-2 text-pink-400 hover:text-rose-600 rounded-full hover:bg-pink-100 transition-all duration-300 hover:scale-110"
                  aria-label="Clear search"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Search hint */}
          {!searchTerm && (
            <p className="text-xs text-pink-300 mt-3 text-center">
              ✨ Popular: Lipstick, Foundation, Skincare, Perfume
            </p>
          )}
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
          {/* Loading State */}
          {(isLoading || isFetching) && (
            <div className="p-6 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4 animate-pulse">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-100 to-rose-100" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gradient-to-r from-pink-100 to-rose-100 rounded w-3/4" />
                    <div className="h-4 bg-gradient-to-r from-pink-100 to-rose-100 rounded w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Results */}
          {!isFetching && searchTerm && products?.data && (
            <div className="divide-y divide-pink-100">
              {products.data.map((product: IProduct) => (
                <Link
                  href={`/products/${product._id}`}
                  key={product._id}
                  className="block hover:bg-gradient-to-r hover:from-pink-50/50 hover:to-rose-50/50 transition-all duration-300 group"
                  onClick={onClose}
                >
                  <div className="flex items-center p-4 gap-4">
                    <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-gradient-to-br from-pink-100 to-rose-100 flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-rose-600 transition-colors">
                        {product.name}
                      </h3>
                      <div className="mt-1 flex items-center gap-2">
                        {product.discount_price > 0 ? (
                          <>
                            <span className="text-rose-600 font-medium">
                              {formatPrice(product.discount_price)}
                            </span>
                            <span className="text-pink-300 line-through text-sm">
                              {formatPrice(product.price)}
                            </span>
                          </>
                        ) : (
                          <span className="text-rose-600 font-medium">
                            {formatPrice(product.price)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isFetching &&
            searchTerm &&
            (!products?.data || !products.data.length) && (
              <div className="p-12 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-pink-100 to-rose-100 mb-4">
                  <Search className="w-8 h-8 text-pink-400" />
                </div>
                <p className="text-gray-900 font-medium text-lg">
                  No results found
                </p>
                <p className="text-pink-400 mt-2">
                  Try searching with different keywords
                </p>
                <div className="mt-6 flex flex-wrap gap-2 justify-center">
                  {["Lipstick", "Foundation", "Serum", "Perfume"].map(
                    (term) => (
                      <button
                        key={term}
                        onClick={() => setSearchTerm(term)}
                        className="px-4 py-2 rounded-full bg-pink-50 text-pink-600 text-sm hover:bg-rose-500 hover:text-white transition-all duration-300"
                      >
                        {term}
                      </button>
                    ),
                  )}
                </div>
              </div>
            )}

          {/* Initial State */}
          {!searchTerm && (
            <div className="p-12 text-center">
              <div className="w-24 h-24 mx-auto mb-4 opacity-20">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="w-full h-full text-pink-300"
                >
                  <path
                    d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <p className="text-pink-400 text-lg">
                Discover your beauty essentials
              </p>
              <p className="text-pink-300 text-sm mt-2">
                Start typing to search for products
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeaderSearchBar;
