import Header from "./header";
import Footer from "./footer";
import NewsTicker from "../news-ticker";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <NewsTicker />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
