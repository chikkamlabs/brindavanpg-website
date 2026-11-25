import {
  locationsQuery,
  pgLocationsQuery,
  pgRoomTypesQuery,
  roomTypesQuery,
  type LocationItem,
  type PgLocations,
  type PgRoomType,
  type RoomType,
  type SanityImageField,
} from "./schemas";
import { FALLBACK_PG_PROPERTIES } from "./pgPropertyStore";

export interface RoomTypeView {
  _id: string;
  name: string;
  beds_count: number;
  ac: boolean;
  coverImageUrl: string;
  sharingLabel: string;
}

export interface PgRoomTypeView {
  _id: string;
  pg: {
    _id: string;
    name: string;
  };
  room_type: RoomTypeView;
  price: number;
  actual_price?: number;
  deposit?: number;
  description: string;
  coverImageUrl: string;
  images: SanityImageField[];
  status: boolean;
  display_order: number;
}

export interface LocationFilterOption {
  _id: string;
  name: string;
  address?: string;
  pgIds: string[];
}

export function formatBedSharing(bedsCount: number): string {
  return `${bedsCount} Bed Sharing`;
}

export function formatCurrencyINR(amount?: number): string {
  if (typeof amount !== "number" || Number.isNaN(amount)) return "";
  return `₹${amount.toLocaleString("en-IN")}`;
}

export const FALLBACK_ROOM_TYPES: RoomTypeView[] = [
  {
    _id: "fallback-roomtype-2bed",
    name: "2 Bed Sharing",
    beds_count: 2,
    ac: true,
    coverImageUrl: "/images/rooms/room_two_sharing.jpg",
    sharingLabel: formatBedSharing(2),
  },
  {
    _id: "fallback-roomtype-3bed",
    name: "3 Bed Sharing",
    beds_count: 3,
    ac: false,
    coverImageUrl: "/images/rooms/room_three_sharing.jpg",
    sharingLabel: formatBedSharing(3),
  },
  {
    _id: "fallback-roomtype-4bed",
    name: "4 Bed Sharing",
    beds_count: 4,
    ac: false,
    coverImageUrl: "/images/rooms/room_four_sharing.jpg",
    sharingLabel: formatBedSharing(4),
  },
];

const pgOne = FALLBACK_PG_PROPERTIES[0];
const pgTwo = FALLBACK_PG_PROPERTIES[1];

function createFallbackSanityImage(key: string, url: string): SanityImageField {
  return {
    _type: "image",
    _key: key,
    asset: {
      _id: `fallback-asset-${key}`,
      url,
    },
  };
}

export function resolveRoomGalleryUrls(item: PgRoomTypeView): string[] {
  const urls: string[] = [];
  const addUrl = (u?: string) => {
    if (u && !urls.includes(u)) {
      urls.push(u);
    }
  };

  addUrl(item.coverImageUrl);
  if (Array.isArray(item.images)) {
    for (const img of item.images) {
      addUrl(img?.asset?.url);
    }
  }
  return urls;
}

