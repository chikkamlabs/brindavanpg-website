"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, ExternalLink, Send, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  FALLBACK_PG_PROPERTIES,
  type PgPropertyView,
} from "@/lib/pgPropertyStore";
import {
  FALLBACK_PG_ROOM_TYPES,
  formatCurrencyINR,
  type PgRoomTypeView,
} from "@/lib/roomtypesStore";

export interface BookingFormProps {
  pgProperties?: PgPropertyView[];
  pgRoomTypes?: PgRoomTypeView[];
  initialPgId?: string;
  initialRoomId?: string;
  onClose?: () => void;
  titleId?: string;
}

interface BookingFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  pgProperties?: PgPropertyView[];
  pgRoomTypes?: PgRoomTypeView[];
  initialPgId?: string;
  initialRoomId?: string;
}

const WHATSAPP_TARGET = "917893194224";

export function BookingForm({
  pgProperties,
  pgRoomTypes,
  initialPgId,
  initialRoomId,
  onClose,
  titleId,
}: BookingFormProps) {
  const availablePgs = useMemo(() => {
    if (pgProperties && pgProperties.length > 0) return pgProperties;
    if (pgRoomTypes && pgRoomTypes.length > 0) {
      const seen = new Map<string, PgPropertyView>();
      for (const item of pgRoomTypes) {
        if (!seen.has(item.pg._id)) {
          const fallbackMatch = FALLBACK_PG_PROPERTIES.find(
            (fb) =>
              fb._id === item.pg._id ||
              fb.name.toLowerCase() === item.pg.name.toLowerCase()
          );
          seen.set(item.pg._id, {
            _id: item.pg._id,
            name: item.pg.name,
            subheading: fallbackMatch?.subheading ?? "",
            descriptionText: fallbackMatch?.descriptionText ?? "",
            address: fallbackMatch?.address ?? "",
            coverImageUrl: item.coverImageUrl,
            gender: fallbackMatch?.gender ?? "co-living",
            is_featured: true,
            status: true,
            display_order: seen.size + 1,
          });
        }
      }
      if (seen.size > 0) return Array.from(seen.values());
    }
    return FALLBACK_PG_PROPERTIES;
  }, [pgProperties, pgRoomTypes]);

  const allRoomTypes =
    pgRoomTypes && pgRoomTypes.length > 0
      ? pgRoomTypes
      : FALLBACK_PG_ROOM_TYPES;

  const [name, setName] = useState("");
  const [gender, setGender] = useState("Male");
  const [mobile, setMobile] = useState("");
  const [selectedPgId, setSelectedPgId] = useState(
    initialPgId || availablePgs[0]?._id || ""
  );
  const [selectedRoomId, setSelectedRoomId] = useState(initialRoomId || "");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [submittedUrl, setSubmittedUrl] = useState<string | null>(null);

  const selectedPg = useMemo(
    () =>
      availablePgs.find((pg) => pg._id === selectedPgId) ?? availablePgs[0],
    [availablePgs, selectedPgId]
  );

  const roomsForSelectedPg = useMemo(() => {
    if (!selectedPg) return allRoomTypes;
    const matched = allRoomTypes.filter(
      (room) =>
        room.pg._id === selectedPg._id ||
        room.pg.name.toLowerCase() === selectedPg.name.toLowerCase()
    );
    return matched.length > 0 ? matched : allRoomTypes;
  }, [allRoomTypes, selectedPg]);

  const activeRoom = useMemo(
    () =>
      roomsForSelectedPg.find((r) => r._id === selectedRoomId) ??
      roomsForSelectedPg[0],
    [roomsForSelectedPg, selectedRoomId]
  );

  const buildFormattedMessage = () => {
    const roomLabel = activeRoom
      ? `${activeRoom.room_type.name} (${
          activeRoom.room_type.ac ? "AC" : "Non-AC"
        }) - ${formatCurrencyINR(activeRoom.price)}/month`
      : "Not specified";

    return [
      "Hello Brindavan PG's Team,",
      "",
      "I would like to book a room / schedule a PG visit. Here are my details:",
      "",
      `* Name: ${name.trim()}`,
      `* Gender: ${gender}`,
      `* Mobile Number: ${mobile.trim()}`,
      `* Selected PG: ${selectedPg?.name ?? "Brindavan PG"}`,
      `* Room Type & Price: ${roomLabel}`,
      `* Notes: ${notes.trim() || "None"}`,
      "",
      "Please share bed availability and next steps. Thank you!",
    ].join("\n");
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const trimmedName = name.trim();
    const cleanedMobile = mobile.replace(/\D/g, "");

    if (trimmedName.length < 2) {
      setError("Please enter your full name.");
      return;
    }

    if (cleanedMobile.length < 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (!selectedPg || !activeRoom) {
      setError("Please select a PG and room type.");
      return;
    }

    const message = buildFormattedMessage();
    const whatsappUrl = `https://wa.me/${WHATSAPP_TARGET}?text=${encodeURIComponent(
      message
    )}`;

    setSubmittedUrl(whatsappUrl);

    const anchor = document.createElement("a");
    anchor.href = whatsappUrl;
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  const handleReset = () => {
    setSubmittedUrl(null);
    setError("");
  };

  const idPrefix = titleId ? "modal" : "contact";

  return (
    <div className="w-full rounded-2xl border border-deep-forest/15 bg-soft-off-white text-deep-forest shadow-xl overflow-hidden">
      {/* Form Header */}
      <div className="flex items-center justify-between gap-4 bg-deep-forest px-6 py-4 text-soft-off-white">
        <div>
          <h2
            id={titleId}
            className="text-lg sm:text-xl font-bold text-muted-gold brightness-125"
          >
            Book Your Stay
          </h2>
          <p className="text-xs sm:text-sm text-soft-mint/85 mt-0.5">
            Send your room preference directly to our PG desk
          </p>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close booking form"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-soft-mint/20 bg-dark-teal/60 text-soft-off-white hover:border-muted-gold hover:text-muted-gold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-muted-gold"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>

      {submittedUrl ? (
        <div className="p-6 space-y-5">
          <div className="flex items-start gap-3 rounded-xl bg-soft-mint p-4 border border-teal-green/25">
            <CheckCircle2
              className="h-5 w-5 text-teal-green shrink-0 mt-0.5"
              aria-hidden="true"
            />
            <div>
              <h3 className="text-sm font-bold text-deep-forest">
                Booking Details Formatted
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-slate-gray">
                Your inquiry is ready to send to{" "}
                <span className="font-semibold text-deep-forest tabular-nums">
                  +91 78931 94224
                </span>{" "}
                via WhatsApp.
              </p>
            </div>
          </div>

          <pre className="whitespace-pre-wrap rounded-xl border border-deep-forest/15 bg-light-sage p-4 text-xs font-sans text-deep-forest leading-relaxed">
            {buildFormattedMessage()}
          </pre>

          <div className="flex flex-wrap items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="min-h-[42px] rounded-xl border border-deep-forest/20 bg-soft-off-white px-4 py-2 text-sm font-semibold text-deep-forest hover:bg-light-sage transition-colors"
            >
              Edit Details
            </button>
            <a
              href={submittedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[42px] items-center gap-2 rounded-xl bg-teal-green px-5 py-2 text-sm font-semibold text-soft-off-white hover:bg-dark-teal transition-colors"
            >
              <span>Send on WhatsApp</span>
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div
              role="alert"
              className="rounded-lg border border-deep-forest/20 bg-soft-mint px-3.5 py-2.5 text-xs sm:text-sm font-medium text-deep-forest"
            >
              {error}
            </div>
          )}

          {/* Name */}
          <div>
            <label
              htmlFor={`${idPrefix}-booking-name`}
              className="block text-xs sm:text-sm font-semibold text-deep-forest mb-1.5"
            >
              Name
            </label>
            <input
              id={`${idPrefix}-booking-name`}
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full rounded-xl border border-deep-forest/20 bg-light-sage px-3.5 py-2.5 text-sm text-deep-forest placeholder:text-slate-gray/70 focus:border-teal-green focus:outline-none focus:ring-2 focus:ring-teal-green/25"
            />
          </div>

          {/* Gender + Mobile Number */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor={`${idPrefix}-booking-gender`}
                className="block text-xs sm:text-sm font-semibold text-deep-forest mb-1.5"
              >
                Gender
              </label>
              <select
                id={`${idPrefix}-booking-gender`}
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full rounded-xl border border-deep-forest/20 bg-light-sage px-3.5 py-2.5 text-sm text-deep-forest focus:border-teal-green focus:outline-none focus:ring-2 focus:ring-teal-green/25"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label
                htmlFor={`${idPrefix}-booking-mobile`}
                className="block text-xs sm:text-sm font-semibold text-deep-forest mb-1.5"
              >
                Mobile Number
              </label>
              <input
                id={`${idPrefix}-booking-mobile`}
                type="tel"
                required
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="10-digit mobile number"
                className="w-full rounded-xl border border-deep-forest/20 bg-light-sage px-3.5 py-2.5 text-sm text-deep-forest placeholder:text-slate-gray/70 tabular-nums focus:border-teal-green focus:outline-none focus:ring-2 focus:ring-teal-green/25"
              />
            </div>
          </div>

          {/* PG Selection */}
          <div>
            <label
              htmlFor={`${idPrefix}-booking-pg`}
              className="block text-xs sm:text-sm font-semibold text-deep-forest mb-1.5"
            >
              Select PG
            </label>
            <select
              id={`${idPrefix}-booking-pg`}
              value={selectedPg?._id ?? ""}
              onChange={(e) => {
                setSelectedPgId(e.target.value);
                setSelectedRoomId("");
              }}
              className="w-full rounded-xl border border-deep-forest/20 bg-light-sage px-3.5 py-2.5 text-sm text-deep-forest focus:border-teal-green focus:outline-none focus:ring-2 focus:ring-teal-green/25"
            >
              {availablePgs.map((pg) => (
                <option key={pg._id} value={pg._id}>
                  {pg.name}
                </option>
              ))}
            </select>
          </div>

          {/* Room Type & Price for Selected PG */}
          <div>
            <label
              htmlFor={`${idPrefix}-booking-room-type`}
              className="block text-xs sm:text-sm font-semibold text-deep-forest mb-1.5"
            >
              Room Type &amp; Monthly Rent
            </label>
            <select
              id={`${idPrefix}-booking-room-type`}
              value={activeRoom?._id ?? ""}
              onChange={(e) => setSelectedRoomId(e.target.value)}
              className="w-full rounded-xl border border-deep-forest/20 bg-light-sage px-3.5 py-2.5 text-sm text-deep-forest tabular-nums focus:border-teal-green focus:outline-none focus:ring-2 focus:ring-teal-green/25"
            >
              {roomsForSelectedPg.map((room) => (
                <option key={room._id} value={room._id}>
                  {room.room_type.name} ({room.room_type.ac ? "AC" : "Non-AC"}) —{" "}
                  {formatCurrencyINR(room.price)}/month
                </option>
              ))}
            </select>
          </div>

          {/* Notes */}
          <div>
            <label
              htmlFor={`${idPrefix}-booking-notes`}
              className="block text-xs sm:text-sm font-semibold text-deep-forest mb-1.5"
            >
              Notes
            </label>
            <textarea
              id={`${idPrefix}-booking-notes`}
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Move-in date, preferred visit time, or any questions..."
              className="w-full rounded-xl border border-deep-forest/20 bg-light-sage px-3.5 py-2.5 text-sm text-deep-forest placeholder:text-slate-gray/70 focus:border-teal-green focus:outline-none focus:ring-2 focus:ring-teal-green/25 resize-none"
            />
          </div>

          {/* Submit */}
          <div className="pt-1 flex items-center justify-end gap-3">
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="min-h-[44px] rounded-xl border border-deep-forest/20 bg-soft-off-white px-4 py-2.5 text-sm font-semibold text-deep-forest hover:bg-light-sage transition-colors"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-teal-green px-6 py-2.5 text-sm font-semibold text-soft-off-white hover:bg-dark-teal transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-forest"
            >
              <span>Submit</span>
              <Send className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default function BookingFormModal({
  isOpen,
  onClose,
  pgProperties,
  pgRoomTypes,
  initialPgId,
  initialRoomId,
}: BookingFormModalProps) {
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="booking-modal-title"
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-deep-forest/75 backdrop-blur-xs p-4 overflow-y-auto"
        >
          <motion.div
            initial={
              shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 18, scale: 0.98 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={
              shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.98 }
            }
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg my-auto"
          >
            <BookingForm
              key={`${initialPgId ?? "default"}-${initialRoomId ?? "default"}`}
              pgProperties={pgProperties}
              pgRoomTypes={pgRoomTypes}
              initialPgId={initialPgId}
              initialRoomId={initialRoomId}
              onClose={onClose}
              titleId="booking-modal-title"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
