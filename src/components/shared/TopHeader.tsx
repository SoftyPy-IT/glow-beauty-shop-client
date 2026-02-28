"use client";

import Facebook from "@/icons/Facebook";
import Instagram from "@/icons/Instragram";
import Linkedin from "@/icons/Linkedin";
import Twitter from "@/icons/Twitter";
import Youtube from "@/icons/Youtube";
import { useLogoutMutation } from "@/redux/features/auth/authApi";
import { logout } from "@/redux/features/auth/authSlice";
import { useGetCategoriesTreeQuery } from "@/redux/features/products/category.api";
import { useAppDispatch } from "@/redux/hooks";
import { ScrollShadow } from "@heroui/react";
import {
  CircleUser,
  Menu,
  Package,
  Search,
  Settings,
  User,
  X,
  Heart,
  Sparkles,
} from "lucide-react";

import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import CartItem from "../Cart/CartItem";
import Logo from "../common/Logo";
import Preloader from "../common/Preloader";
import HeaderSearchBar from "./HeaderSearchBar";
import MegaMenu from "./MegaMenu";
import MobileMegaMenu from "./MobileMegaMenu";
import WishlistIcon from "./WishlistIcon";
import { useAppSelector } from "@/redux/hooks";
import { selectStorefrontData } from "@/redux/features/storefront/storeSlice";

const profileLinks = [
  {
    name: "Profile",
    href: "/profile/my-account",
    icon: <User className="w-4 h-4" />,
  },
  {
    name: "Settings",
    href: "/profile/settings",
    icon: <Settings className="w-4 h-4" />,
  },
  {
    name: "Orders",
    href: "/profile/orders",
    icon: <Package className="w-4 h-4" />,
  },
];

interface TopHeaderProps {
  session?: any;
}

