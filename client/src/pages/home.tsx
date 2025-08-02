import HeroSection from "@/components/hero-section";
import EventsSlideshow from "../components/events-slideshow";
//import QuickLinks from "@/components/quick-links";
import PrincipalMessage from "@/components/principal-message";
//import EventsCalendar from "@/components/events-calendar";
import ImageGallery from "@/components/image-gallery";
//import Testimonials from "@/components/testimonials";

export default function Home() {
  // TODO: Replace this with real events loading logic
  const events = []; // or fetch/useContext/useLoaderData, etc.

  return (
    <div>
      <HeroSection />
      <EventsSlideshow events={events} />
      <PrincipalMessage />
      <ImageGallery />
    </div>
  );
}
