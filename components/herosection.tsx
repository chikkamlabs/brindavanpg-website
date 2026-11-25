"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Home } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import BookingFormModal from "./form";
import {
  FALLBACK_HOMESCREEN_ITEMS,
  type HomeScreenSlide,
} from "@/lib/homescreen";
import type { PgPropertyView } from "@/lib/pgPropertyStore";
import type { PgRoomTypeView } from "@/lib/roomtypesStore";

const HOME_LIKE_QUALITIES = [
  "Feeling",
  "Food",
  "Atmosphere",
  "Cleanliness",
] as const;

interface HeroSectionProps {
  slides?: HomeScreenSlide[];
  pgProperties?: PgPropertyView[];
  pgRoomTypes?: PgRoomTypeView[];
}

function SlideImage({
  slide,
  priority = false,
}: {
  slide: HomeScreenSlide;
  priority?: boolean;
}) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !slide.imageUrl) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-light-sage text-deep-forest p-4 text-center">
        <Home className="h-8 w-8 text-teal-green" aria-hidden="true" />
        <p className="text-xs font-medium text-slate-gray max-w-[20ch]">
          {slide.tag_line}
        </p>
      </div>
    );
  }

  const isLocalAsset = slide.imageUrl.startsWith("/");

  if (isLocalAsset) {
    return (
      <Image
        src={slide.imageUrl}
        alt={slide.tag_line || "Brindavan PG's living space"}
        fill
        priority={priority}
        sizes="(max-width: 1024px) 90vw, 45vw"
        className="object-cover"
        referrerPolicy="no-referrer"
        onError={() => setHasError(true)}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={slide.imageUrl}
      alt={slide.tag_line || "Brindavan PG's living space"}
      className="h-full w-full object-cover"
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
    />
  );
}