const TopHeader = ({ session }: TopHeaderProps) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dispatch = useAppDispatch();
  const [logoutUser, { isLoading }] = useLogoutMutation();
  const appData = useAppSelector(selectStorefrontData);
  const { data, isLoading: isNavigationLoading } =
    useGetCategoriesTreeQuery(undefined);
  const user = session?.user as any;
  const navigation = data as any;

  useEffect(() => {
    if (showSearch || showProfileMenu) {
      const closeDropdowns = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (!target.closest(".header-dropdown")) {
          setShowSearch(false);
          setShowProfileMenu(false);
        }
      };
      document.addEventListener("click", closeDropdowns);
      return () => document.removeEventListener("click", closeDropdowns);
    }
  }, [showSearch, showProfileMenu]);

  const handleLogout = async () => {
    try {
      await signOut({ callbackUrl: "/login", redirect: false });
      await logoutUser(undefined);
      dispatch(logout());
      window.location.href = "/login";
    } catch (error) { }
  };

  if (isNavigationLoading) return <Preloader />;

  const socialLinks = [
    {
      Icon: Facebook,
      href: appData?.socialMedia?.facebook || "#",
      name: "Facebook",
    },
    {
      Icon: Twitter,
      href: appData?.socialMedia?.twitter || "#",
      name: "Twitter",
    },
    {
      Icon: Instagram,
      href: appData?.socialMedia?.instagram || "#",
      name: "Instagram",
    },
    {
      Icon: Youtube,
      href: appData?.socialMedia?.youtube || "#",
      name: "Youtube",
    },
    {
      Icon: Linkedin,
      href: appData?.socialMedia?.linkedin || "#",
      name: "LinkedIn",
    },
  ];

  return (
    <div className="fixed w-full z-50 bg-gradient-to-r from-rose-50 to-pink-50 top-0 left-0 transition-colors duration-300 shadow-sm">
      {/* Top Section */}
      <div className="border-b border-rose-200 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="py-3 lg:py-5 flex items-center justify-between">
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 hover:bg-rose-100 rounded-full transition-colors"
              aria-label="Toggle mobile menu"
            >
              <Menu className="w-6 h-6 text-pink-600" />
            </button>

            {/* Social Icons - Hidden on Mobile */}
            <div className="hidden lg:flex items-center space-x-3">
              {socialLinks.map(({ Icon, href }, index) => (
                <Link
                  key={index}
                  href={href}
                  className="w-8 h-8 rounded-full bg-white border border-pink-200 flex items-center justify-center hover:bg-pink-500 hover:border-pink-500 hover:text-white transition-all duration-300 group"
                >
                  <Icon />
                </Link>
              ))}
            </div>

            {/* Center Logo */}
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <div className="transform hover:scale-105 transition-transform duration-300">
                <Logo />
              </div>
            </div>

            {/* Right Controls */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Search */}
              <div className="header-dropdown relative">
                <button
                  className="w-9 h-9 rounded-full bg-white border border-pink-200 flex items-center justify-center hover:bg-pink-500 hover:border-pink-500 hover:text-white transition-all duration-300 group"
                  onClick={() => setShowSearch(!showSearch)}
                  aria-label="Toggle search"
                >
                  {showSearch ? (
                    <X className="w-4 h-4 text-pink-500 group-hover:text-white" />
                  ) : (
                    <Search className="w-4 h-4 text-pink-500 group-hover:text-white" />
                  )}
                </button>
              </div>

              {/* Wishlist */}
              <div className="hidden sm:block">
                <div className="w-9 h-9 rounded-full bg-white border border-pink-200 flex items-center justify-center hover:bg-pink-500 hover:border-pink-500 transition-all duration-300 group">
                  <WishlistIcon />
                </div>
              </div>

              {/* Cart */}
              <div className="w-9 h-9 rounded-full bg-white border border-pink-200 flex items-center justify-center hover:bg-pink-500 hover:border-pink-500 transition-all duration-300 group">
                <CartItem />
              </div>

              {/* User Menu */}
              <div className="relative">
                {session ? (
                  <div className="header-dropdown">
                    <button
                      onClick={() => setShowProfileMenu(!showProfileMenu)}
                      className="w-9 h-9 rounded-full bg-white border border-pink-200 flex items-center justify-center hover:bg-pink-500 hover:border-pink-500 transition-all duration-300 group"
                    >
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-pink-400 to-rose-400 flex items-center justify-center">
                        {user?.avatar?.url ? (
                          <Image
                            src={user?.avatar?.url}
                            alt="User Avatar"
                            width={24}
                            height={24}
                            className="rounded-full"
                          />
                        ) : (
                          <span className="text-white text-xs font-medium">
                            {user?.name?.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                    </button>

                    {showProfileMenu && (
                      <div className="absolute z-50 right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-pink-100 overflow-hidden">
                        <div className="p-6 border-b border-pink-100 bg-gradient-to-r from-pink-500 to-rose-500">
                          <p className="text-base font-medium text-white">
                            {user?.name}
                          </p>
                          <p className="text-sm text-pink-100 mt-1">
                            {user?.email}
                          </p>
                        </div>
                        <div className="py-2">
                          {profileLinks.map((link) => (
                            <Link
                              onClick={() => setShowProfileMenu(false)}
                              key={link.name}
                              href={link.href}
                              className="flex items-center px-6 py-3 text-sm text-gray-700 hover:bg-pink-50 transition-colors group"
                            >
                              <span className="mr-3 text-pink-500 group-hover:text-pink-600">
                                {link.icon}
                              </span>
                              {link.name}
                            </Link>
                          ))}
                          <button
                            onClick={handleLogout}
                            disabled={isLoading}
                            className="w-full text-left px-6 py-3 text-sm text-gray-700 hover:bg-rose-50 transition-colors flex items-center group"
                          >
                            <span className="mr-3 text-rose-500 group-hover:text-rose-600">
                              <X className="w-4 h-4" />
                            </span>
                            {isLoading ? "Logging out..." : "Logout"}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link href="/login">
                    <button
                      type="button"
                      className="w-9 h-9 rounded-full bg-white border border-pink-200 flex items-center justify-center hover:bg-pink-500 hover:border-pink-500 transition-all duration-300 group"
                      aria-label="Login"
                    >
                      <CircleUser className="w-4 h-4 text-pink-500 group-hover:text-white" />
                    </button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section - Categories */}
      {!isMobileMenuOpen && (
        <div className="hidden lg:block border-b border-pink-100 bg-white/90 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="py-2">
              <nav className="hidden lg:flex items-center justify-center space-x-8">
                <MegaMenu navigation={navigation} />
              </nav>
            </div>
          </div>
        </div>
      )}

      <div className="lg:hidden flex justify-center items-center w-full overflow-hidden bg-white/90 backdrop-blur-sm border-t border-pink-100">
        <ScrollShadow
          hideScrollBar
          orientation="horizontal"
          className="flex overflow-x-auto px-4 py-2 space-x-6"
        >
          <Link
            href="/"
            className="text-sm font-medium text-pink-600 hover:text-rose-600 transition-colors py-1 whitespace-nowrap border-b-2 border-transparent hover:border-pink-500"
            aria-label="Home"
          >
            HOME
          </Link>
          <Link
            href="/products"
            className="text-sm font-medium text-pink-600 hover:text-rose-600 transition-colors py-1 whitespace-nowrap border-b-2 border-transparent hover:border-pink-500"
            aria-label="Shop"
          >
            SHOP
          </Link>
          <Link
            href="/products/combo"
            className="text-sm font-medium text-pink-600 hover:text-rose-600 transition-colors py-1 whitespace-nowrap border-b-2 border-transparent hover:border-pink-500"
            aria-label="Shop"
          >
            COMBO
          </Link>

          {navigation.map((category: any) => (
            <Link
              key={category._id}
              href={`/categories/${category.name.toLowerCase()}`}
              className="text-sm font-medium text-pink-600 uppercase hover:text-rose-600 transition-colors py-1 whitespace-nowrap border-b-2 border-transparent hover:border-pink-500"
              aria-label={`Category: ${category.name}`}
            >
              {category.name}
            </Link>
          ))}
        </ScrollShadow>
      </div>

      {/* Search Overlay */}
      {showSearch && <HeaderSearchBar onClose={() => setShowSearch(false)} />}

      {/* Mobile Menu */}
      <MobileMegaMenu
        navigation={navigation}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        user={user}
        profileLinks={profileLinks}
        handleLogout={handleLogout}
        isLoading={isLoading}
        logoSrc={appData?.logo}
      />
    </div>
  );
};

export default TopHeader;