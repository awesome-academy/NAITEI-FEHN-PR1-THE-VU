import Plant1 from "../assets/spx2-1.png";
import { MagnifyingGlassIcon, StarIcon } from "@heroicons/react/24/solid";
import formatMoney from "../helper/FormatMoney";

export default function Plant({ plant }) {
  const rating =
    plant.average_rating !== -1 ? (
      <div className="flex items-center justify-center my-1.5 space-x-1">
        {Array.from({ length: Math.round(plant.average_rating) }).map(
          (_, id) => (
            <StarIcon key={id} className="size-3 text-amber-400" />
          ),
        )}
        {Array.from({ length: 5 - Math.round(plant.average_rating) }).map(
          (_, id) => (
            <StarIcon key={id} className="size-3 text-gray-400" />
          ),
        )}
      </div>
    ) : (
      <span className="text-xs text-center text-gray-400">
        Chưa có đánh giá
      </span>
    );

  const getTag = () => {
    if (plant.is_new === true) {
      return (
        <div className="absolute top-2 left-2 md:top-3 md:left-3 rounded-full flex items-center justify-center size-8 md:size-10 p-2 text-[0.6rem] md:text-xs text-white  bg-main">
          NEW
        </div>
      );
    } else if (plant.price < plant.old_price) {
      return (
        <div className="absolute top-2 left-2 md:top-3 md:left-3 rounded-full flex items-center justify-center size-8 md:size-10 p-2 text-[0.6rem] md:text-xs text-white  bg-red-600">
          {`-${Math.round(((plant.old_price - plant.price) / plant.old_price) * 100)}%`}
        </div>
      );
    } else {
      return;
    }
  };

  return (
    <div className="max-w-sm sm:max-w-none bg-white border border-gray-200 shadow-sm group relative">
      <div className="relative">
        <img
          className="w-full opacity-100 group-hover:opacity-70"
          src={plant.image[0] || Plant1}
          alt={plant.name}
        />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 px-4 py-2 text-gray-900 font-medium flex items-center justify-center">
          <button className="bg-main text-white rounded-full px-5 py-2 cursor-pointer hover:bg-hover mr-3 text-[0.6rem] md:text-xs truncate">
            MUA NGAY
          </button>
          <a href={`/product/${plant.id}`}>
            <button className="rounded-full p-2.5 bg-white cursor-pointer hover:bg-gray-100">
              <MagnifyingGlassIcon className="size-3" />
            </button>
          </a>
        </div>
        {getTag()}
      </div>

      <div className="p-4 text-center">
        <a href={`/product/${plant.id}`}>
          <h5 className="tracking-tight text-center text-gray-900 hover:text-main font-bold sm:font-normal truncate">
            {plant.name}
          </h5>
        </a>
        {rating}
        <div className="flex items-center justify-center text-xs md:text-sm mt-1">
          <span className="text-red-500 font-semibold mr-3">
            {formatMoney(plant.price)} đ
          </span>
          <span className="text-gray-500 line-through">
            {formatMoney(plant.old_price)} đ
          </span>
        </div>
      </div>
    </div>
  );
}
