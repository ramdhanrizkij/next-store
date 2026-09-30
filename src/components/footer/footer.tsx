"use client";

import { MessageCircle, Send } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      role="img"
      aria-label="Twitter"
    >
      <title>Twitter</title>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      role="img"
      aria-label="YouTube"
    >
      <title>YouTube</title>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      role="img"
      aria-label="Facebook"
    >
      <title>Facebook</title>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

const helpLinks = [
  { label: "Account Info", href: "/account" },
  { label: "Your Orders", href: "/account/orders" },
  { label: "Returns & Replacements", href: "#" },
  { label: "Shipping Rates & Policies", href: "#" },
  { label: "Refund and Returns Policy", href: "#" },
  { label: "Privacy Policy", href: "#" },
  { label: "Terms and Conditions", href: "#" },
  { label: "Cookie Settings", href: "#" },
  { label: "Help Center", href: "#" },
];

const moneyLinks = [
  { label: "Sell on Unimart", href: "#" },
  { label: "Sell Your Services on Unimart", href: "#" },
  { label: "Sell on Unimart Business", href: "#" },
  { label: "Sell Your Apps on Unimart", href: "#" },
  { label: "Become an Affiliate", href: "#" },
  { label: "Advertise Your Products", href: "#" },
  { label: "Sell-Publish with Us", href: "#" },
  { label: "Become an Unimart Vendor", href: "#" },
  { label: "Unimart Affiliation Program", href: "#" },
];

const aboutLinks = [
  { label: "Careers for Unimart", href: "#" },
  { label: "About Unimart", href: "#" },
  { label: "Investor Relations", href: "#" },
  { label: "Unimart Devices", href: "#" },
  { label: "Customer Reviews", href: "#" },
  { label: "Social Responsibility", href: "#" },
  { label: "Store Locations", href: "#" },
  { label: "Unimart Near Me", href: "#" },
  { label: "Unimart Dealership", href: "#" },
];

export function Footer() {
  return (
    <footer className="w-full bg-[#f8f9fa] pt-16 sm:pt-20 pb-8 border-t border-neutral-200/80 text-neutral-600">
      <div className="max-w-[1290px] mx-auto px-4 sm:px-6 space-y-12">
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Column 1: Store Info & Contacts (Span 2 cols on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block relative h-9 w-36 mb-1">
              <Image
                src="/images/logo.png"
                alt="UNIMART"
                fill
                className="object-contain object-left"
              />
            </Link>

            <p className="text-xs sm:text-[13px] text-neutral-600 leading-relaxed max-w-sm">
              Worldwide electronics store since 1978. We sell over 1000+ branded
              products on our web-site.
            </p>

            <p className="text-xs text-neutral-500">
              Free from fixed and mobile phones.
            </p>

            {/* Phone */}
            <div className="pt-1">
              <span className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight block">
                0 800 300-353
              </span>
            </div>

            <div className="space-y-1 text-xs text-neutral-500 pt-1">
              <p>Call Center hours</p>
              <p className="font-bold text-neutral-800">Mon-Sun 09:00-19:00</p>
              <p className="pt-2">
                Email :{" "}
                <a
                  href="mailto:info@rbtshop.com"
                  className="font-bold text-neutral-900 hover:text-blue-600 transition-colors"
                >
                  info@rbtshop.com
                </a>
              </p>
            </div>
          </div>

          {/* Column 2: Let Us Help You */}
          <div>
            <h4 className="text-sm font-extrabold text-neutral-900 mb-4 tracking-tight">
              Let Us Help You
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-600 font-medium">
              {helpLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="hover:text-blue-600 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Make Money with Us */}
          <div>
            <h4 className="text-sm font-extrabold text-neutral-900 mb-4 tracking-tight">
              Make Money with Us
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-600 font-medium">
              {moneyLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="hover:text-blue-600 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Get to Know Us */}
          <div>
            <h4 className="text-sm font-extrabold text-neutral-900 mb-4 tracking-tight">
              Get to Know Us
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-600 font-medium">
              {aboutLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="hover:text-blue-600 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Promo Banner: Watch Offer */}
        <div className="bg-[#fdeee9] rounded-3xl p-6 sm:p-8 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs border border-[#fbdcd2]/50">
          {/* Watermark in background */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.04] overflow-hidden">
            <span className="text-7xl sm:text-9xl font-black text-neutral-900 tracking-widest uppercase">
              APPLE WATCH
            </span>
          </div>

          {/* Left Text */}
          <div className="relative z-10 max-w-lg space-y-1.5 text-center md:text-left">
            <h4 className="text-sm sm:text-base font-extrabold text-neutral-900 leading-snug">
              Since 2003, innovation, quality, functionality, and durability
              have been assured primarily.
            </h4>
            <p className="text-xs text-neutral-600 font-medium">
              Special savings. Exclusive savings for businesses, the military.
            </p>
          </div>

          {/* Middle Price & Action Button */}
          <div className="relative z-10 flex items-center gap-4 sm:gap-6 shrink-0">
            <div className="flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-black text-[#5850ec] tracking-tight">
                $899.00
              </span>
              <span className="text-xs sm:text-sm text-neutral-400 line-through font-medium">
                $1299.00
              </span>
            </div>

            <Button
              asChild
              variant="darkPill"
              size="pillSm"
              className="h-9 px-6 text-xs font-bold"
            >
              <Link href="/products?category=smartwatch">View Details</Link>
            </Button>
          </div>

          {/* Right Product Image */}
          <div className="relative z-10 w-44 h-24 sm:w-48 sm:h-28 shrink-0">
            <Image
              src="/images/watch-devices.png"
              alt="Apple Watch Series"
              fill
              className="object-contain"
            />
          </div>
        </div>

        {/* Social Links & App Download Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-4 border-t border-neutral-200">
          {/* Follow Us */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-neutral-800">
              Follow Us :
            </span>
            <div className="flex items-center gap-2">
              {[
                { name: "Twitter", icon: TwitterIcon, href: "#" },
                { name: "Youtube", icon: YoutubeIcon, href: "#" },
                { name: "Facebook", icon: FacebookIcon, href: "#" },
                { name: "WhatsApp", icon: MessageCircle, href: "#" },
                { name: "Telegram", icon: Send, href: "#" },
              ].map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    aria-label={`Follow on ${social.name}`}
                    className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center transition-transform hover:scale-110 shadow-xs"
                  >
                    <Icon className="w-3.5 h-3.5 fill-current" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Download App */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-neutral-800">
              Download App :
            </span>
            <div className="relative h-8 w-64">
              <Image
                src="/images/app-stores.png"
                alt="Download on App Store and Google Play"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>

        {/* Sub-footer Copyright & Payment Methods */}
        <div className="pt-6 border-t border-neutral-200 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500 font-medium">
          {/* Left Copyright */}
          <div>
            <p>Copyright 2024 @Unimart Nextjs Template.</p>
          </div>

          {/* Payment Methods */}
          <div className="relative h-6 w-80">
            <Image
              src="/images/payment-methods.png"
              alt="Supported Payment Methods: Visa, MasterCard, Amex, Discover, PayPal"
              fill
              className="object-contain"
            />
          </div>

          {/* Right Links */}
          <div className="flex items-center gap-5">
            <Link
              href="/refund-policy"
              className="hover:text-blue-600 transition-colors"
            >
              Refund policy
            </Link>
            <Link
              href="/privacy-policy"
              className="hover:text-blue-600 transition-colors"
            >
              Privacy policy
            </Link>
            <Link
              href="/terms"
              className="hover:text-blue-600 transition-colors"
            >
              Terms & conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
