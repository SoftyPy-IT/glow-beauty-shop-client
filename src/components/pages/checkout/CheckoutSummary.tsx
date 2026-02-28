"use client";

import React, { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import {
  selectOrderSummary,
  selectCoupon,
  setOrderSummary,
} from "@/redux/features/orders/orderSlice";
import formatPrice from "@/utils/formatPrice";
import { selectCartItems } from "@/redux/features/cart";
import { Avatar } from "@heroui/react";
import CouponForm from "@/components/Cart/CouponForm";
import { MapPin, ShoppingBag, Tag, Truck, Shield, Heart, ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@heroui/react";

const CheckoutSummary: React.FC = () => {
  const dispatch = useAppDispatch();
  const orderSummary = useAppSelector(selectOrderSummary);
  const cartItems = useAppSelector(selectCartItems);
  const coupon = useAppSelector(selectCoupon);
  const [shippingLocation, setShippingLocation] = useState("outside");
  const pathName = usePathname();

  // Calculate subtotal
  const subTotal = cartItems?.reduce(
    (acc: number, item) => acc + item.price * item.quantity,
    0,
  );

  // Calculate discount
  const discount = coupon
    ? coupon.discountType === "percentage"
      ? (subTotal * coupon.discount) / 100
      : coupon.discount
    : 0;

  // Calculate shipping charge based on location
  const shippingCharge = shippingLocation === "inside" ? 80 : 150;

  // Calculate total
  const total = subTotal - discount + shippingCharge;

  // Update order summary when values change
  useEffect(() => {
    dispatch(
      setOrderSummary({
        subTotal,
        discount,
        shippingCharge,
        total,
      }),
    );
  }, [subTotal, discount, shippingCharge, total, dispatch]);

  return (
    <section
      aria-labelledby="summary-heading"
      className="rounded-2xl bg-white border border-rose-100 shadow-sm hover:shadow-md transition-shadow duration-300 p-6 lg:sticky lg:top-32 lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-rose-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 flex items-center justify-center">
            <ShoppingBag className="w-4 h-4 text-white" />
          </div>
          <h2 id="summary-heading" className="text-xl font-semibold text-gray-800">
            Order Summary
          </h2>
        </div>
        <span className="text-sm text-rose-500 bg-rose-50 px-3 py-1 rounded-full">
          {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
        </span>
      </div>

      {/* Items List */}
      <div className="space-y-4 max-h-80 overflow-y-auto pr-1 custom-scrollbar">
        {cartItems.map((item) => (
          <div
            key={item.productId}
            className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-gray-50 to-white border border-gray-100 hover:border-rose-100 transition-colors"
          >
            <Avatar
              src={item.thumbnail}
              alt={item.name}
              className="w-16 h-20 rounded-lg flex-shrink-0 border border-rose-100"
            />
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-gray-800 line-clamp-2 mb-1">
                {item.name}
              </h3>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Qty: {item.quantity}</span>
                <span className="text-sm font-semibold text-rose-600">
                  {formatPrice(item.price)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Coupon Form */}
      <div className="mt-6 pt-4 border-t border-rose-100">
        <CouponForm />
      </div>

      {/* Shipping Location Selector */}
      <div className="mt-6 pt-4 border-t border-rose-100">
        <div className="flex items-center gap-2 mb-4">
          <Truck className="w-4 h-4 text-rose-500" />
          <h3 className="text-sm font-medium text-gray-700">Shipping Location</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setShippingLocation("inside")}
            className={`p-3 rounded-xl border-2 transition-all duration-200 ${shippingLocation === "inside"
                ? "border-rose-500 bg-rose-50 shadow-sm"
                : "border-gray-200 hover:border-rose-200 hover:bg-rose-50/30"
              }`}
          >
            <div className="flex flex-col items-center">
              <span className={`text-sm font-medium ${shippingLocation === "inside" ? "text-rose-600" : "text-gray-700"
                }`}>
                Inside Dhaka
              </span>
              <span className={`text-xs mt-1 ${shippingLocation === "inside" ? "text-rose-500" : "text-gray-500"
                }`}>
                ৳80
              </span>
            </div>
          </button>
          <button
            type="button"
            onClick={() => setShippingLocation("outside")}
            className={`p-3 rounded-xl border-2 transition-all duration-200 ${shippingLocation === "outside"
                ? "border-rose-500 bg-rose-50 shadow-sm"
                : "border-gray-200 hover:border-rose-200 hover:bg-rose-50/30"
              }`}
          >
            <div className="flex flex-col items-center">
              <span className={`text-sm font-medium ${shippingLocation === "outside" ? "text-rose-600" : "text-gray-700"
                }`}>
                Outside Dhaka
              </span>
              <span className={`text-xs mt-1 ${shippingLocation === "outside" ? "text-rose-500" : "text-gray-500"
                }`}>
                ৳150
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="mt-6 pt-4 border-t border-rose-100 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium text-gray-800">{formatPrice(subTotal)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 flex items-center gap-1">
            <Tag className="w-3 h-3" />
            Discount
          </span>
          <span className="font-medium text-green-600">- {formatPrice(discount)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 flex items-center gap-1">
            <Truck className="w-3 h-3" />
            Shipping
          </span>
          <span className="font-medium text-gray-800">{formatPrice(shippingCharge)}</span>
        </div>

        {/* Total */}
        <div className="pt-3 mt-3 border-t border-rose-100">
          <div className="flex items-center justify-between">
            <span className="text-base font-semibold text-gray-800">Total</span>
            <span className="text-xl font-bold text-rose-600">{formatPrice(total)}</span>
          </div>
          <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
            <Shield className="w-3 h-3" />
            Secure payment guaranteed
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6">
        {pathName === "/cart" ? (
          <Link href="/checkout" className="block w-full">
            <button className="w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold py-4 rounded-xl hover:from-rose-600 hover:to-pink-600 shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2">
              Proceed to Checkout
              <ChevronRight className="w-4 h-4" />
            </button>
          </Link>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
              <Heart className="w-3 h-3" />
              <span>100% Secure Checkout</span>
            </div>
          </div>
        )}
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #f9a8d4;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #f472b6;
        }
      `}</style>
    </section>
  );
};

export default CheckoutSummary;