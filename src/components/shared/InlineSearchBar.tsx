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

interface InlineSearchProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const InlineSearch: React.FC<InlineSearchProps> = ({
  isOpen,
  onOpen,
  onClose,
}) => {
  const [params, setParams] = useState<TQueryParam[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isFocused, setIsFocused] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    data: products,
    isLoading,
    isFetching,
  } = useGetAllProductsQuery([...params], { skip: !searchTerm });

  const debouncedSearch = useCallback(
    debounce((search: string) => {
      if (search) {
        setParams([{ name: "searchTerm", value: search }]);
        onOpen();
      } else {
        setParams([]);
        onClose();
      }
    }, 300),
    [onOpen, onClose],
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose();
        setIsFocused(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const search = e.target.value;
    setSearchTerm(search);
    debouncedSearch(search);
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (searchTerm) {
      onOpen();
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    setParams([]);
    onClose();
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleProductClick = () => {
    clearSearch();
    onClose();
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div className="relative group">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search for beauty products..."
          className={`w-full px-5 py-2.5 pr-12 rounded-full border-2 bg-white/90 transition-all duration-300 text-sm
            ${
              isFocused
                ? "border-pink-400 ring-2 ring-pink-200 outline-none"
                : "border-pink-200 hover:border-pink-300"
            }`}
          value={searchTerm}
          onChange={handleSearch}
          onFocus={handleFocus}
        />
        <button
          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gradient-to-r from-pink-400 to-rose-400 flex items-center justify-center hover:from-pink-500 hover:to-rose-500 transition-all duration-300 shadow-sm hover:shadow-md"
          aria-label="Search"
        >
          <Search className="w-4 h-4 text-white" />
        </button>

        {/* Clear button - shows only when typing */}
        {searchTerm && (
          <button
            onClick={clearSearch}
            className="absolute right-12 top-1/2 -translate-y-1/2 p-1 text-pink-400 hover:text-rose-600 rounded-full hover:bg-pink-100 transition-all"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown - Fixed z-index to be above everything */}
      {isOpen && searchTerm && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-pink-100 overflow-hidden z-[100]">
          {/* Loading State */}
          {(isLoading || isFetching) && (
            <div className="p-4 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 animate-pulse">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-pink-100 to-rose-100" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-gradient-to-r from-pink-100 to-rose-100 rounded w-3/4" />
                    <div className="h-3 bg-gradient-to-r from-pink-100 to-rose-100 rounded w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Results */}
          {!isFetching && products?.data && products.data.length > 0 && (
            <div className="max-h-96 overflow-y-auto custom-scrollbar">
              <div className="p-2">
                {products.data.map((product: IProduct) => (
                  <Link
                    href={`/products/${product._id}`}
                    key={product._id}
                    className="flex items-center p-3 gap-3 hover:bg-gradient-to-r hover:from-pink-50/50 hover:to-rose-50/50 rounded-xl transition-all duration-300 group"
                    onClick={handleProductClick}
                  >
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gradient-to-br from-pink-100 to-rose-100 flex-shrink-0">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 line-clamp-1 group-hover:text-rose-600">
                        {product.name}
                      </h4>
                      <div className="mt-1 flex items-center gap-2">
                        {product.discount_price > 0 ? (
                          <>
                            <span className="text-rose-600 font-medium text-sm">
                              {formatPrice(product.discount_price)}
                            </span>
                            <span className="text-pink-300 line-through text-xs">
                              {formatPrice(product.price)}
                            </span>
                          </>
                        ) : (
                          <span className="text-rose-600 font-medium text-sm">
                            {formatPrice(product.price)}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* View all results link */}
              <div className="p-2 border-t border-pink-100">
                <Link
                  href={`/products?search=${encodeURIComponent(searchTerm)}`}
                  className="block text-center text-sm text-pink-600 hover:text-rose-600 py-2 hover:bg-pink-50 rounded-lg transition-colors"
                  onClick={handleProductClick}
                >
                  View all results
                </Link>
              </div>
            </div>
          )}

          {/* No Results */}
          {!isFetching && products?.data && products.data.length === 0 && (
            <div className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-pink-100 flex items-center justify-center">
                <Search className="w-6 h-6 text-pink-400" />
              </div>
              <p className="text-gray-900 font-medium">No products found</p>
              <p className="text-pink-400 text-sm mt-1">
                Try searching with different keywords
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InlineSearch;
