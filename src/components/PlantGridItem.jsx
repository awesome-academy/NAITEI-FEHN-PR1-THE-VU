import { MagnifyingGlassIcon, StarIcon } from "@heroicons/react/24/solid";

export default function PlantGridItem({ plant }) {
  const avgRating = plant.ratings && plant.ratings.length > 0
    ? Math.round(plant.ratings.reduce((sum, item) => sum + item.rating, 0) / plant.ratings.length)
    : 0;

  return (
    <div className="max-w-sm bg-white border border-gray-200 shadow-sm group relative">
      <a href={`/product/${plant.id}`} className="relative block cursor-auto">
        <img className="w-full opacity-100 group-hover:opacity-70" src={plant.image[0]} alt={plant.name} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 px-4 py-2 text-gray-900 font-medium flex items-center justify-center">
          <button className="bg-main text-white rounded-full px-5 py-2 cursor-pointer hover:bg-hover mr-3 text-xs">MUA NGAY</button>
          <button className="rounded-full p-2.5 bg-white cursor-pointer hover:bg-gray-100">
            <MagnifyingGlassIcon className="size-3" />
          </button>
        </div>

        {plant.tag && (
          <div className={`absolute top-2 left-2 rounded-full flex items-center justify-center w-10 h-10 p-2 text-xs text-white ${plant.tag === 'NEW' ? 'bg-main' : 'bg-red-600'}`}>
            {plant.tag}
          </div>
        )}
      </a>
      <div className="p-4">
        <a href={`/product/${plant.id}`}>
          <h5 className="tracking-tight text-center text-gray-900 ">{plant.name}</h5>
        </a>
        <div className="flex items-center justify-center my-1.5 space-x-1">
        {Array.from({ length: avgRating }).map((_, id) => <StarIcon key={id} className="size-3 text-yellow-400" />)
        }
        {
          Array.from({ length: 5 - avgRating }).map((_, id) => <StarIcon key={id} className="size-3 text-gray-400" />)
        }
        </div>

        <div className="flex items-center justify-center text-sm">
          <span className="text-red-500 font-semibold mr-3">{plant.price} đ</span>
          <span className="text-gray-500 line-through">{plant.old_price} đ</span>
        </div>
      </div>
    </div>
  );
}
