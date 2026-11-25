"use client";

import { ArrowUpRight, Mail, Phone } from "lucide-react";
import { FaInstagram } from "react-icons/fa";
import { motion, useReducedMotion } from "motion/react";
import { BookingForm } from "./form";
import type { PgPropertyView } from "@/lib/pgPropertyStore";
import type { PgRoomTypeView } from "@/lib/roomtypesStore";

interface ContactUsProps {
  pgProperties?: PgPropertyView[];
  pgRoomTypes?: PgRoomTypeView[];
}

const CONTACT_PHONE = "7893194224";
const CONTACT_TEL_HREF = "tel:+917893194224";
const CONTACT_EMAIL = "brindavanpgbusiness@gmail.com";
const CONTACT_EMAIL_HREF = `mailto:${CONTACT_EMAIL}`;
const CONTACT_INSTAGRAM_HANDLE = "brindavanpg";
const CONTACT_INSTAGRAM_HREF = `https://www.instagram.com/${CONTACT_INSTAGRAM_HANDLE}/`;

export default function ContactUs({
  pgProperties,
  pgRoomTypes,
}: ContactUsProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="contact-us"
      className="bg-soft-mint text-deep-forest py-16 sm:py-20 lg:py-24 border-t border-deep-forest/10"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Side: Call Button, Mobile Number, Email & Instagram */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex flex-col items-start"
          >
            <p className="text-sm sm:text-base font-semibold text-teal-green">
              Contact Us
            </p>
            <h2
              className="mt-2 font-bold tracking-tight text-deep-forest text-balance"
              style={{ fontSize: "clamp(1.875rem, 3.2vw, 2.75rem)" }}
            >
              Get in Touch with Brindavan PG&apos;s
            </h2>
            <p className="mt-4 text-sm sm:text-base leading-relaxed text-slate-gray max-w-md">
              Call us directly, write an email, or reach out on Instagram for
              instant room availability, pricing, and PG visit scheduling.
            </p>

            {/* Primary Call Action Button */}
            <div className="mt-7">
              <a
                href={CONTACT_TEL_HREF}
                className="inline-flex min-h-[46px] items-center justify-center gap-2.5 rounded-xl bg-teal-green px-6 py-3 text-sm sm:text-base font-semibold text-soft-off-white shadow-sm hover:bg-dark-teal transition-colors duration-200 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-forest"
              >
                <Phone className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>Call Now</span>
              </a>
            </div>

            {/* Direct Contact Channels (Tap to Redirect to Respective Platform) */}
            <div className="mt-8 w-full divide-y divide-deep-forest/15 border-y border-deep-forest/15">
              <a
                href={CONTACT_TEL_HREF}
                className="group flex min-h-[56px] items-center justify-between gap-4 py-4 transition-colors hover:text-teal-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-green rounded"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-soft-off-white border border-deep-forest/15 text-teal-green shrink-0">
                    <Phone className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-gray">
                      Mobile Number
                    </p>
                    <p className="text-sm sm:text-base font-semibold text-deep-forest group-hover:text-teal-green tabular-nums truncate">
                      {CONTACT_PHONE}
                    </p>
                  </div>
                </div>
                <ArrowUpRight
                  className="h-4 w-4 text-slate-gray group-hover:text-teal-green shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden="true"
                />
              </a>

              <a
                href={CONTACT_EMAIL_HREF}
                className="group flex min-h-[56px] items-center justify-between gap-4 py-4 transition-colors hover:text-teal-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-green rounded"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-soft-off-white border border-deep-forest/15 text-teal-green shrink-0">
                    <Mail className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-gray">Email</p>
                    <p className="text-sm sm:text-base font-semibold text-deep-forest group-hover:text-teal-green truncate">
                      {CONTACT_EMAIL}
                    </p>
                  </div>
                </div>
                <ArrowUpRight
                  className="h-4 w-4 text-slate-gray group-hover:text-teal-green shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden="true"
                />
              </a>

              <a
                href={CONTACT_INSTAGRAM_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex min-h-[56px] items-center justify-between gap-4 py-4 transition-colors hover:text-teal-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-green rounded"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-soft-off-white border border-deep-forest/15 text-teal-green shrink-0">
                    <FaInstagram className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-gray">
                      Instagram
                    </p>
                    <p className="text-sm sm:text-base font-semibold text-deep-forest group-hover:text-teal-green truncate">
                      {CONTACT_INSTAGRAM_HANDLE}
                    </p>
                  </div>
                </div>
                <ArrowUpRight
                  className="h-4 w-4 text-slate-gray group-hover:text-teal-green shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden="true"
                />
              </a>
            </div>
          </motion.div>

          {/* Right Side: Embedded Booking Form (components/form.tsx) */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7"
          >
            <BookingForm
              pgProperties={pgProperties}
              pgRoomTypes={pgRoomTypes}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
