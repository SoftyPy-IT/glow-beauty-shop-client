"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import AppForm from "../form/AppForm";
import AppInput from "../form/AppInput";
import * as zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useOrderTrackingQuery } from "@/redux/features/orders/order.api";
import {
  CheckIcon,
  XMarkIcon,
  TruckIcon,
  CalendarIcon,
  MapPinIcon,
  ShoppingBagIcon,
  ClockIcon,
} from "@heroicons/react/24/solid";
import {
  InformationCircleIcon,
  ArrowPathIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { Avatar } from "@heroui/react";
import { Skeleton } from "@heroui/skeleton";
import Button from "../buttons/Button";
import formatPrice from "@/utils/formatPrice";
import { Sparkles, Heart, Package, ShoppingBag } from "lucide-react";

const schema = zod.object({
  id: zod
    .string()
    .nonempty("Order ID is required")
    .min(5, "Order ID must be at least 5 characters"),
});

const TrackOrder = () => {
  const [orderID, setOrderID] = useState<string | null>(null);
  const [previousData, setPreviousData] = useState<any>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const { data, error, isLoading, refetch } = useOrderTrackingQuery(orderID, {
    skip: !orderID,
  });

  useEffect(() => {
    if (data) {
      setPreviousData(data);
      setFormError(null);
    } else if (error) {
      setPreviousData(null);
    }
  }, [data, error]);

  const onSubmit = async (formData: any) => {
    setFormError(null);

    // Basic validation
    if (!formData.id || formData.id.trim() === "") {
      setFormError("Please enter a valid order ID");
      return;
    }

    const toastId = toast.loading("Tracking your order...");
    try {
      setPreviousData(null);
      setOrderID(formData.id);
      toast.success("Order tracked successfully", { id: toastId });
    } catch (error) {
      toast.error("Failed to track order", { id: toastId });
      setPreviousData(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  // Function to determine class based on status
  const getStatusClass = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-50 text-green-700 border-green-200";
      case "shipped":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "processing":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "cancelled":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "returned":
        return "bg-purple-50 text-purple-700 border-purple-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  // Function to determine estimated delivery date
  const getEstimatedDelivery = (status: string, orderDate: string) => {
    if (status === "delivered") {
      return null; // No need for estimated delivery if already delivered
    }

    if (status === "cancelled" || status === "returned") {
      return null;
    }

    // Calculate estimated delivery (simple example - 7 days after order date)
    const orderPlacedDate = new Date(orderDate);
    const estimatedDate = new Date(orderPlacedDate);
    estimatedDate.setDate(orderPlacedDate.getDate() + 7);

    return formatDate(estimatedDate.toString());
  };

  // Enhanced progress steps with timeline
  const renderProgressSteps = (status: string, orderData: any) => {
    const steps = [
      {
        key: "placed",
        label: "Placed",
        completed: true,
        date: orderData?.createdAt ? formatDate(orderData.createdAt) : "N/A",
        icon: <ShoppingBag className="w-5 h-5" />,
        description: "Your order has been received",
      },
      {
        key: "processing",
        label: "Processing",
        completed: ["processing", "shipped", "delivered"].includes(status),
        date:
          status === "processing"
            ? "In progress"
            : ["shipped", "delivered"].includes(status)
              ? formatDate(orderData?.processedAt || new Date().toString())
              : "",
        icon: <ArrowPathIcon className="w-5 h-5" />,
        description: "We're preparing your items",
      },
      {
        key: "shipped",
        label: "Shipped",
        completed: ["shipped", "delivered"].includes(status),
        date:
          status === "shipped"
            ? "In transit"
            : status === "delivered"
              ? formatDate(orderData?.shippedAt || new Date().toString())
              : "",
        icon: <TruckIcon className="w-5 h-5" />,
        description: "Your order is on the way",
      },
      {
        key: "delivered",
        label: "Delivered",
        completed: status === "delivered",
        date:
          status === "delivered"
            ? formatDate(orderData?.deliveredAt || new Date().toString())
            : "",
        icon: <CheckIcon className="w-5 h-5" />,
        description: "Package received",
      },
    ];

    // Special case for cancelled or returned orders
    if (status === "cancelled" || status === "returned") {
      return (
        <div className="flex flex-col items-center justify-center py-6">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${status === "cancelled" ? "bg-rose-100" : "bg-purple-100"
              }`}
          >
            <XMarkIcon
              className={`w-8 h-8 ${status === "cancelled" ? "text-rose-600" : "text-purple-600"
                }`}
            />
          </div>
          <h3 className="text-lg font-medium text-gray-800">
            Order {status.charAt(0).toUpperCase() + status.slice(1)}
          </h3>
          <p className="text-gray-500 text-sm mt-1">
            {status === "cancelled"
              ? "This order has been cancelled"
              : "This order has been returned"}
          </p>
          {orderData?.cancelledAt && (
            <p className="text-sm text-gray-500 mt-2">
              {status === "cancelled" ? "Cancelled on: " : "Returned on: "}
              {formatDate(orderData.cancelledAt)}
            </p>
          )}
        </div>
      );
    }

    // Calculate progress percentage
    const getProgressPercentage = () => {
      switch (status) {
        case "delivered":
          return "100%";
        case "shipped":
          return "66%";
        case "processing":
          return "33%";
        default:
          return "0%";
      }
    };

    return (
      <div className="w-full py-6">
        {/* Mobile view - vertical timeline */}
        <div className="md:hidden">
          <div className="space-y-6">
            {steps.map((step, index) => (
              <div key={step.key} className="flex">
                <div className="flex flex-col items-center mr-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center z-10 
                    ${step.completed
                        ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white"
                        : "bg-white border-2 border-gray-300"
                      }`}
                  >
                    {step.completed ? (
                      <span className="text-white">{step.icon}</span>
                    ) : (
                      <span className="text-gray-500 font-medium">
                        {index + 1}
                      </span>
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-0.5 h-full ${step.completed ? "bg-gradient-to-b from-rose-500 to-pink-500" : "bg-gray-200"
                        }`}
                      style={{ height: "30px" }}
                    ></div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <p
                        className={`font-medium ${step.completed ? "text-rose-600" : "text-gray-500"
                          }`}
                      >
                        {step.label}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {step.description}
                      </p>
                    </div>
                    {step.date && (
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        {step.date}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop view - horizontal steps */}
        <div className="hidden md:block">
          <div className="flex items-center justify-between w-full mb-2 relative">
            {steps.map((step, index) => (
              <div
                key={step.key}
                className="flex flex-col items-center relative z-10"
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center 
                  ${step.completed
                      ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md"
                      : "bg-white border-2 border-gray-300"
                    }`}
                >
                  {step.completed ? (
                    <span className="text-white">{step.icon}</span>
                  ) : (
                    <span className="text-gray-500 font-medium">
                      {index + 1}
                    </span>
                  )}
                </div>
                <p
                  className={`text-sm mt-2 font-medium text-center
                  ${step.completed ? "text-rose-600" : "text-gray-500"}`}
                >
                  {step.label}
                </p>
                {step.date && step.completed && (
                  <p className="text-xs text-gray-400 mt-1">{step.date}</p>
                )}
              </div>
            ))}

            {/* Progress bar */}
            <div className="absolute top-6 left-0 right-0 -translate-y-1/2 z-0">
              <div className="h-1 bg-gray-200 rounded-full mx-12">
                <div
                  className="h-1 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full transition-all duration-500"
                  style={{ width: getProgressPercentage() }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderDeliveryInfo = (orderData: any) => {
    if (!orderData) return null;

    const estimatedDelivery = getEstimatedDelivery(
      orderData.status,
      orderData.createdAt,
    );

    return (
      <div className="bg-rose-50/50 rounded-xl border border-rose-100 p-5 mt-6">
        <h4 className="font-medium text-gray-800 mb-4 flex items-center">
          <MapPinIcon className="w-5 h-5 mr-2 text-rose-500" />
          Delivery Information
        </h4>
        <div className="grid md:grid-cols-2 gap-5">
          <div className="bg-white rounded-lg p-4 border border-rose-100">
            <p className="text-xs text-rose-500 uppercase tracking-wider mb-2">Shipping Address</p>
            <p className="text-sm font-medium text-gray-800">
              {orderData.shippingAddress?.line1 || "N/A"}
              {orderData.shippingAddress?.line2 && (
                <>
                  <br />
                  {orderData.shippingAddress.line2}
                </>
              )}
              {(orderData.shippingAddress?.upazila ||
                orderData.shippingAddress?.district ||
                orderData.shippingAddress?.division) && (
                  <>
                    <br />
                    {[
                      orderData.shippingAddress?.upazila,
                      orderData.shippingAddress?.district,
                      orderData.shippingAddress?.division,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </>
                )}
              {orderData.shippingAddress?.country && (
                <>
                  <br />
                  {orderData.shippingAddress.country}
                </>
              )}
            </p>
          </div>

          <div className="bg-white rounded-lg p-4 border border-rose-100">
            <p className="text-xs text-rose-500 uppercase tracking-wider mb-2">Shipping Method</p>
            <p className="text-sm font-medium text-gray-800">
              {orderData.shippingMethod || "Home Delivery"}
            </p>

            {estimatedDelivery && (
              <>
                <p className="text-xs text-rose-500 uppercase tracking-wider mt-4 mb-2">Estimated Delivery</p>
                <p className="text-sm font-medium text-rose-600 flex items-center">
                  <CalendarIcon className="w-4 h-4 mr-1" />
                  {estimatedDelivery}
                </p>
              </>
            )}

            {orderData.trackingNumber && (
              <>
                <p className="text-xs text-rose-500 uppercase tracking-wider mt-4 mb-2">Tracking Number</p>
                <p className="text-sm font-medium text-gray-800">
                  {orderData.trackingNumber}
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Render single order card
  const renderOrderCard = (orderData: any, index: number) => {
    return (
      <div
        key={orderData._id}
        className="border border-rose-100 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow duration-300 mb-8 overflow-hidden"
      >
        <div className="px-6 py-6 border-b border-rose-100 bg-gradient-to-r from-rose-50/50 to-pink-50/50">
          {/* Order header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-x-4 gap-y-1">
                <div>
                  <p className="text-rose-500 text-xs uppercase tracking-wider">Order ID</p>
                  <h3 className="text-lg font-semibold text-gray-800">
                    #{orderData._id}
                  </h3>
                </div>

                {orderData.createdAt && (
                  <div className="sm:border-l sm:border-rose-200 sm:pl-4">
                    <p className="text-rose-500 text-xs uppercase tracking-wider">Order Date</p>
                    <p className="text-gray-700 font-medium">
                      {formatDate(orderData.createdAt)}
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div
              className={`px-4 py-2 rounded-full border text-sm font-medium inline-flex items-center w-fit
              ${getStatusClass(orderData.status)}`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current mr-2"></span>
              {orderData.status.charAt(0).toUpperCase() +
                orderData.status.slice(1)}
            </div>
          </div>

          {/* Customer Information */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-5">
            <h4 className="font-medium text-gray-800 mb-4 flex items-center">
              <Heart className="w-4 h-4 mr-2 text-rose-500" />
              Customer Information
            </h4>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-rose-500 text-xs uppercase tracking-wider mb-1">Name</p>
                <p className="font-medium text-gray-800">{orderData.name}</p>
              </div>
              <div>
                <p className="text-rose-500 text-xs uppercase tracking-wider mb-1">Phone</p>
                <p className="font-medium text-gray-800">{orderData.phone}</p>
              </div>
              {orderData.email && (
                <div>
                  <p className="text-rose-500 text-xs uppercase tracking-wider mb-1">Email</p>
                  <p className="font-medium text-gray-800">{orderData.email}</p>
                </div>
              )}
              <div>
                <p className="text-rose-500 text-xs uppercase tracking-wider mb-1">Order Type</p>
                <p className="font-medium text-gray-800">
                  {orderData.isGuestCheckout
                    ? "Guest Checkout"
                    : "Registered User"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-6">
          {/* Progress tracker */}
          <div className="rounded-xl bg-gradient-to-b from-rose-50/30 to-pink-50/30 p-4 mb-6">
            <h4 className="font-medium text-gray-800 mb-2 flex items-center">
              <ClockIcon className="w-4 h-4 mr-2 text-rose-500" />
              Order Status Timeline
            </h4>
            {renderProgressSteps(orderData.status, orderData)}
          </div>

          {/* Delivery information */}
          {renderDeliveryInfo(orderData)}

          {/* Order summary info */}
          <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl p-5 mt-6">
            <div className="flex items-start">
              <Package className="w-5 h-5 text-rose-500 mt-0.5 flex-shrink-0" />
              <div className="ml-3 w-full">
                <h4 className="font-medium text-gray-800 mb-3">Order Summary</h4>
                <div className="grid sm:grid-cols-3 gap-4 text-sm">
                  <div className="bg-white rounded-lg p-3 border border-rose-100">
                    <p className="text-rose-500 text-xs uppercase tracking-wider mb-1">Total Amount</p>
                    <p className="font-medium text-gray-800">{formatPrice(orderData.total)}</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-rose-100">
                    <p className="text-rose-500 text-xs uppercase tracking-wider mb-1">Payment Method</p>
                    <p className="font-medium text-gray-800">
                      {orderData.paymentMethod || "Card"}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-rose-100">
                    <p className="text-rose-500 text-xs uppercase tracking-wider mb-1">Items</p>
                    <p className="font-medium text-gray-800">
                      {orderData.orderItems?.length || 0}
                    </p>
                  </div>
                </div>
                {orderData.discount > 0 && (
                  <div className="grid sm:grid-cols-3 gap-4 mt-3 text-sm">
                    <div className="bg-white rounded-lg p-3 border border-rose-100">
                      <p className="text-rose-500 text-xs uppercase tracking-wider mb-1">Subtotal</p>
                      <p className="font-medium text-gray-800">
                        {formatPrice(orderData.subTotal)}
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-rose-100">
                      <p className="text-rose-500 text-xs uppercase tracking-wider mb-1">Discount</p>
                      <p className="font-medium text-rose-600">
                        -{formatPrice(orderData.discount)}
                      </p>
                    </div>
                    <div></div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Order items */}
          <div className="mt-6">
            <h4 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
              <ShoppingBag className="w-5 h-5 mr-2 text-rose-500" />
              Order Items ({orderData.orderItems?.length || 0})
            </h4>
            <div className="space-y-3">
              {orderData.orderItems?.map((product: any) => (
                <div
                  key={product._id}
                  className="bg-white border border-rose-100 rounded-xl p-4 transition-all hover:border-rose-200 hover:shadow-sm"
                >
                  <div className="flex items-start gap-4">
                    <Avatar
                      src={product.thumbnail}
                      radius="lg"
                      alt={product.name}
                      className="h-16 w-16 object-cover flex-shrink-0 border border-rose-100"
                    />
                    <div className="flex-1 min-w-0">
                      <h5 className="font-medium text-gray-800 mb-2">
                        {product.name}
                      </h5>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                        <span className="bg-rose-50 text-rose-700 px-2 py-1 rounded-full text-xs">
                          Qty: {product.quantity}
                        </span>
                        <span className="font-medium text-gray-800">
                          {formatPrice(parseFloat(product.price))}
                        </span>
                        {product.code && (
                          <span className="text-gray-500 text-xs">
                            Code: {product.code}
                          </span>
                        )}
                        {product.color && (
                          <span className="flex items-center gap-1 text-xs text-gray-500">
                            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: product.color }}></span>
                            {product.color}
                          </span>
                        )}
                        {product.size && (
                          <span className="text-xs text-gray-500">
                            Size: {product.size}
                          </span>
                        )}
                      </div>
                      {/* Item-specific status if available */}
                      {product.status &&
                        product.status !== orderData.status && (
                          <div className="mt-2">
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${getStatusClass(
                                product.status,
                              )}`}
                            >
                              {product.status.charAt(0).toUpperCase() +
                                product.status.slice(1)}
                            </span>
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Get the orders array from the API response
  const orders = (data || previousData)?.data || [];
  const hasOrders = Array.isArray(orders) && orders.length > 0;

  return (
    <div className="max-w-5xl mx-auto mt-10 sm:mt-20 mb-28 relative top-20 bottom-0 w-full bg-gradient-to-b from-white to-rose-50/30 min-h-screen">
      <div className="bg-white rounded-2xl shadow-sm border border-rose-100 overflow-hidden">
        <div className="px-6 py-8 md:px-8 border-b border-rose-100 bg-gradient-to-r from-rose-50 to-pink-50">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
          </div>
          <h1 className="text-2xl md:text-3xl font-light text-gray-800 mb-2 text-center">
            Track Your <span className="font-medium text-rose-600">Order</span>
          </h1>
          <p className="text-gray-500 text-center mb-6 max-w-lg mx-auto">
            Enter your order ID to view the latest status and delivery information
          </p>

          <div className="max-w-md mx-auto">
            <AppForm onSubmit={onSubmit} resolver={zodResolver(schema)}>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <div className="relative">
                    {/* <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MagnifyingGlassIcon className="h-5 w-5 text-rose-400" />
                    </div> */}
                    <AppInput
                      name="id"
                      type="text"
                      size="lg"
                      placeholder="Enter order ID"

                    />
                  </div>
                  {formError && (
                    <p className="text-rose-600 text-xs mt-1 absolute">
                      {formError}
                    </p>
                  )}
                </div>
                <Button
                  onClick={onSubmit}
                  value={isLoading ? "Searching..." : "Track Order"}
                  type="submit"
                  size="sm"
                  disabled={isLoading}
                  extraClass="mt-0 py-2.5 px-6 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white border-0"
                />
              </div>
            </AppForm>
          </div>
        </div>

        {/* Order results section */}
        <div className="px-6 py-6 md:px-8">
          {isLoading && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <Skeleton className="h-8 w-1/3 rounded-lg bg-rose-100" />
                <Skeleton className="h-6 w-24 rounded-full bg-rose-100" />
              </div>
              <Skeleton className="h-32 w-full rounded-lg bg-rose-100" />
              <Skeleton className="h-20 w-full rounded-lg bg-rose-100" />
              <div className="pt-4">
                <Skeleton className="h-6 w-40 rounded-lg bg-rose-100 mb-4" />
                <div className="space-y-3">
                  <Skeleton className="h-20 w-full rounded-lg bg-rose-100" />
                  <Skeleton className="h-20 w-full rounded-lg bg-rose-100" />
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-8 text-center">
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <XMarkIcon className="w-8 h-8 text-rose-500" />
              </div>
              <h3 className="text-xl font-medium text-gray-800 mb-2">
                Order Not Found
              </h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                We couldn't find an order with that ID. Please check and try again.
              </p>
              <Button
                onClick={() => refetch()}
                value="Try Again"
                type="button"
                extraClass="max-w-xs mx-auto bg-white border-rose-200 text-rose-600 hover:bg-rose-50"
              />
            </div>
          )}

          {!isLoading && !error && hasOrders && (
            <div className="space-y-6">
              {orders.length > 1 && (
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-5 mb-6">
                  <h3 className="font-medium text-gray-800 flex items-center">
                    <InformationCircleIcon className="w-5 h-5 mr-2 text-rose-500" />
                    Multiple Orders Found
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    We found {orders.length} orders matching your search. All
                    orders are displayed below.
                  </p>
                </div>
              )}

              {orders.map((order: any, index: number) =>
                renderOrderCard(order, index),
              )}
            </div>
          )}

          {!isLoading && !error && !hasOrders && (data || previousData) && (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <InformationCircleIcon className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-medium text-gray-800 mb-2">
                No Orders Found
              </h3>
              <p className="text-gray-500">
                No orders were found for the provided ID.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;