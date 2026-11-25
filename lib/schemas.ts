import { groq } from "next-sanity";

export const SCHEMA_TYPES = {
  pgProperty: "pgProperty",
  pgImages: "pgImages",
  locations: "locations",
  pgLocations: "pgLocations",
  roomTypes: "roomTypes",
  pgRoomTypes: "pgRoomTypes",
  utilities: "utilities",
  pgUtilities: "pgUtilities",
  amenity: "amenity",
  faq: "faq",
  homeScreen: "homeScreen",
} as const;

export type SchemaTypeName = (typeof SCHEMA_TYPES)[keyof typeof SCHEMA_TYPES];

export interface SanityImageAssetMetadata {
  dimensions?: {
    width: number;
    height: number;
    aspectRatio: number;
  };
  lqip?: string;
}

export interface SanityImageField {
  _type?: "image";
  _key?: string;
  asset?: {
    _id: string;
    url: string;
    metadata?: SanityImageAssetMetadata;
  } | null;
  crop?: {
    _type?: string;
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
  };
  hotspot?: {
    _type?: string;
    x?: number;
    y?: number;
    height?: number;
    width?: number;
  };
}

export interface PortableTextSpan {
  _key?: string;
  _type: "span";
  text: string;
  marks?: string[];
}

export interface PortableTextBlock {
  _key?: string;
  _type: "block";
  style?: string;
  listItem?: string;
  level?: number;
  markDefs?: Array<{
    _key: string;
    _type: string;
    [key: string]: unknown;
  }>;
  children: PortableTextSpan[];
}

export type PgGender = "men" | "women" | "unisex" | "co-living";

export interface PgProperty {
  _id: string;
  _type: "pgProperty";
  name: string;
  subheading?: string;
  description?: PortableTextBlock[];
  mobile?: string;
  whatsapp?: string;
  location_url?: string;
  address?: string;
  cover_image: SanityImageField;
  rating?: number;
  gender: PgGender;
  is_featured?: boolean;
  status?: boolean;
  display_order?: number;
}

export type PgGalleryTag =
  | "exterior"
  | "interior"
  | "bedroom"
  | "bathroom"
  | "dining"
  | "other";

export interface PgGalleryItem {
  _key?: string;
  image: SanityImageField;
  display_order?: number;
  tag?: PgGalleryTag;
}

export interface PgImages {
  _id: string;
  _type: "pgImages";
  pg: Pick<PgProperty, "_id" | "name">;
  gallery: PgGalleryItem[];
}

export interface LocationItem {
  _id: string;
  _type: "locations";
  name: string;
  address?: string;
  map_link?: string;
}

export interface PgNearbyLocationItem {
  _key?: string;
  location: LocationItem;
  distance: string;
}

export interface PgLocations {
  _id: string;
  _type: "pgLocations";
  pg: Pick<PgProperty, "_id" | "name">;
  title?: string;
  locations?: PgNearbyLocationItem[];
}

export interface RoomType {
  _id: string;
  _type: "roomTypes";
  name: string;
  beds_count: number;
  ac?: boolean;
  cover_image?: SanityImageField;
}

export interface PgRoomType {
  _id: string;
  _type: "pgRoomTypes";
  pg: Pick<PgProperty, "_id" | "name">;
  room_type: RoomType;
  price: number;
  actual_price?: number;
  deposit?: number;
  description?: string;
  cover_image?: SanityImageField;
  images?: SanityImageField[];
  status?: boolean;
  display_order?: number;
}

export interface UtilityItem {
  _id: string;
  _type: "utilities";
  title: string;
}

export interface PgUtilityEntry {
  _key?: string;
  utility: UtilityItem;
  display_order?: number;
}

export interface PgUtilities {
  _id: string;
  _type: "pgUtilities";
  pg: Pick<PgProperty, "_id" | "name">;
  utilities?: PgUtilityEntry[];
}

export interface Amenity {
  _id: string;
  _type: "amenity";
  title: string;
  subheading?: string;
  cover_image?: SanityImageField;
}

