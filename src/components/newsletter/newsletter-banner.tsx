"use client";

import { CheckCircle, Mail } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function NewsletterBanner() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 4000);
      setEmail("");
    }
  };

  return (
    <section className="w-full bg-[#215ada] text-white py-10 sm:py-12">
      <div className="max-w-[1290px] mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
        {/* Left Text */}
        <div className="text-center md:text-left space-y-1">
          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Subscribe our newsletter
          </h3>
          <p className="text-blue-100 text-sm font-medium">
            Subscribe and get discount 20% Off
          </p>
        </div>

        {/* Right Form */}
        <form
          onSubmit={handleSubmit}
          className="w-full md:w-auto flex-1 max-w-md relative"
        >
          <div className="bg-white rounded-full p-1.5 flex items-center shadow-lg">
            <div className="pl-4 pr-2 text-neutral-400">
              <Mail className="w-4 h-4" />
            </div>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="flex-1 text-xs sm:text-sm text-neutral-800 placeholder-neutral-400 bg-transparent focus:outline-none"
            />
            <Button
              type="submit"
              variant="primaryPill"
              size="pillSm"
              className="shrink-0 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm px-7 h-10 shadow-sm"
            >
              Subscribe
            </Button>
          </div>

          {submitted && (
            <div className="absolute top-full left-4 mt-2 flex items-center gap-1.5 text-xs text-emerald-200 bg-emerald-900/90 px-3 py-1.5 rounded-lg animate-in fade-in shadow-md">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>
                Thank you for subscribing! Check your inbox for the discount
                code.
              </span>
            </div>
          )}
        </form>
      </div>
    </section>
  );
}
