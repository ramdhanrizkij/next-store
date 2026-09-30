"use client";

import { Heart, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type React from "react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

interface Product {
  id: string;
  name: string;
  category: string;
  badge?: {
    text: string;
    variant: "new" | "trending" | "hot" | "bestSeller";
  };
  image: string;
  swatches: string[];
  moreColors: number;
  stockProgress: number;
  rating: number;
  reviewsCount: number;
  originalPrice: number;
  price: number;
}

const productsData: Product[] = [
  {
    id: "1",
    name: "Klipsch R-120SW Beautiful 5'5\" Qualitiful Sofa Homies",
    category: "Sofa & Homies",
    badge: { text: "NEW", variant: "new" },
    image: "/images/product-1.png",
    swatches: ["#9b7c69", "#d4af37", "#2563eb"],
    moreColors: 3,
    stockProgress: 45,
    rating: 5,
    reviewsCount: 215,
    originalPrice: 217.67,
    price: 156.07,
  },
  {
    id: "2",
    name: "Rabit Elegant Minimalist Design Acoustic Side Table",
    category: "Modern Furniture",
    badge: { text: "TRENDING", variant: "trending" },
    image: "/images/product-2.png",
    swatches: ["#2563eb", "#eab308", "#94a3b8"],
    moreColors: 3,
    stockProgress: 65,
    rating: 5,
    reviewsCount: 252,
    originalPrice: 220.64,
    price: 157.98,
  },
  {
    id: "3",
    name: "RFL Handcrafted Wooden Bar High Stool with Comfort Unit",
    category: "Seating & Stools",
    image: "/images/product-3.png",
    swatches: ["#06b6d4", "#60a5fa", "#1e3a8a"],
    moreColors: 3,
    stockProgress: 30,
    rating: 5,
    reviewsCount: 289,
    originalPrice: 227.43,
    price: 162.61,
  },
  {
    id: "4",
    name: "Grid Soft Cozy 4-Seater Sofa with Soft Fabric Finish",
    category: "Contemporary Furniture",
    badge: { text: "HOT", variant: "hot" },
    image: "/images/product-4.png",
    swatches: ["#334155", "#3b82f6", "#22d3ee"],
    moreColors: 3,
    stockProgress: 85,
    rating: 5,
    reviewsCount: 326,
    originalPrice: 228.26,
    price: 162.98,
  },
  {
    id: "5",
    name: "Oversized Comfy Partex Soft Bean Bag Chair for Relaxation",
    category: "Living Room Essentials",
    badge: { text: "BEST SELLER", variant: "bestSeller" },
    image: "/images/product-5.png",
    swatches: ["#cbd5e1", "#fde047", "#f97316"],
    moreColors: 4,
    stockProgress: 50,
    rating: 5,
    reviewsCount: 363,
    originalPrice: 232.79,
    price: 165.98,
  },
  {
    id: "6",
    name: "Klipsch Scandinavian Wooden Dining Chair Detailed Action",
    category: "Dining Room Chairs",
    badge: { text: "NEW", variant: "new" },
    image: "/images/product-6.png",
    swatches: ["#eab308", "#fdba74", "#1e40af"],
    moreColors: 3,
    stockProgress: 40,
    rating: 5,
    reviewsCount: 400,
    originalPrice: 239.3,
    price: 170.38,
  },
  {
    id: "7",
    name: "Hatil Furniture Stylish Armchair with Plush Cushion Support",
    category: "Premium Seating",
    image: "/images/product-7.png",
    swatches: ["#f59e0b", "#3b82f6", "#1e3a8a"],
    moreColors: 7,
    stockProgress: 60,
    rating: 5,
    reviewsCount: 437,
    originalPrice: 244.7,
    price: 173.98,
  },
  {
    id: "8",
    name: "Modern Coffee Table with Artistic Base - Comfort Product",
    category: "Unique Tables",
    badge: { text: "TRENDING", variant: "trending" },
    image: "/images/product-8.png",
    swatches: ["#f59e0b", "#fb7185", "#1e3a8a"],
    moreColors: 3,
    stockProgress: 35,
    rating: 5,
    reviewsCount: 474,
    originalPrice: 247.86,
    price: 175.98,
  },
];

const tabs = ["Best Sellers", "New Arrivals", "On Sale", "View All"];

export function DealsSection() {
  const [activeTab, setActiveTab] = useState("Best Sellers");
  const [wishlist, setWishlist] = useState<Record<string, boolean>>({});

  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlist((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section className="w-full py-14 sm:py-16 bg-[#f9fafb]">
      <div className="max-w-[1290px] mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
            Deals of The Day
          </h2>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 ${
                  activeTab === tab
                    ? "bg-neutral-900 text-white shadow-xs"
                    : "bg-white text-neutral-600 hover:text-neutral-900 border border-neutral-200"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid (4 columns) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {productsData.map((product) => {
            const isFav = wishlist[product.id];

            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-neutral-200/80 p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:border-neutral-300 hover:-translate-y-0.5 group"
              >
                {/* Top Badge & Wishlist Heart */}
                <div>
                  <div className="flex items-center justify-between mb-2 min-h-[24px]">
                    {product.badge ? (
                      <Badge variant={product.badge.variant}>
                        {product.badge.text}
                      </Badge>
                    ) : (
                      <div />
                    )}

                    <button
                      type="button"
                      onClick={(e) => toggleWishlist(product.id, e)}
                      className={`p-1 rounded-full transition-colors ${
                        isFav
                          ? "text-rose-500 fill-rose-500"
                          : "text-neutral-400 hover:text-rose-500"
                      }`}
                      aria-label="Add to wishlist"
                    >
                      <Heart
                        className={`w-4 h-4 ${isFav ? "fill-rose-500" : ""}`}
                      />
                    </button>
                  </div>

                  {/* Product Image */}
                  <Link
                    href={`/products/${product.id}`}
                    className="block relative w-full h-48 sm:h-52 my-2 overflow-hidden"
                  >
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                  </Link>

                  {/* Color Swatches and Stock Indicator */}
                  <div className="pt-2">
                    <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
                      <div className="flex items-center gap-1.5">
                        {product.swatches.map((color) => (
                          <span
                            key={`${product.id}-${color}`}
                            className="w-2.5 h-2.5 rounded-full inline-block border border-neutral-200 cursor-pointer hover:scale-125 transition-transform"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                      <span className="text-[11px] text-neutral-500 font-medium">
                        +{product.moreColors} More Items
                      </span>
                    </div>

                    {/* Blue Stock Progress Bar */}
                    <div className="w-full bg-neutral-100 h-1.5 rounded-full overflow-hidden mb-3">
                      <div
                        className="bg-blue-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${product.stockProgress}%` }}
                      />
                    </div>
                  </div>

                  {/* Category */}
                  <span className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer block mb-1">
                    {product.category}
                  </span>

                  {/* Title */}
                  <Link
                    href={`/products/${product.id}`}
                    className="text-sm font-bold text-neutral-800 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors min-h-[2.5rem]"
                  >
                    {product.name}
                  </Link>
                </div>

                {/* Rating & Pricing Bottom Row */}
                <div className="mt-4 pt-3 border-t border-neutral-100">
                  {/* Rating Stars */}
                  <div className="flex items-center gap-1 mb-2">
                    <div className="flex text-amber-400">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={`star-${product.id}-${star}`}
                          className="w-3.5 h-3.5 fill-amber-400 text-amber-400"
                        />
                      ))}
                    </div>
                    <span className="text-xs text-neutral-500 font-semibold ml-1">
                      ({product.reviewsCount})
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs text-neutral-400 line-through font-medium">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                    <span className="text-base sm:text-lg font-black text-neutral-900 tracking-tight">
                      ${product.price.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
