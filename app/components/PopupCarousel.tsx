'use client'

import { useState, useEffect } from 'react';

interface PopupCarouselProps {
  photos: string[];
  locationName: string;
}

export default function PopupCarousel({ photos, locationName }: PopupCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (photos.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = (prev + 1) % photos.length;
        console.log('Switching to photo:', next);
        return next;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [photos.length]);

  return (
    <div className="p-1 bg-gray-900">
      <h3 className="text-sm font-serif font-bold mb-1 text-white">{locationName}</h3>
      {photos.length > 0 && (
        <div className="relative">
          <div className="relative h-20 bg-black overflow-hidden rounded border border-gray-700">
            <img
              src={photos[currentIndex]}
              alt={`Photo ${currentIndex + 1}`}
              className="w-full h-full object-contain"
              key={currentIndex}
            />
          </div>
          <div className="mt-1 text-center text-xs text-gray-300 font-semibold">
            {currentIndex + 1} / {photos.length}
          </div>
        </div>
      )}
    </div>
  );
}
