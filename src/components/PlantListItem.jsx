import React from 'react';
import { SearchOutlined, HeartOutlined } from '@ant-design/icons';
import { StarIcon } from "@heroicons/react/24/solid";

export default function PlantListItem({ plant }) {
  const avgRating = plant.ratings && plant.ratings.length > 0
    ? Math.round(plant.ratings.reduce((sum, item) => sum + item.rating, 0) / plant.ratings.length)
    : 0;
  
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden transition-all hover:shadow-md">
      <a href={`/product/${plant.id}`}  className="flex flex-col md:flex-row">
        <div className="md:w-1/4 flex items-center overflow-hidden">
          <img 
            src={plant.image[0]} 
            alt={plant.name} 
            className="min-h-full object-cover"
          />
        </div>
        <div className="md:w-3/4 p-4">
          <h3 className="font-medium text-gray-800">{plant.name || 'Cây ngọc ngân'}</h3>
          <div className="flex items-center">
            <span className="text-yellow-400 flex py-1">
            {Array.from({ length: avgRating }).map((_, id) => <StarIcon key={id} className="size-3 text-yellow-400" />)
            }
            {
              Array.from({ length: 5 - avgRating }).map((_, id) => <StarIcon key={id} className="size-3 text-gray-400" />)
            }
            </span>
          </div>
          <p className="text-gray-600 mb-1 text-sm">{plant.description || 'Cây Ngọc ngân là loài cây đánh nửa mới phát triển từ món quà của tạo hóa tặng "Ngọc Ngân" (Variegated Money) khiến nó đẹp và phù hợp với nền tảng điều hòa.'}</p>
          <div className="flex items-center mt-1 gap-2">
            <span className="text-red-500 font-semibold">{plant.price || '279.000'} đ</span>
            <span className="text-gray-400 line-through text-sm">{plant.old_price} đ</span>
          </div>
          <div className="flex items-center mt-1 gap-2">
            <button className="bg-green-500 rounded-[50px] text-white py-1 px-6 rounded hover:bg-green-600 transition-colors">
              MUA NGAY
            </button>
            <button className="px-2 py-1 border rounded-full border-gray-300 rounded hover:bg-gray-100">
              <SearchOutlined />
            </button>
            <button className="px-2 py-1 border rounded-full border-gray-300 rounded hover:bg-gray-100">
              <HeartOutlined />
            </button>
          </div>
        </div>
      </a>
    </div>
  );
};
