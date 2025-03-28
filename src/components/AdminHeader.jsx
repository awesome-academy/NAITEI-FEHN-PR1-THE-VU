import UserDropdown from "./UserDropdown";
import SubLogo from "../assets/subLogo.png";

export default function AdminHeader() {
  return (
    <header className="bg-footer">
      <div className="">
        <div className="flex justify-between bg-footer text-white z-40 transition-all duration-300 fixed top-0 w-full shadow-lg">
          <div className="">
            <a href="/">
              <img
                src={SubLogo}
                alt="subLogo"
                className="h-full max-h-[70px]"
              />
            </a>
          </div>
          <div className="flex justify-end items-center p-2.5">
            <UserDropdown />
          </div>
        </div>
      </div>
    </header>
  );
}
