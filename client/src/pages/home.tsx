import HeroSection from "@/components/hero-section";
import QuickLinks from "@/components/quick-links";
import PrincipalMessage from "@/components/principal-message";
import EventsCalendar from "@/components/events-calendar";
import ImageGallery from "@/components/image-gallery";
import Testimonials from "@/components/testimonials";

export default function Home() {
  return (
    <div>
      <HeroSection />
       <QuickLinks />
      <PrincipalMessage />
      <EventsCalender/>
      <ImageGallery />
    <Testimonials />
    </div>
  );
}