export default function HeroSection({
  slides,
  pgProperties,
  pgRoomTypes,
}: HeroSectionProps) {
  const activeSlides =
    slides && slides.length > 0 ? slides : FALLBACK_HOMESCREEN_ITEMS;
  const shouldReduceMotion = useReducedMotion();

  const [qualityIndex, setQualityIndex] = useState(0);
  const [slideIndex, setSlideIndex] = useState(0);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  useEffect(() => {
    const qualityTimer = window.setInterval(() => {
      setQualityIndex((prev) => (prev + 1) % HOME_LIKE_QUALITIES.length);
    }, 2400);

    return () => window.clearInterval(qualityTimer);
  }, []);

  useEffect(() => {
    if (activeSlides.length <= 1) return;

    const slideTimer = window.setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % activeSlides.length);
    }, 4500);

    return () => window.clearInterval(slideTimer);
  }, [activeSlides.length]);

  const primarySlide = activeSlides[slideIndex % activeSlides.length];
  const secondarySlide =
    activeSlides[(slideIndex + 1) % activeSlides.length] ?? primarySlide;

  const currentQuality = HOME_LIKE_QUALITIES[qualityIndex];

  return (
    <>
      <section
        id="home"
        className="relative overflow-hidden bg-soft-mint text-deep-forest py-12 sm:py-16 lg:py-24"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-8 lg:gap-x-10 lg:gap-y-7 items-center">
            {/* Top-Left (Desktop) / First (Mobile): Animated Home-like Quality + Heading + Desktop Description */}
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-6 lg:col-start-1 lg:row-start-1 lg:self-end flex flex-col items-start"
            >
              {/* Home like [Feeling | Food | Atmosphere | Cleanliness] */}
              <div className="flex flex-wrap items-baseline gap-2.5 text-xl sm:text-2xl font-semibold tracking-tight">
                <span className="text-teal-green">Home like</span>
                <span className="relative inline-flex min-w-[8.5rem] h-9 items-baseline overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={currentQuality}
                      initial={
                        shouldReduceMotion
                          ? { opacity: 1 }
                          : { opacity: 0, y: 12 }
                      }
                      animate={{ opacity: 1, y: 0 }}
                      exit={
                        shouldReduceMotion
                          ? { opacity: 0 }
                          : { opacity: 0, y: -12 }
                      }
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="inline-block font-bold text-deep-forest border-b-2 border-muted-gold pb-0.5"
                    >
                      {currentQuality}
                    </motion.span>
                  </AnimatePresence>
                </span>
              </div>

              {/* Heading */}
              <h1
                className="mt-4 font-bold tracking-tight text-deep-forest leading-[1.12] text-balance"
                style={{ fontSize: "clamp(2.25rem, 4vw, 3.5rem)" }}
              >
                Brindavan PG&apos;s
                <span className="mt-1.5 block text-teal-green text-[0.68em] font-semibold leading-snug">
                  Thoughtful Stays Built Around Everyday Comfort
                </span>
              </h1>

              {/* Description (Hidden on Mobile Screen View) */}
              <p className="hidden md:block mt-5 max-w-xl text-base sm:text-lg leading-relaxed text-slate-gray">
                Step into welcoming, well-maintained paying guest residences
                crafted for students and working professionals. Enjoy nutritious
                homestyle meals, serene rooms, dependable housekeeping, and a
                warm community you can rely on.
              </p>
            </motion.div>

            {/* Right (Desktop) / Second (Mobile, Above CTA Buttons): Two Overlapping Image Blocks */}
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.6,
                delay: 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="lg:col-span-6 lg:col-start-7 lg:row-start-1 lg:row-span-2 lg:self-center"
            >
              <div className="relative mx-auto w-full max-w-xl lg:max-w-none pb-12 sm:pb-16 pr-2 sm:pr-4">
                {/* Block 1: Primary Showcase Frame */}
                <div className="relative w-[88%] sm:w-[85%] aspect-[4/3] rounded-2xl overflow-hidden bg-deep-forest border border-deep-forest/15 shadow-xl">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={primarySlide._id}
                      initial={
                        shouldReduceMotion
                          ? { opacity: 1 }
                          : { opacity: 0, scale: 1.04 }
                      }
                      animate={{ opacity: 1, scale: 1 }}
                      exit={
                        shouldReduceMotion
                          ? { opacity: 0 }
                          : { opacity: 0, scale: 0.98 }
                      }
                      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute inset-0"
                    >
                      <SlideImage slide={primarySlide} priority />
                      <div
                        aria-hidden="true"
                        className="absolute inset-0 bg-gradient-to-t from-deep-forest/85 via-deep-forest/20 to-transparent"
                      />
                    </motion.div>
                  </AnimatePresence>

                  {/* Primary Block Caption (Bottom-Left away from Q4 overlap) */}
                  <div className="absolute inset-x-0 bottom-0 z-10 p-4 sm:p-6 pr-16 sm:pr-24">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={`caption-${primarySlide._id}`}
                        initial={
                          shouldReduceMotion
                            ? { opacity: 1 }
                            : { opacity: 0, y: 8 }
                        }
                        animate={{ opacity: 1, y: 0 }}
                        exit={
                          shouldReduceMotion
                            ? { opacity: 0 }
                            : { opacity: 0, y: -8 }
                        }
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <span className="block text-xs font-semibold text-muted-gold tabular-nums">
                          {String(slideIndex + 1).padStart(2, "0")} /{" "}
                          {String(activeSlides.length).padStart(2, "0")}
                        </span>
                        <p className="mt-1 text-xs sm:text-sm md:text-base font-medium text-soft-off-white leading-snug line-clamp-2">
                          {primarySlide.tag_line}
                        </p>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>

                {/* Block 2: Overlapping First Block's Q4 (Bottom-Right) Area */}
                <motion.button
                  type="button"
                  onClick={() =>
                    setSlideIndex((prev) => (prev + 1) % activeSlides.length)
                  }
                  aria-label={`View next highlight: ${secondarySlide.tag_line}`}
                  whileHover={shouldReduceMotion ? undefined : { y: -4 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="group absolute right-0 bottom-0 z-20 w-[52%] sm:w-[48%] aspect-[4/3] rounded-2xl overflow-hidden bg-soft-off-white border-4 border-soft-mint shadow-2xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-green"
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`secondary-${secondarySlide._id}`}
                      initial={
                        shouldReduceMotion
                          ? { opacity: 1 }
                          : { opacity: 0, x: 14 }
                      }
                      animate={{ opacity: 1, x: 0 }}
                      exit={
                        shouldReduceMotion
                          ? { opacity: 0 }
                          : { opacity: 0, x: -14 }
                      }
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute inset-0"
                    >
                      <SlideImage slide={secondarySlide} />
                      <div
                        aria-hidden="true"
                        className="absolute inset-0 bg-gradient-to-t from-deep-forest/85 via-deep-forest/20 to-transparent"
                      />
                    </motion.div>
                  </AnimatePresence>

                  <div className="absolute inset-x-0 bottom-0 z-10 p-3 sm:p-4">
                    <span className="block text-[11px] font-semibold text-muted-gold">
                      Next Preview
                    </span>
                    <p className="mt-0.5 text-xs font-medium text-soft-off-white leading-snug line-clamp-1">
                      {secondarySlide.tag_line}
                    </p>
                  </div>
                </motion.button>

                {/* Minimal Slide Progress Controls */}
                <div
                  aria-label="Gallery slide navigation"
                  className="mt-4 flex items-center gap-2 max-w-[44%]"
                >
                  {activeSlides.map((slide, idx) => {
                    const isActive = idx === slideIndex;
                    return (
                      <button
                        key={slide._id}
                        type="button"
                        onClick={() => setSlideIndex(idx)}
                        aria-label={`Show slide ${idx + 1}: ${slide.tag_line}`}
                        aria-current={isActive ? "true" : undefined}
                        className="group py-2 flex-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-green rounded"
                      >
                        <span
                          className={`block h-1 w-full rounded-full transition-colors duration-300 ${
                            isActive
                              ? "bg-teal-green"
                              : "bg-deep-forest/20 group-hover:bg-deep-forest/40"
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>

            {/* Bottom-Left (Desktop) / Third (Mobile): CTA Buttons + Nearest Hint */}
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-6 lg:col-start-1 lg:row-start-2 lg:self-start flex flex-col items-start"
            >
              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 sm:gap-4">
                <Link
                  href="#our-pgs"
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-teal-green px-6 py-3 text-sm sm:text-base font-semibold text-soft-off-white shadow-sm hover:bg-dark-teal transition-colors duration-200 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-forest"
                >
                  <span>View Our PG&apos;s</span>
                </Link>

                <button
                  type="button"
                  onClick={() => setIsBookingOpen(true)}
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-deep-forest/25 bg-soft-off-white px-6 py-3 text-sm sm:text-base font-semibold text-deep-forest hover:bg-light-sage hover:border-teal-green transition-colors duration-200 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-green"
                >
                  <span>Enquire Now</span>
                </button>
              </div>

              {/* Next line small text + blinking animated arrow */}
              <div className="mt-5 flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-gray">
                <span>Find Nearest one to your selected Location.</span>
                <motion.span
                  aria-hidden="true"
                  animate={
                    shouldReduceMotion
                      ? undefined
                      : {
                          opacity: [1, 0.2, 1],
                          x: [0, 5, 0],
                        }
                  }
                  transition={{
                    duration: 1.4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="inline-flex items-center text-teal-green shrink-0"
                >
                  <ArrowRight className="h-4 w-4" />
                </motion.span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <BookingFormModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        pgProperties={pgProperties}
        pgRoomTypes={pgRoomTypes}
      />
    </>
  );
}
