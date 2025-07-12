import { useQuery } from "@tanstack/react-query";
import type { News } from "@shared/schema";

export default function NewsTicker() {
  const { data: news = [], isLoading } = useQuery<News[]>({
    queryKey: ["/api/news"],
  });

  if (isLoading) {
    return (
      <div className="bg-dav-saffron text-white py-2">
        <div className="text-center">Loading news...</div>
      </div>
    );
  }

  return (
    <div className="bg-dav-saffron text-white py-2 overflow-hidden">
      <div className="ticker-animation whitespace-nowrap">
        {news.map((item, index) => (
          <span key={item.id} className="mx-8">
            {item.title}
          </span>
        ))}
      </div>
    </div>
  );
}
