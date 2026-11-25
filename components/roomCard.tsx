"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BedDouble } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { formatCurrencyINR, type PgRoomTypeView } from "@/lib/roomtypesStore";

interface RoomCardProps {
  item: PgRoomTypeView;
  index?: number;
  onBookNow?: (item: PgRoomTypeView) => void;
}

function RoomCardImage({ src, alt }: { src: string; alt: string }) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-light-sage text-teal-green">
        <BedDouble className="h-6 w-6" aria-hidden="true" />
      </div>
    );
  }

  if (src.startsWith("/")) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
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
      className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
    />
  );
}

export default function RoomCard({ item, index = 0, onBookNow }: RoomCardProps) {
  const shouldReduceMotion = useReducedMotion();
  const hasDiscount =
    typeof item.actual_price === "number" && item.actual_price > item.price;
  const roomHref = `/room?id=${encodeURIComponent(item._id)}`;

  return (
    <motion.article
      initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{
        duration: 0.5,
        delay: (index % 3) * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={shouldReduceMotion ? undefined : { y: -4 }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-deep-forest/10 bg-soft-off-white shadow-sm hover:shadow-md transition-shadow duration-200"
    >
      <Link
        href={roomHref}
        className="flex flex-1 flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-teal-green"
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-light-sage">
          <RoomCardImage
            src={item.coverImageUrl}
            alt={`${item.room_type.name} at ${item.pg.name}`}
          />
        </div>

        <div className="flex-1 px-5 pt-5">
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-medium text-slate-gray">
            <span className="text-teal-green font-semibold">
              {item.room_type.name}
            </span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">
              {item.room_type.beds_count} Bed Sharing
            </span>
            <span aria-hidden="true">·</span>
            <span>{item.room_type.ac ? "AC" : "Non-AC"}</span>
          </div>

          <h3 className="mt-2 text-lg font-bold text-deep-forest leading-snug group-hover:text-teal-green transition-colors">
            {item.pg.name}
          </h3>

          <p className="mt-2 text-sm text-slate-gray leading-relaxed line-clamp-2">
            {item.description}
          </p>
        </div>
      </Link>

      <div className="px-5 pb-5">
        <div className="mt-5 border-t border-deep-forest/10 pt-3.5 space-y-3.5">
          <div className="flex items-baseline justify-between gap-3">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-teal-green tabular-nums">
                {formatCurrencyINR(item.price)}
              </span>
              <span className="text-xs text-slate-gray">/ month</span>
              {hasDiscount && (
                <span className="text-xs text-slate-gray line-through tabular-nums">
                  {formatCurrencyINR(item.actual_price)}
                </span>
              )}
            </div>

            {typeof item.deposit === "number" && (
              <span className="text-xs font-medium text-slate-gray tabular-nums">
                Deposit {formatCurrencyINR(item.deposit)}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => onBookNow?.(item)}
            className="inline-flex min-h-[44px] w-full items-center justify-center rounded-xl bg-teal-green px-4 py-2.5 text-sm font-semibold text-soft-off-white hover:bg-dark-teal transition-colors duration-200 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-forest"
          >
            Book Now
          </button>
        </div>
      </div>
    </motion.article>
  );
}
