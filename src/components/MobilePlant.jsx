import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/solid";
import Plant from "./Plant";
import { useState } from "react";

export default function MobilePlant({ plants }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <div className="sm:hidden flex items-center justify-center relative">
      <Plant plant={plants[currentIndex]} />
      <button
        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-main p-2 rounded-full hover:bg-hover text-white cursor-pointer"
        onClick={() =>
          setCurrentIndex((currentIndex - 1 + plants.length) % plants.length)
        }
      >
        <ArrowLeftIcon className="size-4" />
      </button>
      <button
        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-main p-2 rounded-full hover:bg-hover text-white cursor-pointer"
        onClick={() => setCurrentIndex((currentIndex + 1) % plants.length)}
      >
        <ArrowRightIcon className="size-4" />
      </button>
    </div>
  );
}
