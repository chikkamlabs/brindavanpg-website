import Header from "@/components/header";
import RoomDetailClient from "@/components/roomDetailClient";
import LifeAtBrindavanPgs from "@/components/lifeatbrindavanpgs";
import Footer from "@/components/footer";
import { getActivePgProperties } from "@/lib/pgPropertyStore";
import { getRoomTypesSectionData } from "@/lib/roomtypesStore";
import { getLifeAtBrindavanData } from "@/lib/lifeatStore";

interface RoomPageProps {
  searchParams: Promise<{ id?: string }>;
}

export default async function RoomPage({ searchParams }: RoomPageProps) {
  const { id } = await searchParams;

  const [{ properties }, { pgRoomTypes }, { utilities, amenities }] =
    await Promise.all([
      getActivePgProperties(),
      getRoomTypesSectionData(),
      getLifeAtBrindavanData(),
    ]);

  const selectedRoom =
    (id ? pgRoomTypes.find((room) => room._id === id) : undefined) ??
    pgRoomTypes[0];

  const matchedPg = properties.find(
    (pg) =>
      pg._id === selectedRoom.pg._id ||
      pg.name.toLowerCase() === selectedRoom.pg.name.toLowerCase()
  );

  return (
    <div className="min-h-screen flex flex-col bg-soft-mint text-deep-forest scroll-smooth">
      <Header />
      <main className="flex-1">
        <RoomDetailClient
          room={selectedRoom}
          pgProperty={matchedPg}
          pgProperties={properties}
          pgRoomTypes={pgRoomTypes}
        />
        <LifeAtBrindavanPgs utilities={utilities} amenities={amenities} />
      </main>
      <Footer />
    </div>
  );
}
