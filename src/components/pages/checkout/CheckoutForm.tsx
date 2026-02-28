"use client";

import Button from "@/components/buttons/Button";
import ErrorMessage from "@/components/common/ErrorMessage";
import SuccessMessage from "@/components/common/SuccessMessage";
import AppForm from "@/components/form/AppForm";
import AppInput from "@/components/form/AppInput";
import AppPhoneInput from "@/components/form/AppPhoneInput";
import AppSelect from "@/components/form/AppSelect";
import { removeAllFromCart } from "@/redux/features/cart";
import { useCreateOrderMutation } from "@/redux/features/orders/order.api";
import {
  clearOrderData,
  selectCoupon,
  selectIsCouponApplied,
  selectOrderSummary,
  setOrderSummary,
} from "@/redux/features/orders/orderSlice";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import formatPrice from "@/utils/formatPrice";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import * as zod from "zod";
import { User, MapPin, Package, Heart, Sparkles, ChevronRight } from "lucide-react";

interface Division {
  id: number;
  name: string;
  bn_name: string;
  districts?: District[];
}

interface District {
  id: string;
  division_id: string;
  name: string;
  bn_name: string;
  lat?: string;
  lon?: string;
  url?: string;
  upazilas?: Upazila[];
}

interface Upazila {
  id: string;
  district_id: string;
  name: string;
  bn_name: string;
  url?: string;
  unions?: Union[];
}

interface Union {
  id: string;
  upazilla_id: string;
  name: string;
  bn_name: string;
  url?: string;
}

interface LocationData {
  divisions: Division[];
  districts: District[];
  upazilas: Upazila[];
  unions: Union[];
}

const checkoutSchema = zod.object({
  name: zod.string().min(1, "Name is required").max(100, "Name is too long"),
  email: zod
    .string()
    .email("Invalid email address")
    .optional()
    .or(zod.literal("")),
  phone: zod
    .string()
    .min(8, "Phone number must be at least 8 digits")
    .max(15, "Phone number is too long")
    .regex(
      /^\+?[1-9]\d{1,14}$/,
      "Please enter a valid international phone number (e.g., +8801842236261)",
    ),
  shippingAddress: zod.object({
    line1: zod
      .string()
      .min(1, "Address line 1 is required")
      .max(100, "Address line 1 is too long"),
    line2: zod.string().max(100, "Address line 2 is too long").optional(),
    division: zod.string().min(1, "Division is required").optional(),
    district: zod.string().min(1, "District is required").optional(),
    upazila: zod.string().min(1, "Upazila is required").optional(),
    country: zod
      .string()
      .min(1, "Country is required")
      .max(50, "Country name is too long"),
    phone: zod
      .string()
      .min(8, "Phone number must be at least 8 digits")
      .max(15, "Phone number is too long")
      .regex(
        /^\+?[1-9]\d{1,14}$/,
        "Please enter a valid international phone number (e.g., +8801842236261)",
      )
      .optional(),
  }),
});

