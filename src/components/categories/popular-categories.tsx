"use client";

import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const categories = [
  {
    name: "Mobile",
    image: "/images/cat-mobile.png",
    href: "/products?category=mobile",
  },
  {
    name: "Laptop",
    image: "/images/cat-laptop.png",
    href: "/products?category=laptop",
  },
  {
    name: "Camera",
    image: "/images/cat-camera.png",
    href: "/products?category=camera",
  },
  {
    name: "Drone",
    image: "/images/cat-drone.png",
    href: "/products?category=drone",
  },
  {
    name: "Headphone",
    image: "/images/cat-headphone.png",
    href: "/products?category=headphone",
  },
];

export function PopularCategories() {
  return (
    <section className="w-full py-10 sm:py-12">
      <div className="max-w-[1290px] mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8 pb-3 border-b border-neutral-100">
          <h2 className="text-xl sm:text-[26px] text-neutral-800 font-medium tracking-tight">
            Discover the{" "}
            <span className="font-extrabold text-neutral-900">
              Popular Categories
            </span>
          </h2>

          <Link
            href="/categories"
            className="flex items-center gap-1 text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
          >
            <span>View All Categories</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Categories Grid (5 columns) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5 sm:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              className="group flex flex-col items-center cursor-pointer"
            >
              {/* Category Image Box */}
              <div className="w-full aspect-square bg-[#f3f4f7] rounded-2xl overflow-hidden relative flex items-center justify-center p-5 transition-all duration-300 group-hover:bg-[#eaebf2] group-hover:shadow-md">
                <div className="relative w-full h-full transition-transform duration-300 group-hover:scale-105">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>

              {/* Category Name */}
              <span className="mt-3 text-sm sm:text-[15px] font-bold text-neutral-800 group-hover:text-blue-600 transition-colors text-center">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
