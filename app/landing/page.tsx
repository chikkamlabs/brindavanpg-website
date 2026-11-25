import Header from "@/components/header";
import HeroSection from "@/components/herosection";
import OurPgs from "@/components/ourpgs";
import RoomTypes from "@/components/roomtypes";
import LifeAtBrindavanPgs from "@/components/lifeatbrindavanpgs";
import ContactUs from "@/components/contactus";
import FaqSection from "@/components/faqSection";
import Footer from "@/components/footer";
import { getHomeScreenData } from "@/lib/homescreen";
import { getActivePgProperties } from "@/lib/pgPropertyStore";
import { getRoomTypesSectionData } from "@/lib/roomtypesStore";
import { getLifeAtBrindavanData } from "@/lib/lifeatStore";
import { getFaqsData } from "@/lib/faqsStore";

export default async function LandingPage() {
  const [
    { slides },
    { properties },
    { roomTypes, pgRoomTypes, locations },
    { utilities, amenities },
    { faqs },
  ] = await Promise.all([
    getHomeScreenData(),
    getActivePgProperties(),
    getRoomTypesSectionData(),
    getLifeAtBrindavanData(),
    getFaqsData(),
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-soft-mint text-deep-forest scroll-smooth">
      <Header />
      <main className="flex-1">
        <HeroSection
          slides={slides}
          pgProperties={properties}
          pgRoomTypes={pgRoomTypes}
        />
        <OurPgs properties={properties.slice(0, 2)} />
        <RoomTypes
          roomTypes={roomTypes}
          pgRoomTypes={pgRoomTypes}
          pgProperties={properties}
          locations={locations}
        />
        <LifeAtBrindavanPgs utilities={utilities} amenities={amenities} />
        <ContactUs pgProperties={properties} pgRoomTypes={pgRoomTypes} />
        <FaqSection faqs={faqs} />
      </main>
      <Footer />
    </div>
  );
}