export const FALLBACK_PG_ROOM_TYPES: PgRoomTypeView[] = [
  {
    _id: "fallback-pg-room-1",
    pg: { _id: pgOne._id, name: pgOne.name },
    room_type: FALLBACK_ROOM_TYPES[0],
    price: 11500,
    actual_price: 13000,
    deposit: 15000,
    description:
      "Spacious twin-sharing AC room near Spice Garden with individual wooden desks, wardrobes, and attached balcony.",
    coverImageUrl: "/images/rooms/room_two_sharing.jpg",
    images: [
      createFallbackSanityImage("r1-1", "/images/homescreen/pg_cozy_bedroom.jpg"),
      createFallbackSanityImage("r1-2", "/images/homescreen/pg_spotless_interior.jpg"),
      createFallbackSanityImage("r1-3", "/images/amenities/amenity_workspace.jpg"),
    ],
    status: true,
    display_order: 1,
  },
  {
    _id: "fallback-pg-room-2",
    pg: { _id: pgOne._id, name: pgOne.name },
    room_type: {
      ...FALLBACK_ROOM_TYPES[0],
      _id: "fallback-roomtype-2bed-nonac",
      ac: false,
    },
    price: 9500,
    actual_price: 10500,
    deposit: 12000,
    description:
      "Bright cross-ventilated 2-bed sharing room with ergonomic study corner, daily housekeeping, and high-speed Wi-Fi.",
    coverImageUrl: "/images/homescreen/pg_cozy_bedroom.jpg",
    images: [
      createFallbackSanityImage("r2-1", "/images/rooms/room_two_sharing.jpg"),
      createFallbackSanityImage("r2-2", "/images/homescreen/pg_spotless_interior.jpg"),
      createFallbackSanityImage("r2-3", "/images/homescreen/pg_homely_dining.jpg"),
    ],
    status: true,
    display_order: 2,
  },
  {
    _id: "fallback-pg-room-3",
    pg: { _id: pgOne._id, name: pgOne.name },
    room_type: {
      ...FALLBACK_ROOM_TYPES[1],
      ac: true,
    },
    price: 9200,
    actual_price: 10500,
    deposit: 12000,
    description:
      "Well-planned 3-bed sharing AC suite in Marathahalli featuring personal lockers, reading lamps, and 3 daily meals.",
    coverImageUrl: "/images/rooms/room_three_sharing.jpg",
    images: [
      createFallbackSanityImage("r3-1", "/images/homescreen/pg_spotless_interior.jpg"),
      createFallbackSanityImage("r3-2", "/images/homescreen/pg_community_lounge.jpg"),
      createFallbackSanityImage("r3-3", "/images/amenities/amenity_dining.jpg"),
    ],
    status: true,
    display_order: 3,
  },
  {
    _id: "fallback-pg-room-4",
    pg: { _id: pgOne._id, name: pgOne.name },
    room_type: FALLBACK_ROOM_TYPES[2],
    price: 7200,
    actual_price: 8200,
    deposit: 10000,
    description:
      "Value-friendly 4-bed sharing residence with generous aisle space, dedicated bookshelves, and spotless upkeep.",
    coverImageUrl: "/images/rooms/room_four_sharing.jpg",
    images: [
      createFallbackSanityImage("r4-1", "/images/homescreen/pg_cozy_bedroom.jpg"),
      createFallbackSanityImage("r4-2", "/images/homescreen/pg_homely_dining.jpg"),
      createFallbackSanityImage("r4-3", "/images/amenities/amenity_laundry.jpg"),
    ],
    status: true,
    display_order: 4,
  },
  {
    _id: "fallback-pg-room-5",
    pg: { _id: pgTwo._id, name: pgTwo.name },
    room_type: FALLBACK_ROOM_TYPES[0],
    price: 12000,
    actual_price: 13500,
    deposit: 15000,
    description:
      "Sunlit 2-bed sharing AC suite at Kundalahalli Gate with private balcony greenery, full-height wardrobe, and work desk.",
    coverImageUrl: "/images/homescreen/pg_spotless_interior.jpg",
    images: [
      createFallbackSanityImage("r5-1", "/images/rooms/room_two_sharing.jpg"),
      createFallbackSanityImage("r5-2", "/images/amenities/amenity_terrace.jpg"),
      createFallbackSanityImage("r5-3", "/images/amenities/amenity_security.jpg"),
    ],
    status: true,
    display_order: 5,
  },
  {
    _id: "fallback-pg-room-6",
    pg: { _id: pgTwo._id, name: pgTwo.name },
    room_type: FALLBACK_ROOM_TYPES[1],
    price: 8500,
    actual_price: 9500,
    deposit: 10000,
    description:
      "Airy 3-bed sharing room with large sunlit windows, individual storage cabinets, and wholesome daily dining included.",
    coverImageUrl: "/images/rooms/room_three_sharing.jpg",
    images: [
      createFallbackSanityImage("r6-1", "/images/homescreen/pg_cozy_bedroom.jpg"),
      createFallbackSanityImage("r6-2", "/images/homescreen/pg_community_lounge.jpg"),
      createFallbackSanityImage("r6-3", "/images/amenities/amenity_dining.jpg"),
    ],
    status: true,
    display_order: 6,
  },
  {
    _id: "fallback-pg-room-7",
    pg: { _id: pgTwo._id, name: pgTwo.name },
    room_type: {
      ...FALLBACK_ROOM_TYPES[2],
      ac: true,
    },
    price: 7800,
    actual_price: 8800,
    deposit: 10000,
    description:
      "Comfortable 4-bed sharing AC room near Kundalahalli with quiet study corners, laundry access, and 24/7 security.",
    coverImageUrl: "/images/rooms/room_four_sharing.jpg",
    images: [
      createFallbackSanityImage("r7-1", "/images/homescreen/pg_spotless_interior.jpg"),
      createFallbackSanityImage("r7-2", "/images/amenities/amenity_workspace.jpg"),
      createFallbackSanityImage("r7-3", "/images/amenities/amenity_terrace.jpg"),
    ],
    status: true,
    display_order: 7,
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

function resolveFallbackImageForBeds(bedsCount: number): string {
  if (bedsCount <= 2) return "/images/rooms/room_two_sharing.jpg";
  if (bedsCount === 3) return "/images/rooms/room_three_sharing.jpg";
  return "/images/rooms/room_four_sharing.jpg";
}

export async function getRoomTypes(): Promise<{
  roomTypes: RoomTypeView[];
  source: "sanity" | "fallback";
}> {
  if (!isSanityConfigured()) {
    return {
      roomTypes: [...FALLBACK_ROOM_TYPES],
      source: "fallback",
    };
  }

  try {
    const { sanityClient, urlFor } = await import("./sanity");
    const docs = await sanityClient.fetch<RoomType[]>(
      roomTypesQuery,
      {},
      { next: { revalidate: 60 } }
    );

    if (!Array.isArray(docs) || docs.length === 0) {
      return {
        roomTypes: [...FALLBACK_ROOM_TYPES],
        source: "fallback",
      };
    }

    const mapped: RoomTypeView[] = docs
      .map((doc) => {
        const beds = typeof doc.beds_count === "number" ? doc.beds_count : 2;
        let coverImageUrl = doc.cover_image?.asset?.url ?? "";
        if (!coverImageUrl && doc.cover_image?.asset) {
          try {
            coverImageUrl = urlFor(doc.cover_image)
              .width(800)
              .auto("format")
              .url();
          } catch {
            coverImageUrl = "";
          }
        }

        return {
          _id: doc._id,
          name: doc.name?.trim() || formatBedSharing(beds),
          beds_count: beds,
          ac: Boolean(doc.ac),
          coverImageUrl: coverImageUrl || resolveFallbackImageForBeds(beds),
          sharingLabel: formatBedSharing(beds),
        };
      })
      .sort((a, b) => a.beds_count - b.beds_count);

    return {
      roomTypes: mapped,
      source: "sanity",
    };
  } catch {
    return {
      roomTypes: [...FALLBACK_ROOM_TYPES],
      source: "fallback",
    };
  }
}

export async function getPgRoomTypes(): Promise<{
  pgRoomTypes: PgRoomTypeView[];
  source: "sanity" | "fallback";
}> {
  if (!isSanityConfigured()) {
    return {
      pgRoomTypes: [...FALLBACK_PG_ROOM_TYPES].sort(
        (a, b) => a.display_order - b.display_order
      ),
      source: "fallback",
    };
  }

  try {
    const { sanityClient, urlFor } = await import("./sanity");
    const docs = await sanityClient.fetch<PgRoomType[]>(
      pgRoomTypesQuery,
      {},
      { next: { revalidate: 60 } }
    );

    if (!Array.isArray(docs) || docs.length === 0) {
      return {
        pgRoomTypes: [...FALLBACK_PG_ROOM_TYPES].sort(
          (a, b) => a.display_order - b.display_order
        ),
        source: "fallback",
      };
    }

    const mapped: PgRoomTypeView[] = docs
      .map((doc, index) => {
        const fallback =
          FALLBACK_PG_ROOM_TYPES[index % FALLBACK_PG_ROOM_TYPES.length];
        const bedsCount =
          typeof doc.room_type?.beds_count === "number"
            ? doc.room_type.beds_count
            : fallback.room_type.beds_count;

        let roomCoverUrl = doc.cover_image?.asset?.url ?? "";
        if (!roomCoverUrl && doc.cover_image?.asset) {
          try {
            roomCoverUrl = urlFor(doc.cover_image)
              .width(900)
              .auto("format")
              .url();
          } catch {
            roomCoverUrl = "";
          }
        }

        let typeCoverUrl = doc.room_type?.cover_image?.asset?.url ?? "";
        if (!typeCoverUrl && doc.room_type?.cover_image?.asset) {
          try {
            typeCoverUrl = urlFor(doc.room_type.cover_image)
              .width(800)
              .auto("format")
              .url();
          } catch {
            typeCoverUrl = "";
          }
        }

        const resolvedImage =
          roomCoverUrl || typeCoverUrl || resolveFallbackImageForBeds(bedsCount);

        const resolvedAdditionalImages: SanityImageField[] =
          Array.isArray(doc.images) && doc.images.length > 0
            ? doc.images
                .map((img, imgIdx) => {
                  let imgUrl = img?.asset?.url ?? "";
                  if (!imgUrl && img?.asset) {
                    try {
                      imgUrl = urlFor(img).width(1200).auto("format").url();
                    } catch {
                      imgUrl = "";
                    }
                  }
                  if (!imgUrl) return null;
                  return {
                    ...img,
                    _type: "image" as const,
                    _key: img._key || `sanity-room-img-${imgIdx}`,
                    asset: {
                      _id: img.asset?._id || `sanity-asset-${imgIdx}`,
                      url: imgUrl,
                      metadata: img.asset?.metadata,
                    },
                  };
                })
                .filter((x): x is NonNullable<typeof x> => x !== null)
            : fallback.images;

        return {
          _id: doc._id,
          pg: {
            _id: doc.pg?._id || fallback.pg._id,
            name: doc.pg?.name || fallback.pg.name,
          },
          room_type: {
            _id: doc.room_type?._id || fallback.room_type._id,
            name: doc.room_type?.name || formatBedSharing(bedsCount),
            beds_count: bedsCount,
            ac: Boolean(doc.room_type?.ac),
            coverImageUrl: typeCoverUrl || resolveFallbackImageForBeds(bedsCount),
            sharingLabel: formatBedSharing(bedsCount),
          },
          price: typeof doc.price === "number" ? doc.price : fallback.price,
          actual_price:
            typeof doc.actual_price === "number" ? doc.actual_price : undefined,
          deposit: typeof doc.deposit === "number" ? doc.deposit : undefined,
          description: doc.description?.trim() || fallback.description,
          coverImageUrl: resolvedImage,
          images:
            resolvedAdditionalImages.length > 0
              ? resolvedAdditionalImages
              : fallback.images,
          status: doc.status ?? true,
          display_order:
            typeof doc.display_order === "number"
              ? doc.display_order
              : index + 1,
        };
      })
      .sort((a, b) => a.display_order - b.display_order);

    return {
      pgRoomTypes: mapped,
      source: "sanity",
    };
  } catch {
    return {
      pgRoomTypes: [...FALLBACK_PG_ROOM_TYPES].sort(
        (a, b) => a.display_order - b.display_order
      ),
      source: "fallback",
    };
  }
}

export const FALLBACK_LOCATION_FILTERS: LocationFilterOption[] = [
  {
    _id: "fallback-loc-marathahalli",
    name: "Spice Garden, Marathahalli",
    address: "Outer Ring Road & Spice Garden Layout",
    pgIds: [pgOne._id],
  },
  {
    _id: "fallback-loc-kundalahalli",
    name: "Kundalahalli Gate",
    address: "Munnekollal & Whitefield Main Road",
    pgIds: [pgTwo._id],
  },
];

export async function getLocationFilterOptions(): Promise<{
  locations: LocationFilterOption[];
  source: "sanity" | "fallback";
}> {
  if (!isSanityConfigured()) {
    return {
      locations: [...FALLBACK_LOCATION_FILTERS],
      source: "fallback",
    };
  }

  try {
    const { sanityClient } = await import("./sanity");
    const [locationDocs, pgLocationDocs] = await Promise.all([
      sanityClient.fetch<LocationItem[]>(
        locationsQuery,
        {},
        { next: { revalidate: 60 } }
      ),
      sanityClient.fetch<PgLocations[]>(
        pgLocationsQuery,
        {},
        { next: { revalidate: 60 } }
      ),
    ]);

    const locMap = new Map<string, LocationFilterOption>();

    if (Array.isArray(locationDocs)) {
      for (const loc of locationDocs) {
        if (!loc?._id || !loc?.name?.trim()) continue;
        locMap.set(loc._id, {
          _id: loc._id,
          name: loc.name.trim(),
          address: loc.address?.trim(),
          pgIds: [],
        });
      }
    }

    if (Array.isArray(pgLocationDocs)) {
      for (const entry of pgLocationDocs) {
        const pgId = entry?.pg?._id;
        if (!pgId || !Array.isArray(entry.locations)) continue;

        for (const nested of entry.locations) {
          const loc = nested?.location;
          if (!loc?._id || !loc?.name?.trim()) continue;

          const existing = locMap.get(loc._id);
          if (existing) {
            if (!existing.pgIds.includes(pgId)) {
              existing.pgIds.push(pgId);
            }
          } else {
            locMap.set(loc._id, {
              _id: loc._id,
              name: loc.name.trim(),
              address: loc.address?.trim(),
              pgIds: [pgId],
            });
          }
        }
      }
    }

    const mapped = Array.from(locMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    if (mapped.length === 0) {
      return {
        locations: [...FALLBACK_LOCATION_FILTERS],
        source: "fallback",
      };
    }

    return {
      locations: mapped,
      source: "sanity",
    };
  } catch {
    return {
      locations: [...FALLBACK_LOCATION_FILTERS],
      source: "fallback",
    };
  }
}

export async function getRoomTypesSectionData(): Promise<{
  roomTypes: RoomTypeView[];
  pgRoomTypes: PgRoomTypeView[];
  locations: LocationFilterOption[];
}> {
  const [{ roomTypes }, { pgRoomTypes }, { locations }] = await Promise.all([
    getRoomTypes(),
    getPgRoomTypes(),
    getLocationFilterOptions(),
  ]);

  return { roomTypes, pgRoomTypes, locations };
}
