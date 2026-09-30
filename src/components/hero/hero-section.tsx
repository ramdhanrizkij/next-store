"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="w-full pt-6 pb-12">
      <div className="max-w-[1290px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Large Hero Card */}
          <div className="lg:col-span-8 bg-[#fff6e4] rounded-3xl relative overflow-hidden flex flex-col justify-between min-h-[480px] sm:min-h-[520px] p-8 sm:p-12 lg:p-14 shadow-xs">
            {/* Watermark in background */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.05] overflow-hidden">
              <span className="text-8xl sm:text-[140px] font-black tracking-widest text-neutral-900 uppercase">
                HEADPHONES
              </span>
            </div>

            {/* Left Content */}
            <div className="relative z-10 max-w-xs sm:max-w-md space-y-3 sm:space-y-4">
              <span className="text-xs sm:text-sm font-bold text-rose-600 tracking-widest uppercase block">
                Exclusive Offer Going
              </span>

              <h1 className="text-3xl sm:text-5xl lg:text-[50px] font-black text-neutral-900 tracking-tight leading-[1.08]">
                GoPro Hero 10
              </h1>

              {/* Price row */}
              <div className="flex items-center gap-3 pt-1">
                <span className="text-sm sm:text-base text-neutral-400 line-through font-medium">
                  $1,700.85
                </span>
                <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-blue-600 tracking-tight">
                  $139.47
                </span>
                <Badge variant="discount">-91.8%</Badge>
              </div>

              {/* Action Button */}
              <div className="pt-4">
                <Button
                  asChild
                  variant="primaryPill"
                  size="pill"
                  className="h-11 px-8 text-sm font-bold shadow-md shadow-blue-600/20"
                >
                  <Link href="/products">Shop Now</Link>
                </Button>
              </div>
            </div>

            {/* Models Image */}
            <div className="absolute right-0 bottom-0 h-full w-[54%] sm:w-[50%] pointer-events-none">
              <Image
                src="/images/hero-people.png"
                alt="GoPro Hero 10 and Headphones lifestyle"
                fill
                className="object-contain object-right-bottom"
                priority
              />
            </div>

            {/* Bottom Left Logo Watermark */}
            <div className="relative z-10 pt-8 flex items-center gap-1.5 opacity-80">
              <div className="relative h-6 w-24">
                <Image
                  src="/images/logo.png"
                  alt="UNIMART"
                  fill
                  className="object-contain object-left"
                />
              </div>
            </div>
          </div>

          {/* Right Hero Card */}
          <div className="lg:col-span-4 bg-[#f7f1e5] rounded-3xl relative overflow-hidden flex flex-col justify-between min-h-[480px] sm:min-h-[520px] p-8 sm:p-10 shadow-xs">
            {/* Top Text */}
            <div className="relative z-10 space-y-2">
              <Badge variant="goldPill">NEW</Badge>

              <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight leading-tight pt-1">
                Gamepad For <br />
                Playing
              </h2>

              <p className="text-sm font-semibold text-neutral-600">
                Computer Games
              </p>
            </div>

            {/* Gamepad Image */}
            <div className="relative w-full h-64 my-auto">
              <Image
                src="/images/hero-gamepad.png"
                alt="Gamepad For Playing Computer Games"
                fill
                className="object-contain object-center scale-105 transition-transform duration-500 hover:scale-110"
              />
            </div>

            {/* Bottom Button */}
            <div className="relative z-10">
              <Button
                asChild
                variant="primaryPill"
                size="pill"
                className="h-11 px-7 text-sm font-bold shadow-md shadow-blue-600/20"
              >
                <Link href="/products?category=gaming">Shop Collection</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
