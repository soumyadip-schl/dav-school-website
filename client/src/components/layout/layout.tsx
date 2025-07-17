import Header from "./header";
import Footer from "./footer";
import NewsTicker from "../news-ticker";
import Navbar from "../Navbar"; // Add/adjust path if your Navbar is elsewhere

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen w-full max-w-screen bg-white dark:bg-black text-black dark:text-white overflow-x-hidden m-0 p-0 flex flex-col">
      <Navbar />
      <Header />
      <NewsTicker />
      <main className="flex-1 pt-16">
        {children}
      </main>
      <Footer />
    </div>
  );
}
