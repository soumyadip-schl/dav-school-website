import { Link } from "wouter";
import { quickLinksData } from "@/lib/data";

export default function QuickLinks() {
  return (
    <section className="py-16 bg-dav-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {quickLinksData.map((link, index) => (
            <Link key={index} href={link.href}>
              <div className="bg-white p-6 rounded-xl shadow-md hover-lift cursor-pointer">
                <div className="text-dav-saffron text-4xl mb-4">
                  <i className={link.icon}></i>
                </div>
                <h3 className="text-xl font-semibold mb-2">{link.title}</h3>
                <p className="text-gray-600">{link.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
