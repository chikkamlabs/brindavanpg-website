"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  ArrowRight,
  BedDouble,
  Check,
  ChevronDown,
  MapPin,
  Search,
  X,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import RoomCard from "./roomCard";
import BookingFormModal from "./form";
import type { PgPropertyView } from "@/lib/pgPropertyStore";
import {
  FALLBACK_LOCATION_FILTERS,
  FALLBACK_PG_ROOM_TYPES,
  FALLBACK_ROOM_TYPES,
  type LocationFilterOption,
  type PgRoomTypeView,
  type RoomTypeView,
} from "@/lib/roomtypesStore";

interface RoomTypesProps {
  roomTypes?: RoomTypeView[];
  pgRoomTypes?: PgRoomTypeView[];
  pgProperties?: PgPropertyView[];
  locations?: LocationFilterOption[];
}

function RoomTypeThumbnail({ src, alt }: { src: string; alt: string }) {
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
        sizes="96px"
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

export default function RoomTypes({
  roomTypes,
  pgRoomTypes,
  pgProperties,
  locations,
}: RoomTypesProps) {
  const shouldReduceMotion = useReducedMotion();
  const [bookingSelection, setBookingSelection] = useState<{
    pgId: string;
    roomId: string;
  } | null>(null);
  const [selectedBedsCount, setSelectedBedsCount] = useState<number | null>(
    null
  );
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(
    null
  );
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [locationSearchQuery, setLocationSearchQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const locationMenuRef = useRef<HTMLDivElement>(null);
  const locationSearchInputRef = useRef<HTMLInputElement>(null);

  const sharingBlocks =
    roomTypes && roomTypes.length > 0 ? roomTypes : FALLBACK_ROOM_TYPES;
  const roomListings = useMemo(
    () =>
      pgRoomTypes && pgRoomTypes.length > 0
        ? pgRoomTypes
        : FALLBACK_PG_ROOM_TYPES,
    [pgRoomTypes]
  );
  const availableLocations = useMemo(
    () =>
      locations && locations.length > 0 ? locations : FALLBACK_LOCATION_FILTERS,
    [locations]
  );

  const selectedLocation = useMemo(
    () =>
      availableLocations.find((loc) => loc._id === selectedLocationId) ?? null,
    [availableLocations, selectedLocationId]
  );

  const filteredLocations = useMemo(() => {
    const q = locationSearchQuery.trim().toLowerCase();
    if (!q) return availableLocations;
    return availableLocations.filter(
      (loc) =>
        loc.name.toLowerCase().includes(q) ||
        (loc.address && loc.address.toLowerCase().includes(q))
    );
  }, [availableLocations, locationSearchQuery]);

  useEffect(() => {
    if (!isLocationOpen) return;

    const timer = window.setTimeout(() => {
      locationSearchInputRef.current?.focus();
    }, 30);

    const handleClickOutside = (event: MouseEvent) => {
      if (
        locationMenuRef.current &&
        !locationMenuRef.current.contains(event.target as Node)
      ) {
        setIsLocationOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsLocationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isLocationOpen]);

  const filteredRoomListings = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return roomListings.filter((item) => {
      if (
        selectedBedsCount !== null &&
        item.room_type.beds_count !== selectedBedsCount
      ) {
        return false;
      }

      if (selectedLocation) {
        if (selectedLocation.pgIds.length > 0) {
          if (!selectedLocation.pgIds.includes(item.pg._id)) {
            return false;
          }
        } else {
          const matchedPg = pgProperties?.find((pg) => pg._id === item.pg._id);
          const searchNeedle = selectedLocation.name.toLowerCase();
          const pgNameMatches = item.pg.name
            .toLowerCase()
            .includes(searchNeedle);
          const pgAddressMatches = matchedPg?.address
            ?.toLowerCase()
            .includes(searchNeedle);

          if (!pgNameMatches && !pgAddressMatches) {
            return false;
          }
        }
      }

      if (q) {
        const acLabel = item.room_type.ac ? "ac" : "non-ac";
        const searchable = [
          item.pg.name,
          item.room_type.name,
          `${item.room_type.beds_count} bed sharing`,
          acLabel,
          item.description,
        ]
          .join(" ")
          .toLowerCase();

        if (!searchable.includes(q)) {
          return false;
        }
      }

      return true;
    });
  }, [
    roomListings,
    selectedBedsCount,
    selectedLocation,
    pgProperties,
    searchQuery,
  ]);

  const hasActiveSearchOrFilters =
    selectedBedsCount !== null ||
    selectedLocationId !== null ||
    searchQuery.trim().length > 0;

  return (
    <>
      <section
        id="types-of-rooms"
        className="bg-soft-mint text-deep-forest py-16 sm:py-20 lg:py-24 border-t border-deep-forest/10"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col lg:flex-row lg:items-end justify-between gap-6"
          >
            <div className="max-w-2xl">
              <p className="text-sm sm:text-base font-semibold text-teal-green">
                View our full listings.
              </p>
              <h2
                className="mt-2 font-bold tracking-tight text-deep-forest text-balance"
                style={{ fontSize: "clamp(1.75rem, 3.2vw, 2.65rem)" }}
              >
                We are Available with Multiple Bed Sharing Options.
              </h2>
            </div>

            <button
              type="button"
              className="inline-flex min-h-[44px] self-start lg:self-auto items-center justify-center gap-2 rounded-xl bg-teal-green px-6 py-3 text-sm font-semibold text-soft-off-white hover:bg-dark-teal transition-colors duration-200 whitespace-nowrap shrink-0 cursor-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-forest"
            >
              <span>View Our All Listings</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </motion.div>

          {/* Location (with Searchable Dropdown) + Search Bar Above Part 1 */}
          <div className="mt-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1">
              {/* Location Dropdown with Search Bar */}
              <div ref={locationMenuRef} className="relative">
                <button
                  type="button"
                  onClick={() => setIsLocationOpen((prev) => !prev)}
                  aria-expanded={isLocationOpen}
                  aria-haspopup="listbox"
                  className={`inline-flex min-h-[44px] w-full sm:w-auto items-center justify-between gap-2.5 rounded-xl border px-4 py-2.5 text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-green ${
                    selectedLocation
                      ? "border-teal-green bg-teal-green text-soft-off-white"
                      : "border-deep-forest/20 bg-soft-off-white text-deep-forest hover:border-teal-green"
                  }`}
                >
                  <span className="inline-flex items-center gap-2 min-w-0">
                    <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
                    <span className="truncate">
                      {selectedLocation ? selectedLocation.name : "Location"}
                    </span>
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
                      isLocationOpen ? "rotate-180" : ""
                    }`}
                    aria-hidden="true"
                  />
                </button>

                {isLocationOpen && (
                  <div
                    role="listbox"
                    aria-label="Select location"
                    className="absolute left-0 top-full z-30 mt-2 w-full sm:w-72 rounded-xl border border-deep-forest/15 bg-soft-off-white p-2 shadow-lg"
                  >
                    {/* Location Search Input inside Dropdown */}
                    <div className="relative mb-2">
                      <Search
                        className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-gray"
                        aria-hidden="true"
                      />
                      <input
                        ref={locationSearchInputRef}
                        type="text"
                        value={locationSearchQuery}
                        onChange={(e) => setLocationSearchQuery(e.target.value)}
                        placeholder="Search location..."
                        aria-label="Search location"
                        className="w-full rounded-lg border border-deep-forest/15 bg-light-sage py-2 pl-8 pr-3 text-xs sm:text-sm text-deep-forest placeholder:text-slate-gray/75 focus:border-teal-green focus:outline-none focus:ring-2 focus:ring-teal-green/25"
                      />
                    </div>

                    <div className="max-h-56 overflow-y-auto space-y-0.5">
                      <button
                        type="button"
                        role="option"
                        aria-selected={selectedLocationId === null}
                        onClick={() => {
                          setSelectedLocationId(null);
                          setLocationSearchQuery("");
                          setIsLocationOpen(false);
                        }}
                        className={`flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-xs sm:text-sm font-medium transition-colors ${
                          selectedLocationId === null
                            ? "bg-soft-mint text-teal-green font-semibold"
                            : "text-deep-forest hover:bg-light-sage"
                        }`}
                      >
                        <span>All Locations</span>
                        {selectedLocationId === null && (
                          <Check
                            className="h-3.5 w-3.5 shrink-0"
                            aria-hidden="true"
                          />
                        )}
                      </button>

                      {filteredLocations.length > 0 ? (
                        filteredLocations.map((loc) => {
                          const isLocSelected = selectedLocationId === loc._id;
                          return (
                            <button
                              key={loc._id}
                              type="button"
                              role="option"
                              aria-selected={isLocSelected}
                              onClick={() => {
                                setSelectedLocationId(loc._id);
                                setLocationSearchQuery("");
                                setIsLocationOpen(false);
                              }}
                              className={`flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-xs sm:text-sm transition-colors ${
                                isLocSelected
                                  ? "bg-soft-mint text-teal-green font-semibold"
                                  : "text-deep-forest hover:bg-light-sage"
                              }`}
                            >
                              <div className="min-w-0">
                                <p className="truncate font-medium">
                                  {loc.name}
                                </p>
                                {loc.address && (
                                  <p className="truncate text-[11px] text-slate-gray">
                                    {loc.address}
                                  </p>
                                )}
                              </div>
                              {isLocSelected && (
                                <Check
                                  className="h-3.5 w-3.5 shrink-0"
                                  aria-hidden="true"
                                />
                              )}
                            </button>
                          );
                        })
                      ) : (
                        <p className="px-3 py-2 text-xs text-slate-gray">
                          No locations found
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search
                  className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-gray"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search PG, bed sharing, AC / Non-AC..."
                  aria-label="Search PG and room types"
                  className="min-h-[44px] w-full rounded-xl border border-deep-forest/20 bg-soft-off-white py-2.5 pl-10 pr-4 text-xs sm:text-sm text-deep-forest placeholder:text-slate-gray/75 focus:border-teal-green focus:outline-none focus:ring-2 focus:ring-teal-green/25"
                />
              </div>

              {hasActiveSearchOrFilters && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedBedsCount(null);
                    setSelectedLocationId(null);
                    setSearchQuery("");
                    setLocationSearchQuery("");
                  }}
                  className="inline-flex min-h-[40px] self-start sm:self-auto items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-teal-green hover:text-dark-teal transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-green"
                >
                  <X className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Reset</span>
                </button>
              )}
            </div>

            <span className="text-xs font-medium text-slate-gray tabular-nums shrink-0">
              {filteredRoomListings.length}{" "}
              {filteredRoomListings.length === 1 ? "option" : "options"} available
            </span>
          </div>

          {/* Part 1: Small Image Blocks (2 Columns in Single Row on Mobile + Blinking Arrow) */}
          <div className="mt-5 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {sharingBlocks.map((rt, idx) => {
              const isSelected = selectedBedsCount === rt.beds_count;

              return (
                <motion.button
                  key={rt._id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() =>
                    setSelectedBedsCount((prev) =>
                      prev === rt.beds_count ? null : rt.beds_count
                    )
                  }
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.45,
                    delay: idx * 0.08,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  whileHover={shouldReduceMotion ? undefined : { y: -2 }}
                  className={`group flex w-full items-center gap-2.5 sm:gap-4 rounded-xl border p-2.5 sm:p-3 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-green ${
                    isSelected
                      ? "border-teal-green bg-soft-off-white ring-2 ring-teal-green/25 shadow-sm"
                      : "border-deep-forest/10 bg-soft-off-white shadow-xs hover:border-teal-green/50 hover:shadow-sm"
                  }`}
                >
                  <div className="relative h-12 w-12 sm:h-16 sm:w-22 shrink-0 overflow-hidden rounded-lg bg-light-sage">
                    <RoomTypeThumbnail src={rt.coverImageUrl} alt={rt.name} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-xs sm:text-base font-bold text-deep-forest truncate">
                      {rt.name}
                    </h3>
                    <p className="mt-0.5 text-[11px] sm:text-sm font-medium text-teal-green tabular-nums truncate">
                      {rt.beds_count} Bed Sharing
                    </p>
                  </div>

                  <motion.span
                    aria-hidden="true"
                    animate={
                      shouldReduceMotion
                        ? undefined
                        : {
                            opacity: [1, 0.2, 1],
                            x: [0, 4, 0],
                          }
                    }
                    transition={{
                      duration: 1.4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="inline-flex items-center text-teal-green shrink-0"
                  >
                    <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </motion.span>
                </motion.button>
              );
            })}
          </div>

          {/* Part 2: pgRoomTypes Cards via RoomCard */}
          {filteredRoomListings.length > 0 ? (
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRoomListings.map((item, idx) => (
                <RoomCard
                  key={item._id}
                  item={item}
                  index={idx}
                  onBookNow={(selectedItem) =>
                    setBookingSelection({
                      pgId: selectedItem.pg._id,
                      roomId: selectedItem._id,
                    })
                  }
                />
              ))}
            </div>
          ) : (
            <div className="mt-12 rounded-2xl border border-deep-forest/15 bg-soft-off-white p-8 text-center">
              <p className="text-base font-semibold text-deep-forest">
                No rooms match your search or selected location.
              </p>
              <p className="mt-1 text-sm text-slate-gray">
                Try another location, search term, or reset to view all rooms.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedBedsCount(null);
                  setSelectedLocationId(null);
                  setSearchQuery("");
                  setLocationSearchQuery("");
                }}
                className="mt-4 inline-flex min-h-[40px] items-center justify-center rounded-xl bg-teal-green px-5 py-2 text-sm font-semibold text-soft-off-white hover:bg-dark-teal transition-colors"
              >
                Show All Rooms
              </button>
            </div>
          )}
        </div>
      </section>

      <BookingFormModal
        isOpen={Boolean(bookingSelection)}
        onClose={() => setBookingSelection(null)}
        pgProperties={pgProperties}
        pgRoomTypes={roomListings}
        initialPgId={bookingSelection?.pgId}
        initialRoomId={bookingSelection?.roomId}
      />
    </>
  );
}
