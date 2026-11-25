"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Check, Sparkles } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import {
  FALLBACK_AMENITIES,
  FALLBACK_UTILITIES,
  type LifeAtAmenityView,
  type LifeAtUtilityView,
} from "@/lib/lifeatStore";

interface LifeAtBrindavanPgsProps {
  utilities?: LifeAtUtilityView[];
  amenities?: LifeAtAmenityView[];
}

// Cubic Bezier control points matching the SVG S-curve (viewBox 1440 x 160)
const CURVE_P0 = { x: 0, y: 74 };
const CURVE_P1 = { x: 380, y: 152 };
const CURVE_P2 = { x: 1020, y: 4 };
const CURVE_P3 = { x: 1440, y: 68 };
const SVG_WIDTH = 1440;
const SVG_HEIGHT = 160;

function evaluateCurvePoint(t: number, viewportWidth: number) {
  const u = 1 - t;
  const xSvg =
    u * u * u * CURVE_P0.x +
    3 * u * u * t * CURVE_P1.x +
    3 * u * t * t * CURVE_P2.x +
    t * t * t * CURVE_P3.x;
  const ySvg =
    u * u * u * CURVE_P0.y +
    3 * u * u * t * CURVE_P1.y +
    3 * u * t * t * CURVE_P2.y +
    t * t * t * CURVE_P3.y;

  const dxSvg =
    3 * u * u * (CURVE_P1.x - CURVE_P0.x) +
    6 * u * t * (CURVE_P2.x - CURVE_P1.x) +
    3 * t * t * (CURVE_P3.x - CURVE_P2.x);
  const dySvg =
    3 * u * u * (CURVE_P1.y - CURVE_P0.y) +
    6 * u * t * (CURVE_P2.y - CURVE_P1.y) +
    3 * t * t * (CURVE_P3.y - CURVE_P2.y);

  const scaleX = viewportWidth / SVG_WIDTH;
  const angleRad = Math.atan2(dySvg, dxSvg * scaleX);
  const angleDeg = (angleRad * 180) / Math.PI;

  return {
    xPercent: (xSvg / SVG_WIDTH) * 100,
    yPx: ySvg,
    angleDeg,
  };
}

function CurvedUtilitiesTrack({
  utilities,
}: {
  utilities: LifeAtUtilityView[];
}) {
  const shouldReduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewportWidth, setViewportWidth] = useState(1280);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateSize = () => {
      setViewportWidth(el.clientWidth || 1280);
    };
    updateSize();

    const observer = new ResizeObserver(updateSize);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (shouldReduceMotion || utilities.length === 0) return;

    let frameId = 0;
    let lastTime = performance.now();
    const speed = 0.055; // Smooth gentle speed across the curve

    const tick = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      setPhase((prev) => (prev + dt * speed) % 1);
      frameId = window.requestAnimationFrame(tick);
    };

    frameId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frameId);
  }, [shouldReduceMotion, utilities.length]);

  const visibleSlots = viewportWidth < 640 ? 2 : viewportWidth < 1024 ? 3 : 4;
  const totalSlots = utilities.length;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[160px] overflow-hidden select-none"
      aria-label="Included PG utilities"
    >
      {/* Curved Utilities Gliding Strictly Along the Curved Path Above the Wave */}
      <div className="pointer-events-none absolute inset-0 z-10">
        {utilities.map((utility, idx) => {
          const span = totalSlots / visibleSlots;
          const rawPos = ((idx / totalSlots + phase) % 1) * span;
          const t = rawPos - 0.18;

          if (t < -0.15 || t > 1.15) return null;

          const clampedT = Math.max(0, Math.min(1, t));
          const { xPercent, yPx, angleDeg } = evaluateCurvePoint(
            clampedT,
            viewportWidth
          );
          const adjustedX =
            t < 0
              ? t * 100
              : t > 1
                ? 100 + (t - 1) * 100
                : xPercent;

          const edgeFade =
            t < 0.06
              ? Math.max(0, (t + 0.12) / 0.18)
              : t > 0.94
                ? Math.max(0, (1.12 - t) / 0.18)
                : 1;

          return (
            <div
              key={utility._id}
              style={{
                left: `${adjustedX}%`,
                top: `${yPx - 28}px`,
                opacity: edgeFade,
                transform: `translate(-50%, -50%) rotate(${angleDeg}deg)`,
              }}
              className="absolute flex items-center gap-2 whitespace-nowrap text-xs sm:text-sm font-semibold text-deep-forest"
            >
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-teal-green text-soft-off-white shrink-0">
                <Check className="h-3 w-3 stroke-[2.5]" aria-hidden="true" />
              </span>
              <span>{utility.title}</span>
            </div>
          );
        })}
      </div>

      {/* Reference Curved Divider Transitioning Light Sage -> Deep Forest */}
      <svg
        viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
        preserveAspectRatio="none"
        aria-hidden="true"
        className="absolute inset-0 h-full w-full block"
      >
        <path
          d={`M ${CURVE_P0.x},${CURVE_P0.y} C ${CURVE_P1.x},${CURVE_P1.y} ${CURVE_P2.x},${CURVE_P2.y} ${CURVE_P3.x},${CURVE_P3.y} L ${SVG_WIDTH},${SVG_HEIGHT} L 0,${SVG_HEIGHT} Z`}
          className="fill-deep-forest"
        />
      </svg>
    </div>
  );
}

