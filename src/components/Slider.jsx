import { useState, useEffect } from "react";
import Slider1 from "../assets/slide1.png";

const images = [Slider1, Slider1, Slider1];

export default function Slider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1,
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="hidden sm:block w-full">
      <div className="relative">
        <img
          src={images[currentIndex]}
          alt={`Slide ${currentIndex + 1}`}
          className="max-w-full transition-opacity duration-500 ease-in-out"
        />

        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex justify-center space-x-2">
          {images.map((_, index) => (
            <span
              key={index}
              className={`h-3 w-3 rounded-full ${
                index === currentIndex ? "bg-main" : "bg-white"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
