"use client";

import { Fragment, useState } from "react";
import { Dialog, Popover, Transition } from "@headlessui/react";
import { Menu as Bars3Icon, X as XMarkIcon } from "lucide-react";
import WishlistIcon from "./WishlistIcon";

import Link from "next/link";
import Logo from "../common/Logo";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { logout, selectProfile } from "@/redux/features/auth/authSlice";
import { useLogoutMutation } from "@/redux/features/auth/authApi";
import CartItem from "../Cart/CartItem";
import Button from "../buttons/Button";
import { useGetCategoriesTreeQuery } from "@/redux/features/products/category.api";
import MegaMenu from "./MegaMenu";
import MobileMegaMenu from "./MobileMegaMenu";
import Preloader from "../common/Preloader";
import { EnvelopeIcon } from "@heroicons/react/24/outline";

const profileLinks = [
  { name: "Profile", href: "/profile/my-account" },
  { name: "Settings", href: "/profile/settings" },
  { name: "Orders", href: "/profile/orders" },
];

interface CategoryTree {
  _id: string;
  name: string;
  image: string;
  categories: {
    _id: string;
    name: string;
    subCategories?: {
      _id: string;
      name: string;
      slug: string;
      category: string;
    }[];
    mainCategory: string;
  }[];
}

const DesktopNavigation = () => {
  const [open, setOpen] = useState(false);
  const user = useAppSelector(selectProfile);
  const dispatch = useAppDispatch();
  const [logoutuser, { isLoading }] = useLogoutMutation();

  const { data, isLoading: isNavigationLoading } =
    useGetCategoriesTreeQuery(undefined);

  const navigation = data as any;

  const handleLogout = async () => {
    await logoutuser(undefined);
    dispatch(logout());
    window.location.href = "/login";
  };

  if (isNavigationLoading) return <Preloader />;
  return (
    <div className="bg-gradient-to-r from-rose-50 to-pink-50">
      {/* Mobile menu */}
      <MobileMegaMenu
        navigation={navigation}
        isOpen={open}
        onClose={() => setOpen(false)}
        user={user}
        profileLinks={profileLinks}
        handleLogout={handleLogout}
        isLoading={isLoading}
      />

      <header className="relative px-6">
        <nav aria-label="Top">
          {/* Secondary navigation */}
          <div className="bg-white/80 backdrop-blur-sm rounded-b-2xl shadow-sm border-b border-pink-100">
            <div className="">
              <div className="">
                <div className="flex h-16 items-center justify-between">
                  {/* <div className="flex items-center space-x-2">
                    <EnvelopeIcon className="h-6 w-6 text-pink-400" />
                    <Link href="/" className="hidden lg:flex items-center text-pink-600">
                      Contact Us
                    </Link>
                  </div> */}
                  <MegaMenu navigation={navigation} />

                  {/* Mobile menu and search (lg-) */}
                  <div className="flex items-center justify-between lg:hidden">
                    <button
                      type="button"
                      className="-ml-2 rounded-full bg-white p-2 text-pink-500 hover:bg-pink-100 transition-colors border border-pink-200"
                      onClick={() => setOpen(true)}
                    >
                      <span className="sr-only">Open menu</span>
                      <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>

                  {/* Logo (lg-) */}
                  <a href="#" className="lg:hidden">
                    <span className="sr-only">Your Company</span>
                    <Logo />
                  </a>

                  <div className="flex items-center space-x-4">
                    <div className="w-9 h-9 rounded-full bg-white border border-pink-200 flex items-center justify-center hover:bg-pink-500 hover:border-pink-500 transition-all duration-300 group">
                      <WishlistIcon />
                    </div>
                    <div className="w-9 h-9 rounded-full bg-white border border-pink-200 flex items-center justify-center hover:bg-pink-500 hover:border-pink-500 transition-all duration-300 group">
                      <CartItem />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
};

export default DesktopNavigation;