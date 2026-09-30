"use client";

import { ChevronDown, Menu, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const navLinks = [
  { label: "Demos", href: "#", hasSub: true },
  { label: "Shop", href: "/products", hasSub: true },
  { label: "Pages", href: "#", hasSub: true },
  { label: "Elements", href: "#", hasSub: true },
  { label: "Core Features", href: "#", hasSub: true },
  { label: "More", href: "#", hasSub: true },
];

const categoryList = [
  "Smartphones & Tablets",
  "Laptops & Computers",
  "Cameras & Photography",
  "Audio & Headphones",
  "Drones & Flight Gear",
  "Gaming Consoles & VR",
  "Smart Watches & Wearables",
  "Accessories & Cables",
];

export function CategoryNav() {
  const [categoriesOpen, setCategoriesOpen] = useState(false);

  return (
    <nav className="w-full bg-[#215ada] text-white">
      <div className="max-w-[1290px] mx-auto px-4 sm:px-6 h-[46px] flex items-center justify-between">
        {/* Left Nav items */}
        <div className="flex items-center gap-1 sm:gap-2">
          {navLinks.map((item) => (
            <div key={item.label} className="relative group">
              <Link
                href={item.href}
                className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-[13px] font-semibold tracking-wide text-white/90 hover:text-white hover:bg-blue-700/60 rounded-md transition-colors"
              >
                <span>{item.label}</span>
                {item.hasSub && (
                  <ChevronDown className="w-3.5 h-3.5 opacity-80 group-hover:rotate-180 transition-transform duration-200" />
                )}
              </Link>

              {item.hasSub && (
                <div className="hidden group-hover:block absolute top-full left-0 bg-white text-neutral-800 border border-neutral-200 rounded-lg shadow-xl py-2 min-w-[190px] z-50 animate-in fade-in-50 slide-in-from-top-1 duration-150">
                  <div className="px-3.5 py-1.5 text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                    {item.label} Navigation
                  </div>
                  <Link
                    href="/products"
                    className="block px-3.5 py-2 text-xs hover:bg-blue-50 hover:text-blue-600 font-medium transition-colors"
                  >
                    Featured Products
                  </Link>
                  <Link
                    href="/products?sort=newest"
                    className="block px-3.5 py-2 text-xs hover:bg-blue-50 hover:text-blue-600 font-medium transition-colors"
                  >
                    New Arrivals
                  </Link>
                  <Link
                    href="/products?discount=true"
                    className="block px-3.5 py-2 text-xs hover:bg-blue-50 hover:text-blue-600 font-medium transition-colors"
                  >
                    Special Offers
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Right Button: All Categories */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setCategoriesOpen(!categoriesOpen)}
            className="flex items-center gap-2.5 bg-[#1849ba] hover:bg-[#143ea0] px-4 py-2 rounded-md text-xs sm:text-[13px] font-bold transition-all shadow-xs"
          >
            <Menu className="w-4 h-4" />
            <span>All Categories</span>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                categoriesOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {categoriesOpen && (
            <div className="absolute top-full right-0 mt-1.5 w-64 bg-white text-neutral-800 border border-neutral-200 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in duration-150">
              <div className="px-4 py-2 text-xs font-bold text-neutral-400 uppercase tracking-wider border-b border-neutral-100 flex items-center justify-between">
                <span>Browse Categories</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              </div>
              {categoryList.map((cat) => (
                <Link
                  key={cat}
                  href={`/products?category=${encodeURIComponent(cat)}`}
                  onClick={() => setCategoriesOpen(false)}
                  className="block px-4 py-2 text-xs hover:bg-blue-50 hover:text-blue-600 transition-colors font-medium"
                >
                  {cat}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
