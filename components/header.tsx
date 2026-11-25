"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, Phone, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

export const HEADER_NAV_ITEMS = [
  { label: "Home", href: "/landing" },
  { label: "Our Pg's", href: "/landing#our-pgs" },
  { label: "Types of Rooms", href: "/landing#types-of-rooms" },
  { label: "Life at Brindavan PG", href: "/landing#life-at-brindavan" },
] as const;

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-deep-forest border-b border-soft-mint/15 shadow-sm">
      <div className="mx-auto flex h-16 sm:h-18 max-w-7xl items-center justify-between gap-4 sm:gap-8 px-4 sm:px-6 lg:px-8">
        {/* Left: Circular Logo + Bright Yellow Brand Title */}
        <Link
          href="/landing"
          className="flex items-center gap-3 shrink-0 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-muted-gold rounded-lg"
        >
          <span className="relative h-10 w-10 sm:h-11 sm:w-11 rounded-full overflow-hidden border-2 border-muted-gold bg-soft-off-white shrink-0 transition-transform duration-200 group-hover:scale-105">
            <Image
              src="/brindavanpg_logo.png"
              alt="Brindavan PG's Logo"
              fill
              sizes="44px"
              className="object-cover"
              referrerPolicy="no-referrer"
              priority
            />
          </span>
          <span className="text-lg sm:text-xl font-bold tracking-tight text-muted-gold brightness-125 whitespace-nowrap shrink-0">
            Brindavan PG&apos;s
          </span>
        </Link>

        {/* Center: Desktop Navigation Menu */}
        <nav
          aria-label="Primary Navigation"
          className="hidden lg:flex items-center gap-6 xl:gap-7"
        >
          {HEADER_NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="relative py-1.5 text-sm font-medium text-soft-off-white/90 hover:text-muted-gold transition-colors duration-200 whitespace-nowrap shrink-0 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-muted-gold rounded"
            >
              {item.label}
              <span
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-muted-gold transition-transform duration-200 group-hover:scale-x-100"
              />
            </Link>
          ))}
        </nav>

        {/* Right: Contact us CTA + Mobile Menu Trigger */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <Link
            href="/landing#contact-us"
            className="hidden sm:inline-flex min-h-[40px] items-center gap-2 rounded-lg border border-muted-gold/45 bg-dark-teal/70 px-3.5 py-2 text-xs sm:text-sm font-medium text-soft-off-white hover:border-muted-gold hover:bg-teal-green/80 transition-colors duration-200 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-muted-gold"
          >
            <Phone
              className="h-4 w-4 text-muted-gold brightness-125 shrink-0"
              aria-hidden="true"
            />
            <span>Contact us</span>
          </Link>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation-drawer"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            className="inline-flex lg:hidden h-10 w-10 items-center justify-center rounded-lg border border-soft-mint/20 bg-dark-teal/60 text-soft-off-white hover:border-muted-gold hover:text-muted-gold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-muted-gold"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Responsive Mobile & Tablet Navigation Drawer */}
      <AnimatePresence initial={false}>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-navigation-drawer"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden border-t border-soft-mint/15 bg-deep-forest px-4 pb-5 pt-3 shadow-lg"
          >
            <nav
              aria-label="Mobile Navigation"
              className="flex flex-col space-y-1"
            >
              {HEADER_NAV_ITEMS.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex min-h-[44px] items-center rounded-lg px-3 py-2.5 text-sm font-medium text-soft-off-white/95 hover:bg-dark-teal/70 hover:text-muted-gold transition-colors duration-150"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="mt-3 border-t border-soft-mint/15 pt-3 sm:hidden">
              <Link
                href="/landing#contact-us"
                onClick={() => setMobileMenuOpen(false)}
                className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg border border-muted-gold/45 bg-dark-teal/70 px-4 py-2.5 text-sm font-medium text-soft-off-white hover:border-muted-gold hover:bg-teal-green/80 transition-colors"
              >
                <Phone
                  className="h-4 w-4 text-muted-gold brightness-125 shrink-0"
                  aria-hidden="true"
                />
                <span>Contact us</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
