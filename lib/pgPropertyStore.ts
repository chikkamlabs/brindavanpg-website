import {
  activePgPropertiesQuery,
  type PgGender,
  type PgProperty,
  type PortableTextBlock,
} from "./schemas";

export interface PgPropertyView {
  _id: string;
  name: string;
  subheading: string;
  descriptionText: string;
  mobile?: string;
  whatsapp?: string;
  location_url?: string;
  address: string;
  coverImageUrl: string;
  lqip?: string;
  rating?: number;
  gender: PgGender;
  is_featured: boolean;
  status: boolean;
  display_order: number;
}

export const FALLBACK_PG_PROPERTIES: PgPropertyView[] = [
  {
    _id: "fallback-pg-marathahalli-1",
    name: "Brindavan Comfort Stay — Marathahalli",
    subheading: "Executive Men's Residence near Spice Garden",
    descriptionText:
      "Minutes from Outer Ring Road tech parks and Spice Garden bus stop, featuring spacious ventilated rooms, 3-time homestyle meals, high-speed Wi-Fi, biometric access, and daily housekeeping.",
    mobile: "+91 98450 11234",
    whatsapp: "+91 98450 11234",
    location_url:
      "https://www.google.com/maps/search/?api=1&query=Spice+Garden+Layout+Marathahalli+Bengaluru+560037",
    address:
      "14th Cross, Spice Garden Layout, Marathahalli, Bengaluru 560037",
    coverImageUrl: "/images/pgs/pg_marathahalli_one.jpg",
    rating: 4.8,
    gender: "men",
    is_featured: true,
    status: true,
    display_order: 1,
  },
  {
    _id: "fallback-pg-marathahalli-2",
    name: "Brindavan Serenity Homes — Kundalahalli",
    subheading: "Sunlit Women's & Co-Living Residence near Kundalahalli Gate",
    descriptionText:
      "Tucked in a peaceful residential street off Marathahalli-Whitefield Main Road with 24/7 security, bright balconies, nutritious daily dining, laundry care, and quiet work desks.",
    mobile: "+91 98450 55678",
    whatsapp: "+91 98450 55678",
    location_url:
      "https://www.google.com/maps/search/?api=1&query=Kundalahalli+Gate+Marathahalli+Bengaluru+560037",
    address:
      "2nd Main Road, Munnekollal - Kundalahalli Gate, Marathahalli, Bengaluru 560037",
    coverImageUrl: "/images/pgs/pg_marathahalli_two.jpg",
    rating: 4.9,
    gender: "women",
    is_featured: true,
    status: true,
    display_order: 2,
  },
];

export function formatPgGenderLabel(gender: PgGender): string {
  switch (gender) {
    case "men":
      return "Men's PG";
    case "women":
      return "Women's PG";
    case "unisex":
      return "Unisex PG";
    case "co-living":
      return "Co-Living";
    default:
      return "PG Residence";
  }
}

export function extractPlainDescription(
  blocks?: PortableTextBlock[],
  fallback = ""
): string {
  if (!Array.isArray(blocks) || blocks.length === 0) {
    return fallback;
  }

  const text = blocks
    .map((block) =>
      Array.isArray(block.children)
        ? block.children.map((span) => span.text || "").join("")
        : ""
    )
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

  return text || fallback;
}

export function sortPgProperties<
  T extends { is_featured?: boolean; display_order?: number }
>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const featuredDiff =
      Number(Boolean(b.is_featured)) - Number(Boolean(a.is_featured));
    if (featuredDiff !== 0) return featuredDiff;

    const orderA =
      typeof a.display_order === "number"
        ? a.display_order
        : Number.MAX_SAFE_INTEGER;
    const orderB =
      typeof b.display_order === "number"
        ? b.display_order
        : Number.MAX_SAFE_INTEGER;
    return orderA - orderB;
  });
}

function isSanityConfigured(): boolean {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  return Boolean(
    projectId &&
      projectId.trim().length > 0 &&
      projectId !== "your_sanity_project_id"
  );
}

export async function getActivePgProperties(): Promise<{
  properties: PgPropertyView[];
  source: "sanity" | "fallback";
}> {
  if (!isSanityConfigured()) {
    return {
      properties: sortPgProperties(FALLBACK_PG_PROPERTIES),
      source: "fallback",
    };
  }

  try {
    const { sanityClient, urlFor } = await import("./sanity");
    const docs = await sanityClient.fetch<PgProperty[]>(
      activePgPropertiesQuery,
      {},
      { next: { revalidate: 60 } }
    );

    if (!Array.isArray(docs) || docs.length === 0) {
      return {
        properties: sortPgProperties(FALLBACK_PG_PROPERTIES),
        source: "fallback",
      };
    }

    const sortedDocs = sortPgProperties(docs);
    const mapped: PgPropertyView[] = sortedDocs.map((doc, index) => {
      const fallback =
        FALLBACK_PG_PROPERTIES[index % FALLBACK_PG_PROPERTIES.length];

      let coverImageUrl = doc.cover_image?.asset?.url ?? "";
      if (!coverImageUrl && doc.cover_image?.asset) {
        try {
          coverImageUrl = urlFor(doc.cover_image)
            .width(1200)
            .auto("format")
            .url();
        } catch {
          coverImageUrl = "";
        }
      }

      return {
        _id: doc._id,
        name: doc.name?.trim() || fallback.name,
        subheading: doc.subheading?.trim() || fallback.subheading,
        descriptionText: extractPlainDescription(
          doc.description,
          fallback.descriptionText
        ),
        mobile: doc.mobile,
        whatsapp: doc.whatsapp,
        location_url: doc.location_url,
        address: doc.address?.trim() || fallback.address,
        coverImageUrl: coverImageUrl || fallback.coverImageUrl,
        lqip: doc.cover_image?.asset?.metadata?.lqip,
        rating: typeof doc.rating === "number" ? doc.rating : undefined,
        gender: doc.gender || fallback.gender,
        is_featured: Boolean(doc.is_featured),
        status: doc.status ?? true,
        display_order:
          typeof doc.display_order === "number" ? doc.display_order : index + 1,
      };
    });

    return {
      properties: mapped,
      source: "sanity",
    };
  } catch {
    return {
      properties: sortPgProperties(FALLBACK_PG_PROPERTIES),
      source: "fallback",
    };
  }
}

export async function getTopPgProperties(limit = 2): Promise<{
  properties: PgPropertyView[];
  source: "sanity" | "fallback";
}> {
  const { properties, source } = await getActivePgProperties();
  return {
    properties: properties.slice(0, limit),
    source,
  };
}
