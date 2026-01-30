'use client'

import { useState, useEffect } from 'react';

interface PhotoCarouselProps {
  photos: string[];
  show: boolean;
}

export default function PhotoCarousel({ photos, show }: PhotoCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!show || photos.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % photos.length);
    }, 3000); // Change photo every 3 seconds

    return () => clearInterval(interval);
  }, [show, photos.length]);

  if (photos.length === 0 || !show) return null;

  return (
    <div
      className={`absolute top-0 left-0 w-full h-full bg-white rounded-lg shadow-2xl overflow-hidden z-10 transition-transform duration-700 ease-in-out ${
        show ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="relative w-full h-full">
        {photos.map((photo, index) => (
          <img
            key={photo}
            src={photo}
            alt={`Photo ${index + 1}`}
            className={`absolute inset-0 w-full h-full object-contain p-4 transition-all duration-1000 ${
              index === currentIndex
                ? 'opacity-100 translate-x-0'
                : index < currentIndex
                  ? 'opacity-0 -translate-x-full'
                  : 'opacity-0 translate-x-full'
            }`}
          />
        ))}

        {/* Photo counter */}
        <div className="absolute bottom-4 right-4 bg-slate-900 text-white px-3 py-1 rounded-full text-sm font-serif">
          {currentIndex + 1} / {photos.length}
        </div>
      </div>
    </div>
  );
}
