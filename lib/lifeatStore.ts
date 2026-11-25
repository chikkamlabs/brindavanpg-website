import {
  amenitiesQuery,
  utilitiesQuery,
  type Amenity,
  type UtilityItem,
} from "./schemas";

export interface LifeAtUtilityView {
  _id: string;
  _type: "utilities";
  title: string;
}

export interface LifeAtAmenityView {
  _id: string;
  _type: "amenity";
  title: string;
  subheading: string;
  coverImageUrl: string;
}

export const FALLBACK_UTILITIES: LifeAtUtilityView[] = [
  { _id: "fallback-utility-1", _type: "utilities", title: "High-Speed Fiber Wi-Fi" },
  { _id: "fallback-utility-2", _type: "utilities", title: "3-Time Homestyle Meals" },
  { _id: "fallback-utility-3", _type: "utilities", title: "Daily Housekeeping" },
  { _id: "fallback-utility-4", _type: "utilities", title: "24/7 Power Backup" },
  { _id: "fallback-utility-5", _type: "utilities", title: "RO Purified Drinking Water" },
  { _id: "fallback-utility-6", _type: "utilities", title: "Biometric & CCTV Security" },
  { _id: "fallback-utility-7", _type: "utilities", title: "Automatic Washing Machines" },
  { _id: "fallback-utility-8", _type: "utilities", title: "24/7 Hot Water Supply" },
];

export const FALLBACK_AMENITIES: LifeAtAmenityView[] = [
  {
    _id: "fallback-amenity-1",
    _type: "amenity",
    title: "Dedicated Co-Working & Study Lounge",
    subheading:
      "Ergonomic desks, fiber Wi-Fi, and quiet daylight corners built for focus.",
    coverImageUrl: "/images/amenities/amenity_workspace.jpg",
  },
  {
    _id: "fallback-amenity-2",
    _type: "amenity",
    title: "Nutritious Homestyle Dining",
    subheading:
      "Freshly prepared North & South Indian meals served daily in a spotless hall.",
    coverImageUrl: "/images/amenities/amenity_dining.jpg",
  },
  {
    _id: "fallback-amenity-3",
    _type: "amenity",
    title: "Self-Service Laundry & Care",
    subheading:
      "Front-load washing machines and organized utility spaces for effortless living.",
    coverImageUrl: "/images/amenities/amenity_laundry.jpg",
  },
  {
    _id: "fallback-amenity-4",
    _type: "amenity",
    title: "Sunlit Rooftop Terrace Lounge",
    subheading:
      "Lush open-air greenery and warm evening seating to unwind after work.",
    coverImageUrl: "/images/amenities/amenity_terrace.jpg",
  },
  {
    _id: "fallback-amenity-5",
    _type: "amenity",
    title: "Smart Biometric Entry & Security",
    subheading:
      "Keycard-secured access gates, CCTV monitoring, and attentive round-the-clock care.",
    coverImageUrl: "/images/amenities/amenity_security.jpg",
  },
];

function isSanityConfigured(): boolean {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  return Boolean(
    projectId &&
      projectId.trim().length > 0 &&
      projectId !== "your_sanity_project_id"
  );
}

export async function getUtilities(): Promise<{
  utilities: LifeAtUtilityView[];
  source: "sanity" | "fallback";
}> {
  if (!isSanityConfigured()) {
    return { utilities: [...FALLBACK_UTILITIES], source: "fallback" };
  }

  try {
    const { sanityClient } = await import("./sanity");
    const docs = await sanityClient.fetch<UtilityItem[]>(
      utilitiesQuery,
      {},
      { next: { revalidate: 60 } }
    );

    if (!Array.isArray(docs) || docs.length === 0) {
      return { utilities: [...FALLBACK_UTILITIES], source: "fallback" };
    }

    const mapped = docs
      .filter((doc) => doc?.title?.trim())
      .map((doc) => ({
        _id: doc._id,
        _type: "utilities" as const,
        title: doc.title.trim(),
      }));

    if (mapped.length === 0) {
      return { utilities: [...FALLBACK_UTILITIES], source: "fallback" };
    }

    return { utilities: mapped, source: "sanity" };
  } catch {
    return { utilities: [...FALLBACK_UTILITIES], source: "fallback" };
  }
}

export async function getAmenities(): Promise<{
  amenities: LifeAtAmenityView[];
  source: "sanity" | "fallback";
}> {
  if (!isSanityConfigured()) {
    return { amenities: [...FALLBACK_AMENITIES], source: "fallback" };
  }

  try {
    const { sanityClient, urlFor } = await import("./sanity");
    const docs = await sanityClient.fetch<Amenity[]>(
      amenitiesQuery,
      {},
      { next: { revalidate: 60 } }
    );

    if (!Array.isArray(docs) || docs.length === 0) {
      return { amenities: [...FALLBACK_AMENITIES], source: "fallback" };
    }

    const mapped: LifeAtAmenityView[] = docs.map((doc, index) => {
      const fallback = FALLBACK_AMENITIES[index % FALLBACK_AMENITIES.length];

      let coverImageUrl = doc.cover_image?.asset?.url ?? "";
      if (!coverImageUrl && doc.cover_image?.asset) {
        try {
          coverImageUrl = urlFor(doc.cover_image)
            .width(900)
            .auto("format")
            .url();
        } catch {
          coverImageUrl = "";
        }
      }

      return {
        _id: doc._id,
        _type: "amenity",
        title: doc.title?.trim() || fallback.title,
        subheading: doc.subheading?.trim() || fallback.subheading,
        coverImageUrl: coverImageUrl || fallback.coverImageUrl,
      };
    });

    return { amenities: mapped, source: "sanity" };
  } catch {
    return { amenities: [...FALLBACK_AMENITIES], source: "fallback" };
  }
}

export async function getLifeAtBrindavanData(): Promise<{
  utilities: LifeAtUtilityView[];
  amenities: LifeAtAmenityView[];
}> {
  const [{ utilities }, { amenities }] = await Promise.all([
    getUtilities(),
    getAmenities(),
  ]);

  return { utilities, amenities };
}
