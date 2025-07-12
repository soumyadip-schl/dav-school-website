import { useState } from "react";
import { cn } from "@/lib/utils";
import { galleryImages } from "@/lib/data";

export default function ImageGallery() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const categories = ["all", "sports", "cultural", "labs"];

  const filteredImages = selectedCategory === "all" 
    ? galleryImages 
    : galleryImages.filter(img => img.category === selectedCategory);

  const openLightbox = (src: string) => {
    setLightboxImage(src);
  };

  const closeLightbox = () => {
    setLightboxImage(null);
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-dav-maroon mb-4">School Gallery</h2>
          <p className="text-gray-600">Glimpses of life at DAV Public School</p>
        </div>
        
        {/* Filter buttons */}
        <div className="flex flex-wrap justify-center mb-8 space-x-4">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={cn(
                "px-6 py-2 rounded-full font-medium mb-2 transition-colors",
                selectedCategory === category
                  ? "bg-dav-saffron text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-dav-saffron hover:text-white"
              )}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredImages.map((image) => (
            <div
              key={image.id}
              className="relative hover-lift cursor-pointer"
              onClick={() => openLightbox(image.src)}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-64 object-cover rounded-xl shadow-md"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-opacity rounded-xl flex items-center justify-center">
                <i className="fas fa-search-plus text-white text-2xl opacity-0 hover:opacity-100 transition-opacity"></i>
              </div>
            </div>
          ))}
        </div>
        
        {/* Lightbox */}
        {lightboxImage && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
            onClick={closeLightbox}
          >
            <div className="relative max-w-4xl max-h-4xl p-4">
              <img
                src={lightboxImage}
                alt="Gallery image"
                className="max-w-full max-h-full rounded-lg"
              />
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