function AmenityCoverImage({ amenity }: { amenity: LifeAtAmenityView }) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !amenity.coverImageUrl) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-dark-teal text-muted-gold">
        <Sparkles className="h-8 w-8" aria-hidden="true" />
      </div>
    );
  }

  if (amenity.coverImageUrl.startsWith("/")) {
    return (
      <Image
        src={amenity.coverImageUrl}
        alt={amenity.title}
        fill
        sizes="(max-width: 640px) 280px, 340px"
        className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
        referrerPolicy="no-referrer"
        onError={() => setHasError(true)}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={amenity.coverImageUrl}
      alt={amenity.title}
      className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
    />
  );
}

export default function LifeAtBrindavanPgs({
  utilities,
  amenities,
}: LifeAtBrindavanPgsProps) {
  const shouldReduceMotion = useReducedMotion();
  const activeUtilities =
    utilities && utilities.length > 0 ? utilities : FALLBACK_UTILITIES;
  const activeAmenities =
    amenities && amenities.length > 0 ? amenities : FALLBACK_AMENITIES;

  // Duplicate list once for seamless infinite left-to-right marquee stream
  const marqueeAmenities = [...activeAmenities, ...activeAmenities];

  return (
    <section
      id="life-at-brindavan"
      className="relative overflow-hidden bg-light-sage text-deep-forest border-t border-deep-forest/10"
    >
      {/* Top Part: Home-Full Life at Brindavan PG's Intro */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 lg:pt-24 pb-8 sm:pb-10">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mx-auto text-center"
        >
          <p className="text-sm sm:text-base font-semibold text-teal-green">
            A Warm Community, Not Just a Room
          </p>
          <h2
            className="mt-2 font-bold tracking-tight text-deep-forest text-balance"
            style={{ fontSize: "clamp(1.875rem, 3.4vw, 2.85rem)" }}
          >
            Life at Brindavan PG&apos;s
          </h2>
          <p className="mt-4 text-base sm:text-lg leading-relaxed text-slate-gray">
            From sunlit morning coffees on breezy balconies to shared festival
            dinners and quiet focus hours, life at Brindavan feels genuinely
            like home. Every corner is thoughtfully cared for so you can focus
            on your career, studies, and friendships with complete peace of mind.
          </p>
        </motion.div>
      </div>

      {/* Curved Wave Transition + Auto-Moving Utilities Just Above the Curve */}
      <CurvedUtilitiesTrack utilities={activeUtilities} />

      {/* Bottom Part (Deep Forest Canvas): Rich Amenities Moving Left-to-Right */}
      <div className="bg-deep-forest text-soft-off-white pt-10 sm:pt-14 pb-16 sm:pb-20 lg:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl"
          >
            <h3
              className="font-bold tracking-tight text-soft-off-white text-balance leading-snug"
              style={{ fontSize: "clamp(1.5rem, 2.8vw, 2.35rem)" }}
            >
              Our Brindavan PG&apos;s Amenities are Very Rich and Much Needed to
              Our{" "}
              <span className="text-muted-gold brightness-125">
                Working Professionals and Students.
              </span>
            </h3>
          </motion.div>
        </div>

        {/* Smooth Left-to-Right Infinite Amenity Cover Showcase (Details in Cover Image Only) */}
        <div className="mt-10 sm:mt-12 relative w-full overflow-hidden">
          <motion.div
            animate={
              shouldReduceMotion ? undefined : { x: ["-50%", "0%"] }
            }
            transition={{
              duration: 36,
              repeat: Infinity,
              ease: "linear",
            }}
            className="flex w-max gap-5 sm:gap-6 px-4 sm:px-6"
          >
            {marqueeAmenities.map((amenity, idx) => (
              <div
                key={`${amenity._id}-${idx}`}
                className="group relative w-[270px] sm:w-[320px] lg:w-[350px] aspect-[4/3] shrink-0 overflow-hidden rounded-2xl border border-soft-mint/15 bg-dark-teal shadow-lg"
              >
                <AmenityCoverImage amenity={amenity} />

                {/* Scrim + Amenity Details Overlaid Inside Cover Image Only */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-deep-forest/95 via-deep-forest/40 to-transparent"
                />
                <div className="absolute inset-x-0 bottom-0 z-10 p-4 sm:p-5">
                  <h4 className="text-base sm:text-lg font-bold text-soft-off-white leading-snug">
                    {amenity.title}
                  </h4>
                  {amenity.subheading && (
                    <p className="mt-1 text-xs sm:text-sm text-soft-mint/85 leading-snug line-clamp-2">
                      {amenity.subheading}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
