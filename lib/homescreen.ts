import { homeScreensQuery, type HomeScreen } from "./schemas";

export interface HomeScreenSlide {
  _id: string;
  imageUrl: string;
  tag_line: string;
  display_order: number;
  lqip?: string;
}

export const FALLBACK_HOMESCREEN_ITEMS: HomeScreenSlide[] = [
  {
    _id: "fallback-homescreen-1",
    imageUrl: "/images/homescreen/pg_cozy_bedroom.jpg",
    tag_line: "Sunlit private & shared rooms crafted for peaceful rest",
    display_order: 1,
  },
  {
    _id: "fallback-homescreen-2",
    imageUrl: "/images/homescreen/pg_homely_dining.jpg",
    tag_line: "Fresh, hygienic home-style meals prepared daily",
    display_order: 2,
  },
  {
    _id: "fallback-homescreen-3",
    imageUrl: "/images/homescreen/pg_community_lounge.jpg",
    tag_line: "Warm community lounges & dedicated study spaces",
    display_order: 3,
  },
  {
    _id: "fallback-homescreen-4",
    imageUrl: "/images/homescreen/pg_building_exterior.jpg",
    tag_line: "Safe, well-connected residences in prime neighborhoods",
    display_order: 4,
  },
  {
    _id: "fallback-homescreen-5",
    imageUrl: "/images/homescreen/pg_spotless_interior.jpg",
    tag_line: "Daily housekeeping & spotless living standards",
    display_order: 5,
  },
];

export function sortHomeScreensByOrder<
  T extends { display_order?: number }
>(items: T[]): T[] {
  return [...items].sort((a, b) => {
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

export async function getHomeScreenData(): Promise<{
  slides: HomeScreenSlide[];
  source: "sanity" | "fallback";
}> {
  if (!isSanityConfigured()) {
    return {
      slides: sortHomeScreensByOrder(FALLBACK_HOMESCREEN_ITEMS),
      source: "fallback",
    };
  }

  try {
    const { sanityClient, urlFor } = await import("./sanity");
    const docs = await sanityClient.fetch<HomeScreen[]>(
      homeScreensQuery,
      {},
      { next: { revalidate: 60 } }
    );

    if (!Array.isArray(docs) || docs.length === 0) {
      return {
        slides: sortHomeScreensByOrder(FALLBACK_HOMESCREEN_ITEMS),
        source: "fallback",
      };
    }

    const sortedDocs = sortHomeScreensByOrder(docs);
    const mapped: HomeScreenSlide[] = [];

    sortedDocs.forEach((doc, index) => {
      let imageUrl = doc.image?.asset?.url ?? "";
      if (!imageUrl && doc.image?.asset) {
        try {
          imageUrl = urlFor(doc.image).width(1200).auto("format").url();
        } catch {
          imageUrl = "";
        }
      }

      if (imageUrl) {
        mapped.push({
          _id: doc._id,
          imageUrl,
          tag_line:
            doc.tag_line?.trim() ||
            FALLBACK_HOMESCREEN_ITEMS[index % FALLBACK_HOMESCREEN_ITEMS.length]
              .tag_line,
          display_order:
            typeof doc.display_order === "number"
              ? doc.display_order
              : index + 1,
          lqip: doc.image?.asset?.metadata?.lqip,
        });
      }
    });

    if (mapped.length === 0) {
      return {
        slides: sortHomeScreensByOrder(FALLBACK_HOMESCREEN_ITEMS),
        source: "fallback",
      };
    }

    return {
      slides: sortHomeScreensByOrder(mapped),
      source: "sanity",
    };
  } catch {
    return {
      slides: sortHomeScreensByOrder(FALLBACK_HOMESCREEN_ITEMS),
      source: "fallback",
    };
  }
}
