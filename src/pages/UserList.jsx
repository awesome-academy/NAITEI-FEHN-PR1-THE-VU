import { useState, useEffect } from "react";
import {
  LockClosedIcon,
  LockOpenIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/solid";
import SectionHeading from "../components/SectionHeading";
import axios from "axios";
import { Pagination } from "antd";

export default function UserList() {
  const [users, setUsers] = useState(null);
  const [filteredUsers, setFilteredUsers] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleChangeUserStatus = async (user) => {
    setLoading(true);
    try {
      const response = await axios.patch(
        `http://localhost:5000/users/${user.id}`,
        {
          is_active: !user.is_active,
        },
      );

      const updatedUser = response.data;
      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.id === updatedUser.id ? { ...u, ...updatedUser } : u,
        ),
      );

      setFilteredUsers((prevFiltered) =>
        prevFiltered.map((u) =>
          u.id === updatedUser.id ? { ...u, ...updatedUser } : u,
        ),
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/users?_sort=role`);
        const data = await response.json();
        setUsers(data);
        setFilteredUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [currentPage]);

  useEffect(() => {
    if (users) {
      const filtered = users.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()),
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <SectionHeading heading="Danh sách người dùng" />
      <div className="flex justify-end">
        <div className="relative text-gray-500">
          <MagnifyingGlassIcon className="size-4 absolute top-1/2 left-2 -translate-y-1/2" />
          <input
            type="search"
            className="block p-2.5 pl-7 w-60 text-xs text-gray-900 rounded-full border-s-2 border border-gray-300"
            placeholder="Nhập tên, email, ..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      <div className="relative my-6 overflow-x-auto shadow sm:rounded-lg">
        <table className="w-full table-auto text-sm text-left rtl:text-right text-gray-500">
          <thead className="text-xs text-gray-700 bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-center">
                Tên
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Email
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Số điện thoại
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Link Facebook
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Loại tài khoản
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Trạng thái
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers?.map((user) => (
              <tr
                key={user.id}
                className="bg-white border-b border-gray-200 hover:bg-gray-50"
              >
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                >
                  {user.name}
                </th>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4 text-center">{user.phone}</td>
                <td className="px-6 py-4 text-center">
                  <a
                    href={user.social_link}
                    target="_blank"
                    className="text-blue-500 hover:underline hover:text-blue-400"
                  >
                    Link
                  </a>
                </td>
                <td className="px-6 py-4 text-center">
                  <span
                    className={`py-1 px-3 rounded-lg text-white ${user.role === "admin" ? "bg-hover" : "bg-blue-500"}`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span
                    className={`py-1 px-3 rounded-lg text-white ${user.is_active ? "bg-blue-500" : "bg-gray-400"}`}
                  >
                    {user.is_active ? "Active" : "Deactivated"}
                  </span>
                </td>
                <td className="px-6 py-4 flex items-center justify-center">
                  <button
                    className="rounded-full size-6 shadow flex items-center justify-center bg-gray-50 cursor-pointer hover:opacity-80"
                    onClick={() => handleChangeUserStatus(user)}
                    disabled={loading}
                  >
                    {user.is_active ? (
                      <LockClosedIcon className="size-3 text-red-400" />
                    ) : (
                      <LockOpenIcon className="size-3 text-red-400" />
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end mt-4">
        <Pagination
          current={currentPage}
          total={users.length}
          pageSize={10}
          onChange={handlePageChange}
          showSizeChanger={false}
        />
      </div>
    </>
  );
}
