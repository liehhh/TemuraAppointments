"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PhotoCarousel from "@/app/components/PhotoCarousel";

const Map = dynamic(() => import("@/app/components/Map"), {
  ssr: false,
  loading: () => <p>Loading map...</p>,
});

export default function Home() {
  const router = useRouter();
  const latitude = 41.788179706671315;
  const longitude = 44.752860391516656;

  const [mapHover, setMapHover] = useState(false);
  const [showCarousel, setShowCarousel] = useState(false);

  // Array of photos from static/app folder
  const photos = [
    "/images/photo1.png",
    "/images/photo2.png",
    "/images/photo3.png",
    "/images/photo4.png",
    "/images/photo5.png",
    "/images/photo6.png",
    "/images/photo7.png",
    "/images/photo8.png",
    "/images/photo9.png",
  ];

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (mapHover) {
      timer = setTimeout(() => {
        setShowCarousel(true);
      }, 1500);
    } else {
      setShowCarousel(false);
    }

    return () => clearTimeout(timer);
  }, [mapHover]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
      <div className="flex flex-col items-center justify-center py-20 px-8">
        <h1 className="text-6xl font-serif font-bold text-white mb-4 text-center tracking-tight">
          Welcome to Mr. Temura's Headquarters
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl text-center font-light italic">
          Where secrets are whispered and destinies are forged in shadow
        </p>
      </div>
      <div className="max-w-6xl mx-auto px-8 pb-20">
        <div className="bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-700">
          <h2 className="text-3xl font-serif font-semibold text-white mb-6">
            Our Location
          </h2>
          <div className="relative h-[400px]">
            <Map
              key="main-map"
              latitude={latitude}
              longitude={longitude}
              locationName="Mr. Temura's Headquarters"
              photos={photos}
            />
          </div>

          <div className="mt-8 text-center">
            <p className="text-lg text-gray-300 font-light mb-4">
              Dost thou wish to visit this hallowed place?
            </p>
            <button
              onClick={() => router.push("/schedule")}
              className="bg-white cursor-pointer text-black px-8 py-3 rounded-lg font-serif text-lg hover:bg-gray-200 transition-colors shadow-md"
            >
              Schedule a Meeting
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
