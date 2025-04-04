import { useState, useEffect, useRef } from "react";
import {
  Bars3Icon,
  ChevronDownIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  PhoneIcon,
  ShoppingCartIcon,
  UserIcon,
  UserPlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import FacebookIcon from "../icons/FacebookIcon";
import TiktokIcon from "../icons/TiktokIcon";
import XIcon from "../icons/XIcon";
import Logo from "../assets/logo.png";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { setSearchQuery } from "../store/productSlice";
import NotificationDropdown from './NotificationDropdown';

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobileHeaderDisplayed, setIsMobileHeaderDisplayed] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const userMobileMenuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const imageHeight =
        document.getElementById("header-image")?.offsetHeight || 0;
      setIsSticky(window.scrollY > imageHeight);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      dispatch(setSearchQuery(searchTerm));
      navigate("/products");
    }
  };

  return (
    <header>
      {/* PC layout */}
      <div className="hidden sm:block bg-black">
        <div className="flex justify-between items-center text-gray-400 text-sm max-w-5xl m-auto bg-black">
          <div className="flex items-center justify-start">
            <ClockIcon className="size-4 mr-1" />
            <span className="mr-6">
              Giờ mở cửa: 8:00 - 18:00 Thứ hai - Chủ nhật
            </span>
            <div className="p-2.5 border-l-[0.5px] border-gray-700 hover:text-white">
              <a href="#">
                <FacebookIcon />
              </a>
            </div>
            <div className="p-2.5 border-l-[0.5px] border-gray-700 hover:text-white">
              <a href="#">
                <TiktokIcon />
              </a>
            </div>
            <div className="p-2.5 border-x-[0.5px] border-gray-700 hover:text-white">
              <a href="#">
                <XIcon />
              </a>
            </div>
          </div>
          <div className="flex">
            <a
              href="/login"
              className="flex justify-center items-center p-2.5 border-l-[0.5px] border-gray-700 hover:text-white"
            >
              <UserIcon className="size-4 mr-1" />
              <span>Đăng nhập</span>
            </a>
            <a
              href="/register"
              className="flex justify-center items-center p-2.5 border-x-[0.5px] border-gray-700 hover:text-white"
            >
              <UserPlusIcon className="size-4 mr-1" />
              <span>Đăng ký</span>
            </a>

            <div className="hidden sm:block relative" ref={userMenuRef}>
              <button
                className="flex justify-center items-center p-2.5 hover:text-white"
                onClick={toggleUserMenu}
              >
                Xin chào, Nguyễn Văn A!
                <div className="w-6 h-6 rounded-full ml-2 bg-gray-600 flex items-center justify-center">
                  <UserIcon className="size-4" />
                </div>
              </button>
              
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
                  <div className="py-1">
                    <a 
                      href="/order-history" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Lịch sử mua hàng
                    </a>
                    <a 
                      href="/logout" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Đăng xuất
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-[#F2F2F2]">
          <div className="flex justify-between items-center text-gray-700 text-sm max-w-5xl m-auto">
            <img src={Logo} alt="logo" className="min-h-[50px] lg:mr-10" />
            <div className="p-2.5">
              <p className="flex justify-start items-center ml-2.5 mb-2 font-normal">
                <PhoneIcon className="size-3 lg:size-4 mr-1" />
                <span className="text-[14px] md:text-sm lg:text-base">
                  HỖ TRỢ: (04) 6674 2322 - (04) 3786 8904
                </span>
              </p>

              <div className="flex items-center font-normal">
                <form className="max-w-lg mx-auto" onSubmit={handleSearch}>
                  <div className="flex">
                    <div className="relative w-full">
                      <input
                        type="search"
                        id="search-dropdown"
                        className="block p-2 md:p-2.5 w-36 md:w-56 lg:w-96 text-sm text-gray-900 bg-gray-50 rounded-full border-s-2 border border-gray-300"
                        placeholder="Tìm kiếm..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <button
                        type="submit"
                        className="absolute top-1/2 -translate-y-1/2 end-0 p-2 z-10 md:p-2.5 rounded-r-full text-sm font-medium border-l border-l-gray-300 hover:text-gray-500 cursor-pointer"
                      >
                        <MagnifyingGlassIcon className="size-3 md:size-4" />
                      </button>
                    </div>
                  </div>
                </form>

                <a
                  href="/cart"
                  className="flex items-center justify-between ml-2 text-sm hover:text-gray-400"
                >
                  <ShoppingCartIcon className="size-4 md:size-6 mr-1" />
                  <span className="text-sm">0 Sản phẩm</span>
                </a>
                <div className="ml-4">
                  <NotificationDropdown />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-main">
          <div className="flex justify-start items-center font-semibold text-sm max-w-5xl m-auto text-white">
            {/* <div className="flex items-center justify-center">
            <Bars3Icon className="size-4 md:size-6 mr-4" />
          </div> */}
            <ul className="flex items-start text-xs md:text-sm text-left font-normal">
              <li className="py-2.5 px-4 hover:bg-hover text-white">
                <a href="/">TRANG CHỦ</a>
              </li>
              <li className="py-2.5 px-4 hover:bg-hover">
                <a href="#">GIỚI THIỆU</a>
              </li>
              <li className="py-2.5 px-4 hover:bg-[#36A66D]">
                <a href="/products" className="flex items-center">
                  SẢN PHẨM
                  <span>
                    <ChevronDownIcon className="size-4 ml-1" />
                  </span>
                </a>
              </li>
              <li className="py-2.5 px-4 hover:bg-hover">
                <a href="#" className="flex items-center">
                  SẢN PHẨM MỚI
                  <span>
                    <ChevronDownIcon className="size-4 ml-1" />
                  </span>
                </a>
              </li>
              <li className="py-2.5 px-4 hover:bg-hover">
                <a href="/request-plant">ĐỀ XUẤT SẢN PHẨM</a>
              </li>
              <li className="py-2.5 px-4 hover:bg-hover">
                <a href="#">TIN TỨC</a>
              </li>
              <li className="py-2.5 px-4 hover:bg-hover">
                <a href="#">LIÊN HỆ</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Mobile layout */}
      <div id="mobile-header">
        <div id="header-image">
          <img
            src={Logo}
            alt="logo"
            className={`w-full sm:hidden ${isSticky ? "mb-28" : ""}`}
          />
        </div>
        <div
          className={`sm:hidden grid grid-cols-8 bg-main text-white h-[70px] z-50 transition-all duration-300 ${isSticky ? "fixed top-0 w-full shadow-lg" : ""}`}
        >
          <div
            className="p-2.5 col-span-1 cursor-pointer hover:opacity-70 flex justify-start items-center"
            onClick={() => setIsMobileHeaderDisplayed(!isMobileHeaderDisplayed)}
          >
            {!isMobileHeaderDisplayed ? (
              <Bars3Icon className="size-6" />
            ) : (
              <XMarkIcon className="size-6" />
            )}
          </div>
          {isSearching && (
            <div className="col-span-6 p-2.5 flex justify-center items-center">
              <form onSubmit={(e) => {
                e.preventDefault();
                dispatch(setSearchQuery(searchTerm));
                navigate("/products");
                setIsSearching(false);
              }}>
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  className="rounded-full w-full bg-white py-1.5 text-gray-700 px-3"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </form>
            </div>
          )}
          <div className="col-span-1 col-end-9 flex justify-end items-center p-2.5">
            <div className="flex justify-center items-center">
              {isSearching ? (
                <XMarkIcon
                  className="size-6 cursor-pointer hover:opacity-70 mr-3"
                  onClick={() => setIsSearching(false)}
                />
              ) : (
                <MagnifyingGlassIcon
                  className="size-6 cursor-pointer hover:opacity-70 mr-3"
                  onClick={() => setIsSearching(true)}
                />
              )}
              <div className="mr-3">
                <NotificationDropdown />
              </div>
              <a href="#" className="cursor-pointer hover:opacity-70">
                <ShoppingCartIcon className="size-6" />
              </a>
              <div className="sm:hidden relative" ref={userMobileMenuRef}>
                <button
                  className="flex justify-center items-center p-2.5 hover:text-white"
                  onClick={toggleUserMenu}
                >
                  <div className="w-6 h-6 rounded-full flex items-center justify-center">
                    <UserIcon className="size-6" />
                  </div>
                </button>
                
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
                    <div className="py-1">
                      <a 
                        href="/order-history" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Lịch sử mua hàng
                      </a>
                      <a 
                        href="/logout" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Đăng xuất
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {isMobileHeaderDisplayed && (
            <ul className="fixed lg:hidden top-[70px] left-0 w-full flex flex-col items-start z-10 text-gray-500 bg-white text-sm text-left">
              <li className="w-full pl-2 py-2 hover:bg-hover hover:text-white">
                <a href="/" className="flex items-center">
                  TRANG CHỦ
                </a>
              </li>
              <li className="w-full pl-2 py-2 hover:bg-hover hover:text-white">
                <a href="#" className="flex items-center">
                  GIỚI THIỆU
                </a>
              </li>
              <li className="w-full pl-2 py-2 hover:bg-hover hover:text-white">
                <a href="/products" className="flex items-center">
                  SẢN PHẨM
                  <span>
                    <ChevronDownIcon className="size-4 ml-1" />
                  </span>
                </a>
              </li>
              <li className="w-full pl-2 py-2 hover:bg-hover hover:text-white">
                <a href="#" className="flex items-center">
                  SẢN PHẨM MỚI
                  <span>
                    <ChevronDownIcon className="size-4 ml-1" />
                  </span>
                </a>
              </li>
              <li className="w-full pl-2 py-2 hover:bg-hover hover:text-white">
                <a href="/request-plant" className="flex items-center">
                  ĐỀ XUẤT SẢN PHẨM
                  <span>
                    <ChevronDownIcon className="size-4 ml-1" />
                  </span>
                </a>
              </li>
              <li className="w-full pl-2 py-2 hover:bg-hover hover:text-white">
                <a href="#" className="flex items-center">
                  TIN TỨC
                </a>
              </li>
              <li className="w-full pl-2 py-2 hover:bg-hover hover:text-white">
                <a href="#" className="flex items-center">
                  LIÊN HỆ
                </a>
              </li>
            </ul>
          )}
        </div>
      </div>
    </header>
  );
}
