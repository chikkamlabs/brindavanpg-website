"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  ArrowRight,
  Building2,
  Check,
  ExternalLink,
  MapPin,
  Phone,
  Star,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import {
  FALLBACK_PG_PROPERTIES,
  formatPgGenderLabel,
  type PgPropertyView,
} from "@/lib/pgPropertyStore";

interface OurPgsProps {
  properties?: PgPropertyView[];
}

// Same S-curve control points as LifeAtBrindavanPgs (viewBox 1440 x 160)
const CURVE_P0 = { x: 0, y: 74 };
const CURVE_P1 = { x: 380, y: 152 };
const CURVE_P2 = { x: 1020, y: 4 };
const CURVE_P3 = { x: 1440, y: 68 };
const SVG_WIDTH = 1440;
const SVG_HEIGHT = 160;

function evaluateCurvePoint(
  t: number,
  viewportWidth: number,
  containerHeight: number
) {
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
  const scaleY = containerHeight / SVG_HEIGHT;
  const angleRad = Math.atan2(dySvg * scaleY, dxSvg * scaleX);
  const angleDeg = (angleRad * 180) / Math.PI;

  return {
    xPercent: (xSvg / SVG_WIDTH) * 100,
    yPx: ySvg * scaleY,
    angleDeg,
  };
}

function CurvedLocationsTrack({
  topProperties,
}: {
  topProperties: PgPropertyView[];
}) {
  const shouldReduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewportWidth, setViewportWidth] = useState(1280);
  const [containerHeight, setContainerHeight] = useState(160);
  const [phase, setPhase] = useState(0);

  const items = [
    ...topProperties.map((pg) => pg.name),
    "IT Corridors",
    "Easy Commutes",
    "Prime Tech Parks",
    "Verified Locations",
  ];

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateSize = () => {
      setViewportWidth(el.clientWidth || 1280);
      setContainerHeight(el.clientHeight || 160);
    };
    updateSize();

    const observer = new ResizeObserver(updateSize);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (shouldReduceMotion || items.length === 0) return;

    let frameId = 0;
    let lastTime = performance.now();
    const speed = 0.05;

    const tick = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      setPhase((prev) => (prev + dt * speed) % 1);
      frameId = window.requestAnimationFrame(tick);
    };

    frameId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frameId);
  }, [shouldReduceMotion, items.length]);

  const visibleSlots = viewportWidth < 640 ? 2 : viewportWidth < 1024 ? 3 : 4;
  const totalSlots = items.length;
  const labelOffset = containerHeight < 120 ? 18 : 28;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[104px] sm:h-[132px] md:h-[160px] bg-soft-mint overflow-hidden select-none"
      aria-label="Featured PG locations and corridors"
    >
      {/* PG Names + IT Corridors + Easy Commutes Gliding Along the Curved Path */}
      <div className="pointer-events-none absolute inset-0 z-10">
        {items.map((label, idx) => {
          const span = totalSlots / visibleSlots;
          const rawPos = ((idx / totalSlots + phase) % 1) * span;
          const t = rawPos - 0.18;

          if (t < -0.15 || t > 1.15) return null;

          const clampedT = Math.max(0, Math.min(1, t));
          const { xPercent, yPx, angleDeg } = evaluateCurvePoint(
            clampedT,
            viewportWidth,
            containerHeight
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
              key={`${label}-${idx}`}
              style={{
                left: `${adjustedX}%`,
                top: `${yPx - labelOffset}px`,
                opacity: edgeFade,
                transform: `translate(-50%, -50%) rotate(${angleDeg}deg)`,
              }}
              className="absolute flex items-center gap-2 whitespace-nowrap text-xs sm:text-sm font-semibold text-deep-forest"
            >
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-teal-green text-soft-off-white shrink-0">
                <Check className="h-3 w-3 stroke-[2.5]" aria-hidden="true" />
              </span>
              <span>{label}</span>
            </div>
          );
        })}
      </div>

      {/* Reference Curved Divider Transitioning Soft Mint -> Deep Forest */}
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

function PgMedia({ property }: { property: PgPropertyView }) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !property.coverImageUrl) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-dark-teal text-soft-off-white p-6 text-center">
        <Building2 className="h-9 w-9 text-muted-gold" aria-hidden="true" />
        <p className="text-xs font-medium text-soft-mint/85">{property.name}</p>
      </div>
    );
  }

  if (property.coverImageUrl.startsWith("/")) {
    return (
      <Image
        src={property.coverImageUrl}
        alt={property.name}
        fill
        sizes="(max-width: 1024px) 100vw, 45vw"
        className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        referrerPolicy="no-referrer"
        onError={() => setHasError(true)}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={property.coverImageUrl}
      alt={property.name}
      className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
    />
  );
}

