import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";

const FOOTER_NAV_ITEMS = [
  { label: "Home", href: "/landing" },
  { label: "Our Pg's", href: "#our-pgs" },
  { label: "Types of Rooms", href: "#types-of-rooms" },
  { label: "Life at Brindavan PG", href: "#life-at-brindavan" },
  { label: "Contact us", href: "#contact-us" },
  { label: "Nearest Pg", href: "#nearest-pg" },
] as const;

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-deep-forest text-soft-off-white border-t border-soft-mint/15">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Brand Summary */}
          <div className="md:col-span-5">
            <Link
              href="/landing"
              className="inline-flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-muted-gold rounded-lg"
            >
              <span className="relative h-10 w-10 rounded-full overflow-hidden border-2 border-muted-gold bg-soft-off-white shrink-0">
                <Image
                  src="/brindavanpg_logo.png"
                  alt="Brindavan PG's Logo"
                  fill
                  sizes="40px"
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              </span>
              <span className="text-lg font-bold tracking-tight text-muted-gold brightness-125 whitespace-nowrap">
                Brindavan PG&apos;s
              </span>
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-relaxed text-soft-mint/80">
              Thoughtfully managed paying guest residences offering a warm,
              home-like feeling, wholesome daily meals, peaceful atmosphere, and
              spotless cleanliness.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-4">
            <h2 className="text-sm font-semibold text-muted-gold">
              Navigation
            </h2>
            <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-2.5">
              {FOOTER_NAV_ITEMS.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="inline-flex min-h-[36px] items-center text-sm text-soft-off-white/85 hover:text-muted-gold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-muted-gold rounded"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Location & Support */}
          <div className="md:col-span-3">
            <h2 className="text-sm font-semibold text-muted-gold">
              Locations &amp; Care
            </h2>
            <div className="mt-4 space-y-3 text-sm text-soft-mint/80">
              <div className="flex items-start gap-2.5">
                <MapPin
                  className="mt-0.5 h-4 w-4 text-muted-gold shrink-0"
                  aria-hidden="true"
                />
                <span>
                  Find the nearest Brindavan PG close to your workplace or
                  campus.
                </span>
              </div>
              <p className="text-xs leading-relaxed text-soft-mint/70">
                Dedicated support for room tours, occupancy inquiries, and
                resident assistance.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Legal Row */}
        <div className="mt-10 border-t border-soft-mint/15 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-soft-mint/70">
          <p>&copy; {currentYear} Brindavan PG&apos;s. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link
              href="#our-pgs"
              className="hover:text-muted-gold transition-colors duration-200"
            >
              Our Pg&apos;s
            </Link>
            <Link
              href="#types-of-rooms"
              className="hover:text-muted-gold transition-colors duration-200"
            >
              Types of Rooms
            </Link>
            <Link
              href="#contact-us"
              className="hover:text-muted-gold transition-colors duration-200"
            >
              Contact us
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