export interface Faq {
  _id: string;
  _type: "faq";
  question: string;
  answer: PortableTextBlock[];
  display_order?: number;
  pg?: Pick<PgProperty, "_id" | "name"> | null;
}

export interface HomeScreen {
  _id: string;
  _type: "homeScreen";
  image: SanityImageField;
  tag_line?: string;
  display_order?: number;
}

export interface PgPropertyDetail extends PgProperty {
  gallery?: PgGalleryItem[];
  nearby_locations?: PgLocations | null;
  room_types?: PgRoomType[];
  utilities?: PgUtilities | null;
  faqs?: Faq[];
}

const imageProjection = /* groq */ `{
  ...,
  asset->{
    _id,
    url,
    metadata {
      dimensions,
      lqip
    }
  }
}`;

const pgReferenceProjection = /* groq */ `{
  _id,
  name
}`;

// 1. pgProperty queries
export const pgPropertiesQuery = groq`*[_type == "pgProperty"] {
  _id,
  _type,
  name,
  subheading,
  description,
  mobile,
  whatsapp,
  location_url,
  address,
  cover_image ${imageProjection},
  rating,
  gender,
  is_featured,
  status,
  display_order
}`;

export const activePgPropertiesQuery = groq`*[_type == "pgProperty" && status == true] {
  _id,
  _type,
  name,
  subheading,
  description,
  mobile,
  whatsapp,
  location_url,
  address,
  cover_image ${imageProjection},
  rating,
  gender,
  is_featured,
  status,
  display_order
}`;

export const featuredPgPropertiesQuery = groq`*[_type == "pgProperty" && status == true && is_featured == true] {
  _id,
  _type,
  name,
  subheading,
  description,
  mobile,
  whatsapp,
  location_url,
  address,
  cover_image ${imageProjection},
  rating,
  gender,
  is_featured,
  status,
  display_order
}`;

export const pgPropertyByIdQuery = groq`*[_type == "pgProperty" && _id == $pgId][0] {
  _id,
  _type,
  name,
  subheading,
  description,
  mobile,
  whatsapp,
  location_url,
  address,
  cover_image ${imageProjection},
  rating,
  gender,
  is_featured,
  status,
  display_order,
  "gallery": *[_type == "pgImages" && pg._ref == ^._id][0].gallery[] {
    _key,
    display_order,
    tag,
    image ${imageProjection}
  },
  "nearby_locations": *[_type == "pgLocations" && pg._ref == ^._id][0] {
    _id,
    _type,
    title,
    "locations": locations[] {
      _key,
      distance,
      "location": location->{
        _id,
        _type,
        name,
        address,
        map_link
      }
    }
  },
  "room_types": *[_type == "pgRoomTypes" && pg._ref == ^._id && status == true] {
    _id,
    _type,
    price,
    actual_price,
    deposit,
    description,
    cover_image ${imageProjection},
    images[] ${imageProjection},
    status,
    display_order,
    "room_type": room_type->{
      _id,
      _type,
      name,
      beds_count,
      ac,
      cover_image ${imageProjection}
    }
  },
  "utilities": *[_type == "pgUtilities" && pg._ref == ^._id][0] {
    _id,
    _type,
    "utilities": utilities[] {
      _key,
      display_order,
      "utility": utility->{
        _id,
        _type,
        title
      }
    }
  },
  "faqs": *[_type == "faq" && pg._ref == ^._id] {
    _id,
    _type,
    question,
    answer,
    display_order
  }
}`;

// 2. pgImages queries
export const pgImagesQuery = groq`*[_type == "pgImages"] {
  _id,
  _type,
  "pg": pg-> ${pgReferenceProjection},
  gallery[] {
    _key,
    display_order,
    tag,
    image ${imageProjection}
  }
}`;

export const pgImagesByPgQuery = groq`*[_type == "pgImages" && pg._ref == $pgId][0] {
  _id,
  _type,
  "pg": pg-> ${pgReferenceProjection},
  gallery[] {
    _key,
    display_order,
    tag,
    image ${imageProjection}
  }
}`;