export default function OurPgs({ properties }: OurPgsProps) {
  const shouldReduceMotion = useReducedMotion();
  const topProperties = (
    properties && properties.length > 0 ? properties : FALLBACK_PG_PROPERTIES
  ).slice(0, 2);

  return (
    <section
      id="our-pgs"
      className="bg-deep-forest text-soft-off-white pb-16 sm:pb-20 lg:pb-24"
    >
      {/* Curved Divider with Moving Top 2 PG Names, IT Corridors & Easy Commutes */}
      <CurvedLocationsTrack topProperties={topProperties} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {/* Section Header */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-10 sm:pb-12"
        >
          <div>
            <p className="text-sm sm:text-base font-semibold text-muted-gold brightness-125">
              We are located in multiple Locations.
            </p>
            <h2
              className="mt-2 font-bold tracking-tight text-soft-off-white text-balance"
              style={{ fontSize: "clamp(1.875rem, 3.2vw, 2.75rem)" }}
            >
              Our Pg&apos;s
            </h2>
          </div>

          <p className="max-w-md text-sm sm:text-base text-soft-mint/85 leading-relaxed">
            Explore our flagship residences thoughtfully positioned near key IT
            corridors, transit stops, and vibrant Bengaluru neighborhoods.
          </p>
        </motion.div>

        {/* Top 2 PG Properties — Open Editorial Rows (Not Cards) */}
        <div className="divide-y divide-soft-mint/15 border-y border-soft-mint/15">
          {topProperties.map((pg, index) => {
            const isReversed = index % 2 === 1;
            const orderLabel = String(index + 1).padStart(2, "0");

            return (
              <motion.article
                key={pg._id}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.55,
                  delay: index * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="group py-10 sm:py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
              >
                {/* Media Column */}
                <div
                  className={`lg:col-span-5 ${
                    isReversed ? "lg:order-2" : "lg:order-1"
                  }`}
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-soft-mint/15 bg-dark-teal">
                    <PgMedia property={pg} />
                  </div>
                </div>

                {/* Details Column (Unboxed Editorial Typography) */}
                <div
                  className={`lg:col-span-7 flex flex-col items-start ${
                    isReversed ? "lg:order-1" : "lg:order-2"
                  }`}
                >
                  <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-medium text-soft-mint/80">
                    <span className="font-semibold text-muted-gold brightness-125 tabular-nums">
                      {orderLabel}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{formatPgGenderLabel(pg.gender)}</span>
                    {typeof pg.rating === "number" && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="inline-flex items-center gap-1 text-soft-off-white font-semibold tabular-nums">
                          <Star
                            className="h-3.5 w-3.5 fill-muted-gold text-muted-gold"
                            aria-hidden="true"
                          />
                          {pg.rating.toFixed(1)}
                        </span>
                      </>
                    )}
                  </div>

                  <h3 className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight text-soft-off-white text-balance">
                    {pg.name}
                  </h3>

                  {pg.subheading && (
                    <p className="mt-1.5 text-sm sm:text-base font-semibold text-muted-gold brightness-125">
                      {pg.subheading}
                    </p>
                  )}

                  <p className="mt-4 text-sm sm:text-base leading-relaxed text-soft-mint/85 max-w-2xl">
                    {pg.descriptionText}
                  </p>

                  <div className="mt-6 flex flex-col sm:flex-row sm:flex-wrap gap-4 sm:gap-8 text-sm text-soft-off-white">
                    {pg.address && (
                      <div className="flex items-start gap-2 max-w-md">
                        <MapPin
                          className="mt-0.5 h-4 w-4 text-muted-gold shrink-0"
                          aria-hidden="true"
                        />
                        <span className="text-soft-mint/85">{pg.address}</span>
                      </div>
                    )}
                    {pg.mobile && (
                      <div className="flex items-center gap-2 shrink-0">
                        <Phone
                          className="h-4 w-4 text-muted-gold shrink-0"
                          aria-hidden="true"
                        />
                        <span className="font-medium tabular-nums">
                          {pg.mobile}
                        </span>
                      </div>
                    )}
                  </div>

                  {pg.location_url && (
                    <div className="mt-5">
                      <a
                        href={pg.location_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-[40px] items-center gap-2 rounded-lg border border-soft-mint/25 bg-dark-teal/80 px-4 py-2 text-xs sm:text-sm font-semibold text-soft-off-white hover:border-muted-gold hover:bg-teal-green transition-colors duration-200 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-muted-gold"
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
              </motion.article>
            );
          })}
        </div>

        {/* Action Button: See Our All Pg's (No action for now) */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex justify-start sm:justify-center"
        >
          <button
            type="button"
            className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-soft-mint/20 bg-teal-green px-6 py-3 text-sm sm:text-base font-semibold text-soft-off-white hover:bg-dark-teal transition-colors duration-200 whitespace-nowrap cursor-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-muted-gold"
          >
            <span>See Our All Pg&apos;s</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
