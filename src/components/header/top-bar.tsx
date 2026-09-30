"use client";

import { ChevronDown, Phone } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function TopBar() {
  const [currency, setCurrency] = useState("USD");
  const [language, setLanguage] = useState("ENGLISH");

  return (
    <div className="w-full bg-[#f8f9fa] border-b border-neutral-200/80 text-[12px] text-neutral-600">
      <div className="max-w-[1290px] mx-auto px-4 sm:px-6 h-9 flex items-center justify-between">
        {/* Left Side: Store Location & Selectors */}
        <div className="flex items-center gap-4 sm:gap-5">
          <Link
            href="#"
            className="hover:text-blue-600 transition-colors font-medium"
          >
            <span>Store Location</span>
          </Link>

          <div className="h-3 w-[1px] bg-neutral-300" />

          {/* Currency Selector */}
          <div className="relative group cursor-pointer flex items-center gap-1 hover:text-blue-600 transition-colors font-medium">
            <span>$ {currency}</span>
            <ChevronDown className="w-3.5 h-3.5 text-neutral-400 group-hover:text-blue-600 transition-colors" />
            <div className="hidden group-hover:block absolute top-full left-0 mt-1 bg-white border border-neutral-200 rounded-lg shadow-xl py-1 z-50 min-w-[90px] animate-in fade-in duration-100">
              {["USD", "EUR", "IDR"].map((curr) => (
                <button
                  key={curr}
                  type="button"
                  onClick={() => setCurrency(curr)}
                  className="w-full text-left px-3 py-1.5 hover:bg-neutral-50 text-neutral-700 text-xs font-medium"
                >
                  $ {curr}
                </button>
              ))}
            </div>
          </div>

          <div className="h-3 w-[1px] bg-neutral-300" />

          {/* Language Selector */}
          <div className="relative group cursor-pointer flex items-center gap-1.5 hover:text-blue-600 transition-colors font-medium">
            <span className="text-xs">🇺🇸</span>
            <span>{language}</span>
            <ChevronDown className="w-3.5 h-3.5 text-neutral-400 group-hover:text-blue-600 transition-colors" />
            <div className="hidden group-hover:block absolute top-full left-0 mt-1 bg-white border border-neutral-200 rounded-lg shadow-xl py-1 z-50 min-w-[120px] animate-in fade-in duration-100">
              {[
                { label: "ENGLISH", flag: "🇺🇸" },
                { label: "INDONESIA", flag: "🇮🇩" },
              ].map((lang) => (
                <button
                  key={lang.label}
                  type="button"
                  onClick={() => setLanguage(lang.label)}
                  className="w-full text-left px-3 py-1.5 hover:bg-neutral-50 text-neutral-700 text-xs font-medium flex items-center gap-2"
                >
                  <span>{lang.flag}</span>
                  <span>{lang.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Center: Trending Announcement */}
        <div className="hidden lg:flex items-center gap-1.5 text-neutral-600">
          <span className="font-bold text-neutral-800">Trending Now :</span>
          <span>Explore what thanksgiving, trees you need decor</span>
          <Link
            href="#"
            className="text-blue-600 hover:text-blue-700 underline font-semibold ml-1"
          >
            Know more
          </Link>
        </div>

        {/* Right Side: Contact info */}
        <div className="flex items-center gap-2 text-neutral-700 text-xs">
          <Phone className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span className="text-neutral-500 font-normal">Contact 24/7</span>
          <span className="text-neutral-900 font-bold tracking-tight">
            +800 300-353-569
          </span>
        </div>
      </div>
    </div>
  );
}