// 3. locations queries
export const locationsQuery = groq`*[_type == "locations"] {
  _id,
  _type,
  name,
  address,
  map_link
}`;

// 4. pgLocations queries
export const pgLocationsQuery = groq`*[_type == "pgLocations"] {
  _id,
  _type,
  "pg": pg-> ${pgReferenceProjection},
  title,
  locations[] {
    _key,
    distance,
    "location": location->{
      _id,
      _type,
      name,
      address,
      map_link
    }
  }
}`;

export const pgLocationsByPgQuery = groq`*[_type == "pgLocations" && pg._ref == $pgId][0] {
  _id,
  _type,
  "pg": pg-> ${pgReferenceProjection},
  title,
  locations[] {
    _key,
    distance,
    "location": location->{
      _id,
      _type,
      name,
      address,
      map_link
    }
  }
}`;

// 5. roomTypes queries
export const roomTypesQuery = groq`*[_type == "roomTypes"] | order(name asc) {
  _id,
  _type,
  name,
  beds_count,
  ac,
  cover_image ${imageProjection}
}`;

// 6. pgRoomTypes queries
export const pgRoomTypesQuery = groq`*[_type == "pgRoomTypes" && status == true] {
  _id,
  _type,
  "pg": pg-> ${pgReferenceProjection},
  "room_type": room_type->{
    _id,
    _type,
    name,
    beds_count,
    ac,
    cover_image ${imageProjection}
  },
  price,
  actual_price,
  deposit,
  description,
  cover_image ${imageProjection},
  images[] ${imageProjection},
  status,
  display_order
}`;

export const pgRoomTypesByPgQuery = groq`*[_type == "pgRoomTypes" && pg._ref == $pgId && status == true] {
  _id,
  _type,
  "pg": pg-> ${pgReferenceProjection},
  "room_type": room_type->{
    _id,
    _type,
    name,
    beds_count,
    ac,
    cover_image ${imageProjection}
  },
  price,
  actual_price,
  deposit,
  description,
  cover_image ${imageProjection},
  images[] ${imageProjection},
  status,
  display_order
}`;

// 7. utilities queries
export const utilitiesQuery = groq`*[_type == "utilities"] {
  _id,
  _type,
  title
}`;

// 8. pgUtilities queries
export const pgUtilitiesQuery = groq`*[_type == "pgUtilities"] {
  _id,
  _type,
  "pg": pg-> ${pgReferenceProjection},
  utilities[] {
    _key,
    display_order,
    "utility": utility->{
      _id,
      _type,
      title
    }
  }
}`;

export const pgUtilitiesByPgQuery = groq`*[_type == "pgUtilities" && pg._ref == $pgId][0] {
  _id,
  _type,
  "pg": pg-> ${pgReferenceProjection},
  utilities[] {
    _key,
    display_order,
    "utility": utility->{
      _id,
      _type,
      title
    }
  }
}`;

// 9. amenity queries
export const amenitiesQuery = groq`*[_type == "amenity"] {
  _id,
  _type,
  title,
  subheading,
  cover_image ${imageProjection}
}`;

// 10. faq queries
export const faqsQuery = groq`*[_type == "faq"] {
  _id,
  _type,
  question,
  answer,
  display_order,
  "pg": pg-> ${pgReferenceProjection}
}`;

export const globalFaqsQuery = groq`*[_type == "faq" && !defined(pg)] {
  _id,
  _type,
  question,
  answer,
  display_order
}`;

export const pgFaqsByPgQuery = groq`*[_type == "faq" && pg._ref == $pgId] {
  _id,
  _type,
  question,
  answer,
  display_order,
  "pg": pg-> ${pgReferenceProjection}
}`;

// 11. homeScreen queries
export const homeScreensQuery = groq`*[_type == "homeScreen"] {
  _id,
  _type,
  image ${imageProjection},
  tag_line,
  display_order
}`;
