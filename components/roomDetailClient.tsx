"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  BedDouble,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  MapPin,
  Phone,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import BookingFormModal from "./form";
import {
  formatPgGenderLabel,
  type PgPropertyView,
} from "@/lib/pgPropertyStore";
import {
  formatCurrencyINR,
  resolveRoomGalleryUrls,
  type PgRoomTypeView,
} from "@/lib/roomtypesStore";

interface RoomDetailClientProps {
  room: PgRoomTypeView;
  pgProperty?: PgPropertyView;
  pgProperties: PgPropertyView[];
  pgRoomTypes: PgRoomTypeView[];
}

function GalleryImage({
  src,
  alt,
  priority = false,
}: {
  src: string;
  alt: string;
  priority?: boolean;
}) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-light-sage text-teal-green">
        <BedDouble className="h-10 w-10" aria-hidden="true" />
      </div>
    );
  }

  if (src.startsWith("/")) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes="(max-width: 1024px) 100vw, 50vw"
        className="object-cover"
        referrerPolicy="no-referrer"
        onError={() => setHasError(true)}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className="h-full w-full object-cover"
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
    />
  );
}

export default function RoomDetailClient({
  room,
  pgProperty,
  pgProperties,
  pgRoomTypes,
}: RoomDetailClientProps) {
  const shouldReduceMotion = useReducedMotion();
  const galleryUrls = resolveRoomGalleryUrls(room);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const safeIndex =
    galleryUrls.length > 0 ? activeIndex % galleryUrls.length : 0;
  const activeImageUrl = galleryUrls[safeIndex] ?? room.coverImageUrl;

  const hasDiscount =
    typeof room.actual_price === "number" && room.actual_price > room.price;
  const phoneDisplay = pgProperty?.mobile || "7893194224";
  const phoneHref = `tel:${phoneDisplay.replace(/[^\d+]/g, "") || "+917893194224"}`;

  return (
    <>
      <section className="bg-soft-mint text-deep-forest py-10 sm:py-14 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Link
              href="/landing#types-of-rooms"
              className="inline-flex min-h-[40px] items-center gap-2 text-sm font-semibold text-teal-green hover:text-dark-teal transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-green rounded-lg"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              <span>Back to Rooms</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            {/* Left Side: Room & PG Details */}
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-6 flex flex-col items-start"
            >
              <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-medium text-slate-gray">
                <span className="font-semibold text-teal-green">
                  {room.room_type.name}
                </span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">
                  {room.room_type.beds_count} Bed Sharing
                </span>
                <span aria-hidden="true">·</span>
                <span>{room.room_type.ac ? "AC" : "Non-AC"}</span>
                {pgProperty?.gender && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span>{formatPgGenderLabel(pgProperty.gender)}</span>
                  </>
                )}
              </div>

              <h1
                className="mt-3 font-bold tracking-tight text-deep-forest leading-[1.15] text-balance"
                style={{ fontSize: "clamp(1.875rem, 3.2vw, 2.75rem)" }}
              >
                {room.pg.name}
              </h1>

              {pgProperty?.subheading && (
                <p className="mt-2 text-sm sm:text-base font-semibold text-teal-green">
                  {pgProperty.subheading}
                </p>
              )}

              {/* Pricing Summary */}
              <div className="mt-6 w-full rounded-2xl border border-deep-forest/15 bg-soft-off-white p-5">
                <div className="flex flex-wrap items-baseline justify-between gap-4">
                  <div>
                    <p className="text-xs font-medium text-slate-gray">
                      Monthly Rent
                    </p>
                    <div className="mt-1 flex items-baseline gap-2.5">
                      <span className="text-2xl sm:text-3xl font-bold text-teal-green tabular-nums">
                        {formatCurrencyINR(room.price)}
                      </span>
                      <span className="text-sm text-slate-gray">/ month</span>
                      {hasDiscount && (
                        <span className="text-sm text-slate-gray line-through tabular-nums">
                          {formatCurrencyINR(room.actual_price)}
                        </span>
                      )}
                    </div>
                  </div>

                  {typeof room.deposit === "number" && (
                    <div className="sm:text-right">
                      <p className="text-xs font-medium text-slate-gray">
                        Refundable Deposit
                      </p>
                      <p className="mt-1 text-lg font-bold text-deep-forest tabular-nums">
                        {formatCurrencyINR(room.deposit)}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="mt-6">
                <h2 className="text-sm font-semibold text-deep-forest">
                  Room Overview
                </h2>
                <p className="mt-2 text-sm sm:text-base leading-relaxed text-slate-gray">
                  {room.description}
                </p>
              </div>

              {/* PG Address & Contact */}
              {(pgProperty?.address || pgProperty?.mobile || pgProperty?.location_url) && (
                <div className="mt-6 w-full space-y-3 border-t border-deep-forest/15 pt-5 text-sm">
                  {pgProperty?.address && (
                    <div className="flex items-start gap-2.5">
                      <MapPin
                        className="mt-0.5 h-4 w-4 text-teal-green shrink-0"
                        aria-hidden="true"
                      />
                      <span className="text-slate-gray">
                        {pgProperty.address}
                      </span>
                    </div>
                  )}
                  {pgProperty?.mobile && (
                    <div className="flex items-center gap-2.5">
                      <Phone
                        className="h-4 w-4 text-teal-green shrink-0"
                        aria-hidden="true"
                      />
                      <span className="font-medium text-deep-forest tabular-nums">
                        {pgProperty.mobile}
                      </span>
                    </div>
                  )}
                  {pgProperty?.location_url && (
                    <div className="pt-1">
                      <a
                        href={pgProperty.location_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-[40px] items-center gap-2 rounded-lg border border-deep-forest/20 bg-soft-off-white px-4 py-2 text-xs sm:text-sm font-semibold text-deep-forest hover:border-teal-green hover:bg-teal-green hover:text-soft-off-white transition-colors"
                      >
                        <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
                        <span>Open in Google Maps</span>
                        <ExternalLink
                          className="h-3.5 w-3.5 shrink-0"
                          aria-hidden="true"
                        />
                      </a>
                    </div>
                  )}
                </div>
              )}

              {/* Primary CTA Buttons */}
              <div className="mt-8 flex flex-wrap items-center gap-3.5">
                <button
                  type="button"
                  onClick={() => setIsBookingOpen(true)}
                  className="inline-flex min-h-[46px] items-center justify-center rounded-xl bg-teal-green px-7 py-3 text-sm sm:text-base font-semibold text-soft-off-white shadow-sm hover:bg-dark-teal transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-forest"
                >
                  Book Now
                </button>
                <a
                  href={phoneHref}
                  className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-xl border border-deep-forest/25 bg-soft-off-white px-6 py-3 text-sm sm:text-base font-semibold text-deep-forest hover:bg-light-sage hover:border-teal-green transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-green"
                >
                  <Phone className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>Call Now</span>
                </a>
              </div>
            </motion.div>

            {/* Right Side: Room Cover Image + Additional Images Gallery from Sanity */}
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-6"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-deep-forest/15 bg-light-sage shadow-xl">
                <GalleryImage
                  key={activeImageUrl}
                  src={activeImageUrl}
                  alt={`${room.room_type.name} at ${room.pg.name} - photo ${safeIndex + 1}`}
                  priority
                />

                {galleryUrls.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        setActiveIndex((prev) =>
                          prev === 0 ? galleryUrls.length - 1 : prev - 1
                        )
                      }
                      aria-label="Previous room photo"
                      className="absolute left-3 top-1/2 -translate-y-1/2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-deep-forest/75 text-soft-off-white hover:bg-deep-forest transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-muted-gold"
                    >
                      <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setActiveIndex((prev) => (prev + 1) % galleryUrls.length)
                      }
                      aria-label="Next room photo"
                      className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-deep-forest/75 text-soft-off-white hover:bg-deep-forest transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-muted-gold"
                    >
                      <ChevronRight className="h-5 w-5" aria-hidden="true" />
                    </button>
                    <span className="absolute bottom-3 right-3 rounded-lg bg-deep-forest/80 px-2.5 py-1 text-xs font-semibold text-soft-off-white tabular-nums">
                      {String(safeIndex + 1).padStart(2, "0")} /{" "}
                      {String(galleryUrls.length).padStart(2, "0")}
                    </span>
                  </>
                )}
              </div>

              {/* Additional Images Thumbnails */}
              {galleryUrls.length > 1 && (
                <div className="mt-4 grid grid-cols-4 gap-3">
                  {galleryUrls.map((url, idx) => {
                    const isActive = idx === safeIndex;
                    return (
                      <button
                        key={`${url}-${idx}`}
                        type="button"
                        onClick={() => setActiveIndex(idx)}
                        aria-label={`View photo ${idx + 1}`}
                        aria-current={isActive ? "true" : undefined}
                        className={`relative aspect-[4/3] overflow-hidden rounded-xl border-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-green ${
                          isActive
                            ? "border-teal-green ring-2 ring-teal-green/25"
                            : "border-deep-forest/15 opacity-80 hover:opacity-100"
                        }`}
                      >
                        <GalleryImage
                          src={url}
                          alt={`${room.room_type.name} thumbnail ${idx + 1}`}
                        />
                      </button>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      <BookingFormModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        pgProperties={pgProperties}
        pgRoomTypes={pgRoomTypes}
        initialPgId={room.pg._id}
        initialRoomId={room._id}
      />
    </>
  );
}
