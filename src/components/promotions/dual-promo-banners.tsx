"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function DualPromoBanners() {
  return (
    <section className="w-full py-10 sm:py-14">
      <div className="max-w-[1290px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Promo Card 1: Phone Holders Deals */}
          <div className="bg-[#e8edf3] rounded-3xl p-8 sm:p-10 relative overflow-hidden flex flex-col justify-between min-h-[300px] sm:min-h-[320px] shadow-xs">
            {/* Green Circular Badge: 500M Range */}
            <div className="absolute right-[36%] top-6 sm:top-8 bg-[#96c83e] text-neutral-900 w-16 h-16 rounded-full flex flex-col items-center justify-center font-bold text-xs shadow-md z-10 text-center leading-tight">
              <span className="text-sm font-black">500M</span>
              <span className="text-[10px] font-semibold opacity-90">
                Range
              </span>
            </div>

            {/* Left Content */}
            <div className="relative z-10 max-w-xs space-y-2">
              <span className="text-xs font-black text-neutral-800 tracking-widest uppercase block">
                Hurry Sale 50%
              </span>

              <h3 className="text-2xl sm:text-3xl font-black text-neutral-900 leading-tight tracking-tight">
                Phone Holders Deals
              </h3>

              <p className="text-xs text-neutral-500 font-medium">
                sitar nostrum conctetur Volupq .
              </p>

              <div className="pt-4">
                <Button
                  asChild
                  variant="primaryPill"
                  size="pill"
                  className="h-10 px-7 text-xs sm:text-sm font-bold shadow-md shadow-blue-600/20"
                >
                  <Link href="/products?category=phone-holders">Shop Now</Link>
                </Button>
              </div>
            </div>

            {/* Product Image: Smart camera */}
            <div className="absolute right-0 bottom-0 w-[54%] h-full pointer-events-none">
              <Image
                src="/images/promo-camera.png"
                alt="Phone Holders Deals"
                fill
                className="object-contain object-right-bottom"
              />
            </div>
          </div>

          {/* Promo Card 2: Seal The Matching */}
          <div className="bg-[#dadce1] rounded-3xl p-8 sm:p-10 relative overflow-hidden flex flex-col justify-between min-h-[300px] sm:min-h-[320px] shadow-xs">
            {/* Left Content */}
            <div className="relative z-10 max-w-xs space-y-2">
              <span className="text-xs font-black text-neutral-800 tracking-widest uppercase block">
                Sale Upto 70%
              </span>

              <h3 className="text-2xl sm:text-3xl font-black text-neutral-900 leading-tight tracking-tight">
                Seal The Matching
              </h3>

              <p className="text-xs text-neutral-500 font-medium">
                sitar nostrum conctetur Volupq .
              </p>

              <div className="pt-4">
                <Button
                  asChild
                  variant="primaryPill"
                  size="pill"
                  className="h-10 px-7 text-xs sm:text-sm font-bold shadow-md shadow-blue-600/20"
                >
                  <Link href="/products?category=chargers">Shop Now</Link>
                </Button>
              </div>
            </div>

            {/* Product Image: Wireless charging pad and earbuds */}
            <div className="absolute right-0 bottom-0 w-[56%] h-full pointer-events-none">
              <Image
                src="/images/promo-charger.png"
                alt="Seal The Matching Wireless Charger"
                fill
                className="object-contain object-right-bottom"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
