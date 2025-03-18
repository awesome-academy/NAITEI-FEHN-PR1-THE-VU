import Plant1 from "../assets/spx2-2.png";
import { StarIcon } from "@heroicons/react/24/solid";
import formatMoney from "../helper/FormatMoney";

export default function PlantSmall({ plant }) {
  const rating =
    plant.average_rating !== -1 ? (
      <div className="flex items-center justify-start my-1.5 space-x-1">
        {Array.from({ length: Math.round(plant.average_rating) }).map(
          (_, id) => (
            <StarIcon key={id} className="size-3 sm:size-2.5 text-amber-400" />
          ),
        )}
        {Array.from({ length: 5 - Math.round(plant.average_rating) }).map(
          (_, id) => (
            <StarIcon key={id} className="size-3 sm:size-2.5 text-gray-400" />
          ),
        )}
      </div>
    ) : (
      <span className="text-xs text-gray-400 my-1 truncate">
        Chưa có đánh giá
      </span>
    );

  return (
    <div className="bg-white border border-gray-200 group relative grid grid-flow-col grid-cols-3">
      <div className="p-2 col-span-1 flex items-center">
        <a href={`/product/${plant.id}`}>
          <img
            className="hover:opacity-70"
            src={plant.image[0] || Plant1}
            alt={plant.name}
          />
        </a>
      </div>
      <div className="p-2 col-span-2 flex flex-col justify-start">
        <a href={`/product/${plant.id}`}>
          <h5 className="tracking-tight text-left sm:text-sm text-gray-900 hover:text-main truncate">
            {plant.name}
          </h5>
        </a>
        {rating}
        <span className="text-red-500 font-semibold mr-3 text-sm sm:text-xs">
          {formatMoney(plant.price)} đ
        </span>
      </div>
    </div>
  );
}
