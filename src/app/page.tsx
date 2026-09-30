import { PopularBrands } from "@/components/brands/popular-brands";
import { PopularCategories } from "@/components/categories/popular-categories";
import { DealsSection } from "@/components/deals/deals-section";
import { Footer } from "@/components/footer/footer";
import { CategoryNav } from "@/components/header/category-nav";
import { MainNavbar } from "@/components/header/main-navbar";
import { TopBar } from "@/components/header/top-bar";
import { HeroSection } from "@/components/hero/hero-section";
import { NewsletterBanner } from "@/components/newsletter/newsletter-banner";
import { DualPromoBanners } from "@/components/promotions/dual-promo-banners";
import { CustomerReviews } from "@/components/testimonials/customer-reviews";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-neutral-900 selection:bg-blue-600 selection:text-white">
      {/* 1. Header Sections */}
      <header className="w-full shrink-0">
        <TopBar />
        <MainNavbar />
        <CategoryNav />
      </header>

      {/* 2. Main Page Content */}
      <main className="flex-1 w-full">
        {/* Hero Banner Section */}
        <HeroSection />

        {/* Popular Categories */}
        <PopularCategories />

        {/* Deals of The Day */}
        <DealsSection />

        {/* Dual Promotional Banners */}
        <DualPromoBanners />

        {/* Customer Testimonials & Reviews */}
        <CustomerReviews />

        {/* Popular By Brands */}
        <PopularBrands />

        {/* Newsletter Subscription */}
        <NewsletterBanner />
      </main>

      {/* 3. Comprehensive Footer */}
      <Footer />
    </div>
  );
}
