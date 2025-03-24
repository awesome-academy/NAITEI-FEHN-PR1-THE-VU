import {
  BanknotesIcon,
  ChevronRightIcon,
  CreditCardIcon,
  DevicePhoneMobileIcon,
  EnvelopeIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/24/solid";
import FacebookIcon from "../icons/FacebookIcon";
import TiktokIcon from "../icons/TiktokIcon";
import XIcon from "../icons/XIcon";
import SubLogo from "../assets/subLogo.png";

const footerLinks = [
  {
    heading: "THÔNG TIN KHÁCH HÀNG",
    links: [
      "Tài khoản của tôi",
      "Sản phẩm yêu thích",
      "Lịch sử mua hàng",
      "Chính sách đổi trả",
      "Góp ý, khiếu nại",
    ],
  },
  {
    heading: "HỖ TRỢ DỊCH VỤ",
    links: [
      "Hệ thống cửa hàng",
      "Hướng dẫn mua hàng",
      "Hướng dẫn thanh toán",
      "Tích điểm đổi quà",
      "Câu hỏi thường gặp",
    ],
  },
  {
    heading: "CHÍNH SÁCH ƯU ĐÃI",
    links: [
      "Chính sách giao hàng",
      "Chính sách đổi trả sản phẩm",
      "Chính sách bảo hành",
      "Giới thiệu sản phẩm mới",
      "Chính sách trả góp",
    ],
  },
  {
    heading: "TIN TỨC",
    links: ["Tin mới", "Khuyến mại", "Tuyển dụng", "Download", "Tags"],
  },
];

export default function Footer() {
  return (
    <footer className="bg-footer">
      {/* Mobile layout */}
      <div className="sm:flex text-main sm:text-gray-400 max-w-5xl mx-auto px-2.5 pt-6 font-semibold text-sm sm:text-xs/6">
        <div className="sm:w-3/12">
          <h3 className="my-2 sm:my-0">KÊNH THÔNG TIN TỪ CHÚNG TÔI:</h3>
          <div className="text-gray-400 flex py-2 sm:py-0">
            <ul className="flex">
              <li className="py-2 px-3 pl-0">
                <a href="#" className="hover:text-white">
                  <FacebookIcon width={20} height={20} />
                </a>
              </li>
              <li className="py-2 px-3">
                <a href="#" className="hover:text-white">
                  <TiktokIcon width={20} height={20} />
                </a>
              </li>
              <li className="py-2 px-3">
                <a href="#" className="hover:text-white">
                  <XIcon width={20} height={20} />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="sm:w-1/12"></div>

        <div className="sm:w-8/12 sm:flex justify-between">
          <h4 className="my-2 sm:my-0 sm:w-5/10 md:w-4/10 lg:w-1/4 mr-2">
            ĐĂNG KÝ NHẬN EMAIL TỪ CHÚNG TÔI
          </h4>
          <div className="max-w-sm space-y-3 w-full py-2 sm:py-0">
            <div className="flex bg-white">
              <input
                type="text"
                placeholder="Nhập email..."
                className="py-2 mr-2 sm:py-3 px-4 block w-full text-gray-400 sm:text-sm focus:outline-0"
              />
              <button
                type="button"
                className="size-11.5 shrink-0 inline-flex justify-center items-center gap-x-2 text-sm font-semibold border border-transparent bg-main text-white hover:bg-green-600 cursor-pointer"
              >
                <PaperAirplaneIcon className="size-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-[#3D3D3D] mb-5 mt-8"></div>

      <div className="sm:flex max-w-5xl mx-auto">
        <div className="px-2.5 mb-5 sm:w-3/12">
          <img
            src={SubLogo}
            alt=""
            className="w-full max-w-[400px] mx-auto mb-4 sm:mb-2"
          />
          <p className="text-gray-400 text-sm sm:text-xs text-justify">
            Green shop được thành lập từ 8/2010 được sự tin tưởng của khách hàng
            trong suốt thời gian hoạt động. Đến nay cửa hàng ngày một phát
            triển.
          </p>
          <p className="hidden sm:flex text-xs text-gray-400 sm:items-start mt-3">
            <DevicePhoneMobileIcon className="size-3 h-[1lh] text-main mr-1" />
            <span>Điện thoại: (84-4) 66.558.868</span>
          </p>
          <p className="hidden sm:flex text-xs text-gray-400 sm:items-start mt-2">
            <EnvelopeIcon className="size-3 h-[1lh] text-main mr-1" />
            <span>Email: info@vht.com.vn</span>
          </p>
        </div>

        <div className="sm:w-1/12"></div>

        <div className="px-2.5 sm:w-8/12 sm:grid sm:grid-cols-2 lg:grid-cols-3 md:gap-4 xl:grid-cols-4 sm:pl-0">
          {footerLinks.map((section, index) => (
            <div key={index} className="pb-5">
              <h5 className="text-main font-semibold text-xs mb-5">
                {section.heading}
              </h5>
              {section.links.map((link, i) => (
                <p className="mb-3 text-sm md:text-xs" key={i}>
                  <a
                    href="#"
                    className="flex items-start text-gray-400 hover:text-white"
                  >
                    <ChevronRightIcon className="w-2 h-[1lh] mr-0.5" />
                    {link}
                  </a>
                </p>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="hidden sm:flex items-center justify-between px-2.5 border-t border-[#3D3D3D] max-w-5xl mx-auto">
        <ul className="flex gap-x-2 md:gap-x-4 lg:gap-x-6 text-gray-400 text-xs py-3">
          <li className=" hover:text-white cursor-pointer">Sitemap</li>
          <li className=" hover:text-white cursor-pointer">
            Danh mục sản phẩm
          </li>
          <li className=" hover:text-white cursor-pointer">Hợp tác</li>
          <li className=" hover:text-white cursor-pointer">
            Thông tin liên hệ
          </li>
          <li className=" hover:text-white cursor-pointer">
            Câu hỏi thường gặp
          </li>
        </ul>

        <ul className="flex text-gray-400 space-x-3">
          <li className="hover:text-white">
            <CreditCardIcon className="size-4" />
          </li>
          <li className="hover:text-white">
            <BanknotesIcon className="size-4" />
          </li>
        </ul>
      </div>

      <p className="text-center bg-[#434343] text-white py-2 text-sm">
        Thiết kế bởi VHT &copy;
      </p>
    </footer>
  );
}
