import Container from "@/components/common/Container";
import CheckoutForm from "@/components/pages/checkout/CheckoutForm";
import CheckoutSummary from "@/components/pages/checkout/CheckoutSummary";
import { getGlobalData } from "@/utils/getGlobalData";
import { Metadata } from "next";
import React from "react";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { Sparkles } from "lucide-react";

const CheckoutPage = async () => {
  const session = (await getServerSession(authOptions)) as any;

  return (
    <div className="bg-gradient-to-b from-white to-rose-50/30 min-h-screen pb-20">
      <Container>
        {/* Header */}
        <div className="text-center pt-24 pb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 mb-4 shadow-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-light text-gray-800 mb-2">
            Complete Your <span className="font-medium text-rose-600">Purchase</span>
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto">
            You're just a few steps away from your beauty essentials
          </p>
          <div className="w-24 h-0.5 bg-gradient-to-r from-rose-300 to-pink-300 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8 mt-8">
          <div className="lg:w-2/3">
            <CheckoutForm user={session?.user} />
          </div>
          <div className="lg:w-1/3">
            <CheckoutSummary />
          </div>
        </div>
      </Container>
    </div>
  );
};

export default CheckoutPage;

export async function generateMetadata(): Promise<Metadata> {
  const data = await getGlobalData();
  return {
    title: data?.shopName + " | Checkout",
    description: data?.description || "",
    openGraph: {
      images: [
        {
          url: data?.logo || "",
          alt: data?.shopName || "",
        },
      ],
    },
  };
}