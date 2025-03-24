import {
  BriefcaseIcon,
  ChartBarIcon,
  ChevronDownIcon,
  RectangleStackIcon,
  TagIcon,
  UserCircleIcon,
  UserGroupIcon,
} from "@heroicons/react/24/solid";
import { useState } from "react";

export default function UserDropdown() {
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  return (
    <div
      className="flex items-center justify-center hover:text-gray-300 cursor-pointer"
      onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
    >
      <UserCircleIcon className="size-8" />
      {isUserDropdownOpen && (
        <ul className="absolute top-10 right-3 rounded-lg py-1 border border-gray-200 flex flex-col items-start z-50 text-gray-500 bg-white text-sm text-left">
          <li className="w-full px-2 py-2 hover:bg-gray-100 hover:text-main">
            <a href="/admin" className="flex items-center">
              <ChartBarIcon className="size-3 mr-1" />
              Thống kê
            </a>
          </li>
          <li className="w-full px-2 py-2 hover:bg-gray-100 hover:text-main">
            <a href="/admin/users" className="flex items-center">
              <UserGroupIcon className="size-3 mr-1" />
              Người dùng
            </a>
          </li>
          <li className="w-full px-2 py-2 hover:bg-gray-100 hover:text-main">
            <a href="/admin/categories" className="flex items-center">
              <TagIcon className="size-3 mr-1" />
              Danh mục sản phẩm
            </a>
          </li>
          <li className="w-full px-2 py-2 hover:bg-gray-100 hover:text-main">
            <a href="#" className="flex items-center">
              <BriefcaseIcon className="size-3 mr-1" />
              Sản phẩm
            </a>
          </li>
          <li className="w-full px-2 py-2 hover:bg-gray-100 hover:text-main">
            <a href="/admin/orders" className="flex items-center">
              <RectangleStackIcon className="size-3 mr-1" />
              Đơn hàng
            </a>
          </li>
        </ul>
      )}
    </div>
  );
}
