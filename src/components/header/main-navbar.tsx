"use client";

import {
  ChevronDown,
  Heart,
  Repeat2,
  Search,
  ShoppingBag,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const categories = [
  "All Categories",
  "Computer & Laptop",
  "Smartphones & Tablets",
  "Cameras & Photo",
  "TV, Audio & Video",
  "Gadgets & Tech",
  "Gaming Accessories",
];

export function MainNavbar() {
  const [selectedCat, setSelectedCat] = useState("All Categories");
  const [catOpen, setCatOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="w-full bg-white py-3.5 sm:py-4 border-b border-neutral-100">
      <div className="max-w-[1290px] mx-auto px-4 sm:px-6 flex items-center justify-between gap-6">
        {/* Brand Logo */}
        <Link href="/" className="shrink-0 flex items-center">
          <div className="relative h-9 w-36">
            <Image
              src="/images/logo.png"
              alt="UNIMART"
              fill
              className="object-contain object-left"
              priority
            />
          </div>
        </Link>

        {/* Center Search Bar */}
        <div className="hidden md:flex flex-1 max-w-2xl h-11 items-center border border-neutral-200 rounded-lg overflow-hidden focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
          {/* Category Dropdown */}
          <div className="relative shrink-0 h-full">
            <button
              type="button"
              onClick={() => setCatOpen(!catOpen)}
              className="h-full flex items-center gap-2 px-3.5 text-xs font-semibold text-neutral-700 hover:text-blue-600 bg-neutral-50/70 border-r border-neutral-200 transition-colors"
            >
              <span className="truncate max-w-[110px]">{selectedCat}</span>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
            </button>

            {catOpen && (
              <div className="absolute top-full left-0 mt-1 w-52 bg-white border border-neutral-200 rounded-lg shadow-xl py-1 z-50 animate-in fade-in duration-100">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setSelectedCat(cat);
                      setCatOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs hover:bg-blue-50 hover:text-blue-600 transition-colors font-medium ${
                      selectedCat === cat
                        ? "text-blue-600 font-bold bg-blue-50/50"
                        : "text-neutral-700"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Input field */}
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Looking for something specific?"
            className="flex-1 h-full px-4 text-xs sm:text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none"
          />

          {/* Search Button */}
          <button
            type="button"
            className="h-full px-4 bg-neutral-900 hover:bg-black text-white shrink-0 flex items-center justify-center transition-colors"
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-5 lg:gap-6 shrink-0">
          {/* Compare */}
          <Link
            href="#"
            className="relative flex items-center text-neutral-700 hover:text-blue-600 transition-colors"
            title="Compare"
          >
            <Repeat2 className="w-6 h-6 stroke-[1.5]" />
            <span className="absolute -top-1 -right-2 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
              0
            </span>
          </Link>

          {/* Wishlist */}
          <Link
            href="#"
            className="relative flex items-center text-neutral-700 hover:text-blue-600 transition-colors"
            title="Wishlist"
          >
            <Heart className="w-6 h-6 stroke-[1.5]" />
            <span className="absolute -top-1 -right-2 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
              0
            </span>
          </Link>

          {/* Account Login */}
          <Link
            href="/login"
            className="flex items-center gap-2.5 text-neutral-700 hover:text-blue-600 transition-colors group"
          >
            <div className="w-9 h-9 rounded-full border border-neutral-200 group-hover:border-blue-600 flex items-center justify-center transition-colors">
              <User className="w-4 h-4 text-neutral-700 group-hover:text-blue-600 transition-colors" />
            </div>
            <div className="hidden xl:flex flex-col text-left">
              <span className="text-[10px] text-neutral-400 font-medium leading-none">
                Log In/Sign Up
              </span>
              <span className="text-xs font-bold text-neutral-900 leading-tight mt-1 group-hover:text-blue-600 transition-colors">
                Access Account
              </span>
            </div>
          </Link>

          {/* Cart */}
          <Link
            href="/cart"
            className="flex items-center gap-2.5 text-neutral-700 hover:text-blue-600 transition-colors group"
          >
            <div className="relative">
              <div className="w-9 h-9 rounded-full border border-neutral-200 group-hover:border-blue-600 flex items-center justify-center transition-colors">
                <ShoppingBag className="w-4 h-4 text-neutral-700 group-hover:text-blue-600 transition-colors" />
              </div>
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                0
              </span>
            </div>
            <div className="hidden xl:flex flex-col text-left">
              <span className="text-[10px] text-neutral-400 font-medium leading-none">
                Total Cart
              </span>
              <span className="text-xs font-bold text-neutral-900 leading-tight mt-1 group-hover:text-blue-600 transition-colors">
                $0.00
              </span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
