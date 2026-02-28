"use client";

import Link from "next/link";
import React from "react";
import Logo from "../common/Logo";
import HeaderSearchBar from "./HeaderSearchBar";

import UserAvatar from "./UserAvatar";
import UserIcon from "./UserIcon";
import { useAppSelector } from "@/redux/hooks";
import {
  selectProfile,
  useCurrentToken,
} from "@/redux/features/auth/authSlice";

const TopHeaderDesktop = () => {
  const user = useAppSelector(selectProfile);
  const isAuthenticated = useAppSelector(useCurrentToken);
  return (
    <div className="relative flex h-16 px-6 justify-between z-50 bg-gradient-to-r from-rose-50 to-pink-50 border-b border-pink-100">
      <div className="relative flex flex-1 items-center justify-center px-2 sm:absolute sm:inset-0">
        <Link href="/" className="hidden flex-shrink-0 items-center lg:flex">
          <Logo />
        </Link>
      </div>
      <HeaderSearchBar
        onClose={() => {
          console.log("close");
        }}
      />

      <div className="hidden space-x-3 lg:relative lg:z-10 lg:flex lg:items-center">
        {isAuthenticated ? (
          <>
            <UserIcon profile={isAuthenticated ? user : null} />
          </>
        ) : (
          <>
            <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-4">
              <Link
                href="/register"
                className="text-sm font-medium text-pink-600 hover:text-rose-600 transition-colors"
              >
                Create an account
              </Link>
              <span className="h-6 w-px bg-pink-200" aria-hidden="true" />
              <Link
                href="/login"
                className="text-sm font-medium text-pink-600 hover:text-rose-600 transition-colors"
              >
                Sign in
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TopHeaderDesktop;