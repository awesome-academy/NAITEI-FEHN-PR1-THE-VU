import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { PaperAirplaneIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import PopupImage from "../assets/popup-image.jpg";

export default function WelcomePopup() {
  const [isOpen, setIsOpen] = useState(true);
  const [notWantToDisplayPopup, setNotWantToDisplayPopup] = useState(
    () => sessionStorage.getItem("notWantToDisplayPopup") === "true",
  );

  const handleCheckboxChange = (e) => {
    setNotWantToDisplayPopup(e.target.checked);

    e.target.checked
      ? sessionStorage.setItem("notWantToDisplayPopup", JSON.stringify(true))
      : sessionStorage.removeItem("notWantToDisplayPopup");
  };

  return (
    !notWantToDisplayPopup && (
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 flex w-screen items-center justify-center p-8 md:p-4">
          <DialogPanel className="max-w-3xl space-y-4 border border-gray-200 shadow-sm bg-white p-8 sm:px-10 sm:py-12` relative">
            <button
              className="absolute top-0 right-0 p-2 text-main hover:opacity-70 cursor-pointer"
              onClick={() => setIsOpen(false)}
            >
              <XMarkIcon className="size-4 sm:size-6" />
            </button>

            <div className="sm:flex items-center">
              <div className="hidden sm:block sm:w-5/10 mr-3">
                <img src={PopupImage} alt="img" />
              </div>

              <div>
                <DialogTitle className="font-bold font-pacifico text-xl/8 sm:text-2xl/12">
                  Nhận tin tức từ chúng tôi
                  <p className="text-main font-sans text-lg sm:text-xl font-bold">
                    ĐĂNG KÝ EMAIL NGAY HÔM NAY
                  </p>
                </DialogTitle>
                <div className="flex bg-white mt-6 mb-4">
                  <input
                    type="text"
                    placeholder="Nhập email..."
                    className="py-2 sm:py-3 px-4 block w-full text-gray-800 border-2 border-r-0 border-gray-400 sm:text-sm focus:outline-0"
                  />
                  <button
                    type="button"
                    className="size-11.5 shrink-0 inline-flex justify-center items-center gap-x-2 text-sm font-semibold border border-transparent bg-main text-white hover:bg-green-600 cursor-pointer"
                  >
                    <PaperAirplaneIcon className="size-5" />
                  </button>
                </div>

                <Description className="text-gray-800 text-sm text-justify mb-6">
                  Đăng ký email ngay hôm nay để nhận các thông tin về sự kiện và
                  các chương trình giảm giá từ chúng tôi.
                </Description>
                <div className="flex items-center">
                  <input
                    id="default-checkbox"
                    type="checkbox"
                    checked={notWantToDisplayPopup}
                    onChange={handleCheckboxChange}
                    className="w-3 h-3 bg-gray-100 border-gray-300 rounded-sm"
                  />
                  <label
                    htmlFor="default-checkbox"
                    className="ms-2 text-sm text-gray-800"
                  >
                    Không hiển thị lại thông báo này nữa
                  </label>
                </div>
              </div>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    )
  );
}
