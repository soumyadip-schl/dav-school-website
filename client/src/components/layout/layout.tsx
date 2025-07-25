import Header from "./header";
import Footer from "./footer";
import NewsTicker from "../news-ticker";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Sticky header, matches main body width, avoids extra right-side space and wraps content */}
      <div className="sticky top-0 z-50 w-full bg-white shadow">
        <div className="mx-auto px-4 sm:px-8 max-w-screen-xl overflow-x-auto">
          <Header />
        </div>
      </div>
      <NewsTicker />
      {/* Main content container matches the header width and padding */}
      <main className="flex-1 w-full mx-auto px-4 sm:px-8 max-w-screen-xl">
        {children}
      </main>
      <Footer />
    </div>
  );
}
