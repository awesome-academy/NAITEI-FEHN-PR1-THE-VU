import { Outlet } from "react-router";
import AdminHeader from "../components/AdminHeader";

export default function AdminDashboard() {
  return (
    <>
      <AdminHeader />
      <div className="h-[70px]"></div>
      <div className="mx-auto max-w-5xl px-2.5">
        <Outlet />
      </div>
    </>
  );
}