const CheckoutForm = ({ user }: { user: any }) => {
  const dispatch = useDispatch();
  const orderSummary = useSelector(selectOrderSummary);
  const cartItems = useSelector((state: RootState) => state.cart.cartItems);
  const [createOrder, { isLoading, isSuccess, isError }] =
    useCreateOrderMutation();
  const hasCoupon = useAppSelector(selectIsCouponApplied);
  const coupon = useAppSelector(selectCoupon);
  const [error, setError] = React.useState<any>(null);
  const router = useRouter();

  // Location state
  const [selectedDivision, setSelectedDivision] = React.useState("");
  const [selectedDistrict, setSelectedDistrict] = React.useState("");
  const [selectedUpazila, setSelectedUpazila] = React.useState("");
  const [locationData, setLocationData] = React.useState<LocationData>({
    divisions: [],
    districts: [],
    upazilas: [],
    unions: [],
  });
  const [filteredDistricts, setFilteredDistricts] = React.useState<District[]>(
    [],
  );
  const [filteredUpazilas, setFilteredUpazilas] = React.useState<Upazila[]>([]);
  const [isLoadingLocation, setIsLoadingLocation] = React.useState(true);

  // Fetch all location data - handles both nested and separate file structures
  React.useEffect(() => {
    const fetchLocationData = async () => {
      setIsLoadingLocation(true);
      try {
        // Try to fetch from a single nested file first
        try {
          const response = await fetch("/data/bd-locations.json");
          if (response.ok) {
            const data = await response.json();

            // Handle nested structure
            if (data.divisions && Array.isArray(data.divisions)) {
              // Extract all data from nested structure
              const allDistricts: District[] = [];
              const allUpazilas: Upazila[] = [];
              const allUnions: Union[] = [];

              data.divisions.forEach((division: Division) => {
                if (division.districts) {
                  allDistricts.push(...division.districts);
                  division.districts.forEach((district: District) => {
                    if (district.upazilas) {
                      allUpazilas.push(...district.upazilas);
                      district.upazilas.forEach((upazila: Upazila) => {
                        if (upazila.unions) {
                          allUnions.push(...upazila.unions);
                        }
                      });
                    }
                  });
                }
              });

              setLocationData({
                divisions: data.divisions,
                districts: allDistricts,
                upazilas: allUpazilas,
                unions: allUnions,
              });
              setIsLoadingLocation(false);
              return;
            }
          }
        } catch (nestedError) {
          console.log("Nested structure not found, trying separate files...");
        }

        // Fallback to separate files
        const [divisionsRes, districtsRes, upazilasRes, unionsRes] =
          await Promise.all([
            fetch("/data/bd-divisions.json").catch(() => null),
            fetch("/data/bd-districts.json").catch(() => null),
            fetch("/data/bd-upazilas.json").catch(() => null),
            fetch("/data/bd-unions.json").catch(() => null),
          ]);

        const responses = await Promise.all([
          divisionsRes?.ok ? divisionsRes.json() : { divisions: [] },
          districtsRes?.ok ? districtsRes.json() : { districts: [] },
          upazilasRes?.ok ? upazilasRes.json() : { upazilas: [] },
          unionsRes?.ok ? unionsRes.json() : { unions: [] },
        ]);

        const [divisionsData, districtsData, upazilasData, unionsData] =
          responses;

        setLocationData({
          divisions: divisionsData.divisions || [],
          districts: districtsData.districts || [],
          upazilas: upazilasData.upazilas || [],
          unions: unionsData.unions || [],
        });
      } catch (error) {
        console.error("Error fetching location data:", error);
        toast.error("Failed to load location data. Please refresh the page.");
        // Set empty arrays to prevent crashes
        setLocationData({
          divisions: [],
          districts: [],
          upazilas: [],
          unions: [],
        });
      } finally {
        setIsLoadingLocation(false);
      }
    };

    fetchLocationData();
  }, []);

  // Handle division change
  const handleDivisionChange = (divisionId: string) => {
    setSelectedDivision(divisionId);
    setSelectedDistrict("");
    setSelectedUpazila("");

    const filtered = locationData.districts.filter(
      (district) => district.division_id === divisionId,
    );
    setFilteredDistricts(filtered);
    setFilteredUpazilas([]);
  };

  // Handle district change
  const handleDistrictChange = (districtId: string) => {
    setSelectedDistrict(districtId);
    setSelectedUpazila("");

    const filtered = locationData.upazilas.filter(
      (upazila) => upazila.district_id === districtId,
    );
    setFilteredUpazilas(filtered);
  };

  // Handle upazila change
  const handleUpazilaChange = (upazilaId: string) => {
    setSelectedUpazila(upazilaId);
  };

  // Calculate shipping charge based on division
  const calculateShippingCharge = (divisionId: string) => {
    const division = locationData.divisions.find(
      (d) => d.id === Number(divisionId),
    );
    const divisionName = division?.name?.toLowerCase() || "";
    return divisionName === "dhaka" ? 80 : 150;
  };

  // Update order summary when shipping address changes
  const handleShippingAddressChange = (divisionId: string) => {
    if (!divisionId) return;

    const shippingCharge = calculateShippingCharge(divisionId);
    const subTotal = cartItems?.reduce(
      (acc: number, item) => acc + item.price * item.quantity,
      0,
    );
    const discount = coupon
      ? coupon.discountType === "percentage"
        ? (subTotal * coupon.discount) / 100
        : coupon.discount
      : 0;
    const total = subTotal - discount + shippingCharge;

    dispatch(
      setOrderSummary({
        subTotal,
        discount,
        shippingCharge,
        total,
      }),
    );
  };

  // Update shipping when division changes
  React.useEffect(() => {
    if (selectedDivision) {
      handleShippingAddressChange(selectedDivision);
    }
  }, [selectedDivision, cartItems, coupon]);

  // Validate cart items before submission
  const validateCart = () => {
    if (!cartItems || cartItems.length === 0) {
      throw new Error("Your cart is empty");
    }
  };

  const onSubmit = async (data: any) => {
    const toastId = toast.loading("Submitting order...");
    try {
      validateCart();

      const selectedDivisionData = locationData.divisions.find(
        (d) => d.id === parseInt(data.shippingAddress.division),
      );
      const selectedDistrictData = locationData.districts.find(
        (d) => d.id === data.shippingAddress.district,
      );
      const selectedUpazilaData = locationData.upazilas.find(
        (u) => u.id === data.shippingAddress.upazila,
      );

      // Ensure we have valid location data
      if (
        !selectedDivisionData ||
        !selectedDistrictData ||
        !selectedUpazilaData
      ) {
        throw new Error("Invalid location data selected. Please try again.");
      }

      const orderData = {
        orderItems: cartItems,
        orderTotal: orderSummary.total,
        ...orderSummary,
        name: data.name,
        email: data.email,
        phone: data.phone,
        shippingAddress: {
          line1: data.shippingAddress.line1,
          line2: data.shippingAddress.line2 || "",
          country: data.shippingAddress.country,
          phone: data.shippingAddress.phone || data.phone,
          division: selectedDivisionData.name,
          district: selectedDistrictData.name,
          upazila: selectedUpazilaData.name,
        },
        shippingCharge: orderSummary.shippingCharge,
        paymentMethod: "Cash On Delivery",
        hasCoupon: hasCoupon,
        couponCode: coupon?.code,
        isGuestCheckout: !user,
      };

      const res = await createOrder(orderData).unwrap();

      if (res.success) {
        toast.success("Order submitted successfully", {
          id: toastId,
          duration: 2000,
        });
        router.push(`/checkout/success/${res.data._id}`);
        dispatch(removeAllFromCart());
        dispatch(clearOrderData());
      }
    } catch (error: any) {
      const errorMessage =
        error.data?.message || error.message || "Failed to submit order";
      toast.error(errorMessage, {
        id: toastId,
        duration: 2000,
      });
      setError(errorMessage);
    } finally {
      toast.dismiss(toastId);
    }
  };

  if (isLoadingLocation) {
    return (
      <div className="p-6 sm:p-8 rounded-2xl border border-rose-100 bg-white shadow-sm">
        <div className="flex flex-col items-center justify-center py-16">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Heart className="h-5 w-5 text-rose-400 animate-pulse" />
            </div>
          </div>
          <span className="mt-4 text-gray-600 font-medium">Loading location data...</span>
          <span className="text-sm text-gray-400 mt-1">Just a moment please</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 rounded-2xl border border-rose-100 bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* Header */}
      <div className="mb-8 border-b border-rose-100 pb-6">
        <h2 className="text-2xl font-light text-gray-800 mb-2">
          Shipping <span className="font-medium text-rose-600">Information</span>
        </h2>
        <p className="text-gray-500 text-sm">
          Please fill in your details to complete your order
        </p>
        {isError && (
          <div className="mt-4">
            <ErrorMessage errorMessage={error} />
          </div>
        )}
        {isSuccess && (
          <div className="mt-4">
            <SuccessMessage successMessage="Order submitted successfully" />
          </div>
        )}
      </div>

      <AppForm
        onSubmit={onSubmit}
        resolver={zodResolver(checkoutSchema)}
        defaultValues={{
          "shippingAddress.country": "Bangladesh",
        }}
      >
        <div className="space-y-8">
          {/* Personal Information Section */}
          <div className="bg-gradient-to-r from-rose-50/50 to-pink-50/50 rounded-xl p-6 border border-rose-100">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 flex items-center justify-center mr-3 shadow-sm">
                <User className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">
                Personal Details
              </h3>
              <div className="ml-auto flex items-center text-xs text-rose-500">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-1"></span>
                Step 1 of 2
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <AppInput
                  type="text"
                  name="name"
                  label="Full Name"
                  placeholder="Enter your full name"
                  required
                  aria-required="true"
                />
              </div>
              <div className="space-y-2">
                <AppInput
                  type="email"
                  name="email"
                  label="Email Address"
                  placeholder="your@email.com"
                  required={false}
                  variant="bordered"
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <AppPhoneInput
                  name="phone"
                  label="Phone Number"
                  placeholder="+880 1712345678"
                  required
                />
              </div>
            </div>
          </div>

          {/* Shipping Address Section */}
          <div className="bg-gradient-to-r from-rose-50/50 to-pink-50/50 rounded-xl p-6 border border-rose-100">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 flex items-center justify-center mr-3 shadow-sm">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">
                Shipping Address
              </h3>
              <div className="ml-auto flex items-center text-xs text-rose-500">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-1"></span>
                Step 2 of 2
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2 space-y-2">
                <AppInput
                  type="text"
                  name="shippingAddress.line1"
                  label="Address Line 1"
                  placeholder="House, Road, Area"
                  required
                  aria-required="true"
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <AppInput
                  type="text"
                  name="shippingAddress.line2"
                  label="Address Line 2 (Optional)"
                  placeholder="Apartment, Suite, etc."
                  required={false}
                />
              </div>

              {/* Country Input */}
              <div className="space-y-2">
                <AppInput
                  name="shippingAddress.country"
                  label="Country"
                  placeholder="Bangladesh"
                  type="text"
                  required
                  aria-required="true"
                  defaultValue="Bangladesh"
                />
              </div>

              {/* Division Selector */}
              <div className="space-y-2">
                <AppSelect
                  name="shippingAddress.division"
                  label="Division"
                  placeholder="Select Division"
                  options={locationData.divisions.map((division) => ({
                    value: String(division.id),
                    label: `${division.name} (${division.bn_name})`,
                  }))}
                  required
                  onChange={handleDivisionChange}
                  className="border-rose-200 focus:border-rose-400 focus:ring-rose-400"
                />
              </div>

              {/* District Selector */}
              <div className="space-y-2">
                <AppSelect
                  name="shippingAddress.district"
                  label="District"
                  placeholder={
                    selectedDivision
                      ? "Select District"
                      : "Select Division First"
                  }
                  options={filteredDistricts.map((district) => ({
                    value: district.id,
                    label: `${district.name} (${district.bn_name})`,
                  }))}
                  required
                  disabled={!selectedDivision}
                  onChange={handleDistrictChange}
                  className="border-rose-200 focus:border-rose-400 focus:ring-rose-400"
                />
              </div>

              {/* Upazila Selector */}
              <div className="space-y-2">
                <AppSelect
                  name="shippingAddress.upazila"
                  label="Upazila / Thana"
                  placeholder={
                    selectedDistrict
                      ? "Select Upazila"
                      : "Select District First"
                  }
                  options={filteredUpazilas.map((upazila) => ({
                    value: upazila.id,
                    label: `${upazila.name} (${upazila.bn_name})`,
                  }))}
                  required
                  disabled={!selectedDistrict}
                  onChange={handleUpazilaChange}
                  className="border-rose-200 focus:border-rose-400 focus:ring-rose-400"
                />
              </div>

              <div className="space-y-2">
                <AppPhoneInput
                  name="shippingAddress.phone"
                  label="Delivery Phone (Optional)"
                  placeholder="Alternative phone number"
                  required={false}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <Button
            type="submit"
            value={isLoading ? "Processing..." : "Place Order"}
            disabled={isLoading || isLoadingLocation}
            extraClass="w-full py-4 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-medium text-lg rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border-0"
          />
        </div>
      </AppForm>
    </div>
  );
};

export default CheckoutForm;