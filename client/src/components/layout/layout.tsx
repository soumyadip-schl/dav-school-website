import Header from "./header";
import Footer from "./footer";
import NewsTicker from "../news-ticker";
import Navbar from "../navbar";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen w-screen overflow-x-hidden m-0 p-0 flex flex-col bg-white dark:bg-black text-black dark:text-white">
      <Navbar />
      <Header />
      <NewsTicker />
      <main className="flex-1 pt-16 w-full">
        {children}
      </main>
      <Footer />
    </div>
  );
}
