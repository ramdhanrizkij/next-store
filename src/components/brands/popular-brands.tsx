"use client";

import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const brands = [
  { name: "Anker", image: "/images/brand-1.png", href: "/brands/anker" },
  { name: "Baseus", image: "/images/brand-2.png", href: "/brands/baseus" },
  { name: "Belkin", image: "/images/brand-3.png", href: "/brands/belkin" },
  { name: "EcoFlow", image: "/images/brand-4.png", href: "/brands/ecoflow" },
  {
    name: "Energizer",
    image: "/images/brand-5.png",
    href: "/brands/energizer",
  },
  { name: "Huawei", image: "/images/brand-6.png", href: "/brands/huawei" },
  { name: "Logitech", image: "/images/brand-7.png", href: "/brands/logitech" },
  {
    name: "Panasonic",
    image: "/images/brand-8.png",
    href: "/brands/panasonic",
  },
  { name: "Samsung", image: "/images/brand-9.png", href: "/brands/samsung" },
  { name: "Spigen", image: "/images/brand-10.png", href: "/brands/spigen" },
  { name: "Nillkin", image: "/images/brand-11.png", href: "/brands/nillkin" },
  { name: "Xiaomi Mi", image: "/images/brand-12.png", href: "/brands/mi" },
];

export function PopularBrands() {
  return (
    <section className="w-full py-12 sm:py-16">
      <div className="max-w-[1290px] mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8 pb-3 border-b border-neutral-100">
          <h2 className="text-xl sm:text-[26px] font-extrabold text-neutral-900 tracking-tight">
            Popular By Brands
          </h2>

          <Link
            href="/brands"
            className="flex items-center gap-1 text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
          >
            <span>View All Brands</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Brands 6-column Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-5">
          {brands.map((b) => (
            <Link
              key={b.name}
              href={b.href}
              className="bg-[#f8f9fa] hover:bg-white rounded-2xl border border-neutral-200/80 hover:border-neutral-300 p-4 h-24 sm:h-28 flex items-center justify-center transition-all duration-300 hover:shadow-md group relative overflow-hidden"
            >
              <div className="relative w-full h-full">
                <Image
                  src={b.image}
                  alt={b.name}
                  fill
                  className="object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
