"use client";

import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  Star,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface Testimonial {
  id: string;
  title: string;
  date: string;
  rating: number;
  content: string;
  author: string;
  verified?: boolean;
  productImage: string;
  productTitle: string;
  productHref: string;
}

const testimonials: Testimonial[] = [
  {
    id: "1",
    title: "Absolutely fantastic product!",
    date: "04/12/25",
    rating: 5,
    content:
      '"I\'ve always tried to choose only the best quality clothes. I have never been disappointed here."',
    author: "David Williams",
    verified: false,
    productImage: "/images/product-1.png",
    productTitle: "Electro Product Reviews Product",
    productHref: "/products/1",
  },
  {
    id: "2",
    title: "The hype is real!",
    date: "23/05/25",
    rating: 5,
    content:
      '"I\'ve always tried to choose only the best quality clothes. I have never been disappointed here."',
    author: "Steve Smith",
    verified: true,
    productImage: "/images/product-6.png",
    productTitle: "Electro Product Reviews Product",
    productHref: "/products/6",
  },
  {
    id: "3",
    title: "Helped with my brainfog!",
    date: "04/12/25",
    rating: 5,
    content:
      '"I\'ve always tried to choose only the best quality clothes. I have never been disappointed here."',
    author: "David Warner",
    verified: false,
    productImage: "/images/product-4.png",
    productTitle: "Electro Product Reviews Product",
    productHref: "/products/4",
  },
];

export function CustomerReviews() {
  const [activeDot, setActiveDot] = useState(0);

  const prevReview = () => {
    setActiveDot((prev) => (prev === 0 ? 3 : prev - 1));
  };

  const nextReview = () => {
    setActiveDot((prev) => (prev === 3 ? 0 : prev + 1));
  };

  return (
    <section className="w-full py-16 sm:py-20 bg-[#fcfcfc]">
      <div className="max-w-[1290px] mx-auto px-4 sm:px-6 relative">
        {/* Section Heading */}
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-[28px] text-neutral-800 font-medium tracking-tight">
            <span className="font-extrabold text-neutral-900">
              Customers loved
            </span>{" "}
            products
          </h2>
        </div>

        {/* Carousel Arrow Controls */}
        <button
          type="button"
          onClick={prevReview}
          aria-label="Previous review"
          className="absolute -left-1 sm:-left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white hover:bg-neutral-100 text-neutral-700 flex items-center justify-center transition-colors shadow-md border border-neutral-200/80"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={nextReview}
          aria-label="Next review"
          className="absolute -right-1 sm:-right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white hover:bg-neutral-100 text-neutral-700 flex items-center justify-center transition-colors shadow-md border border-neutral-200/80"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Testimonial Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-3xl border border-neutral-200/70 p-6 sm:p-7 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow"
            >
              <div>
                {/* Title & Date */}
                <h4 className="font-bold text-sm sm:text-base text-neutral-900 leading-snug">
                  {t.title}
                </h4>
                <span className="text-[11px] text-neutral-400 font-medium block mt-1">
                  {t.date}
                </span>

                {/* Star Rating */}
                <div className="flex text-amber-400 gap-1 my-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={`star-${t.id}-${star}`}
                      className="w-3.5 h-3.5 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-xs sm:text-[13px] text-neutral-600 leading-relaxed italic">
                  {t.content}
                </p>

                {/* Author Name + Verified */}
                <div className="flex items-center gap-2 mt-4 pt-2">
                  <span className="text-xs font-bold text-neutral-900">
                    {t.author}
                  </span>
                  {t.verified && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Verified Reviewer
                    </span>
                  )}
                </div>
              </div>

              {/* Product Mention Footer */}
              <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between">
                <Link
                  href={t.productHref}
                  className="flex items-center gap-3 group flex-1 mr-2"
                >
                  <div className="relative w-10 h-10 rounded-lg border border-neutral-200 overflow-hidden shrink-0 bg-white p-1">
                    <Image
                      src={t.productImage}
                      alt={t.productTitle}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <span className="text-xs font-bold text-neutral-800 group-hover:text-blue-600 transition-colors line-clamp-1">
                    {t.productTitle}
                  </span>
                </Link>

                <button
                  type="button"
                  aria-label="Add product to cart"
                  className="w-8 h-8 rounded-full border border-neutral-200 hover:border-blue-600 hover:bg-blue-50 text-neutral-600 hover:text-blue-600 flex items-center justify-center transition-colors shrink-0"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Pagination Dots */}
        <div className="flex items-center justify-center gap-2 mt-10">
          {[0, 1, 2, 3].map((dot) => (
            <button
              key={dot}
              type="button"
              onClick={() => setActiveDot(dot)}
              className={`h-2 rounded-full transition-all ${
                activeDot === dot
                  ? "w-7 bg-blue-600"
                  : "w-2 bg-neutral-300 hover:bg-neutral-400"
              }`}
              aria-label={`Go to slide ${dot + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
