import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import SectionHeading from "../components/SectionHeading";
import { useState, useEffect } from "react";
import { Pagination, Tooltip } from "antd";
import formatMoney from "../helper/FormatMoney";
import { Badge } from "antd";
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  TruckOutlined,
  ExclamationCircleOutlined,
  DeliveredProcedureOutlined,
  CloseOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import axios from "axios";

export default function OrderList() {
  const [orders, setOrders] = useState(null);
  const [filteredOrders, setFilteredOrders] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleChangeOrderStatus = async (order, newStatus) => {
    setLoading(true);
    try {
      const response = await axios.patch(
        `http://localhost:5000/orders/${order.id}`,
        {
          status: newStatus,
        },
      );

      const updatedOrder = response.data;
      setOrders((prevOrders) =>
        prevOrders.map((u) =>
          u.id === updatedOrder.id ? { ...u, ...updatedOrder } : u,
        ),
      );

      setFilteredOrders((prevFiltered) =>
        prevFiltered.map((u) =>
          u.id === updatedOrder.id ? { ...u, ...updatedOrder } : u,
        ),
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:5000/orders?status_ne=trong giỏ hàng&_sort=status`,
        );
        const data = await response.json();
        setOrders(data);
        setFilteredOrders(data.data || data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    if (orders) {
      const filtered = orders.filter(
        (order) =>
          order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.user_name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
      setFilteredOrders(filtered);
    }
  }, [searchTerm, orders]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "đang xử lý":
        return (
          <Badge dot color="blue">
            <span className="flex items-center">
              <ClockCircleOutlined className="mr-1" /> Đang xử lý
            </span>
          </Badge>
        );
      case "đang giao":
        return (
          <Badge dot color="orange">
            <span className="flex items-center">
              <TruckOutlined className="mr-1" /> Đang giao
            </span>
          </Badge>
        );
      case "đã giao":
        return (
          <Badge dot color="green">
            <span className="flex items-center">
              <CheckCircleOutlined className="mr-1" /> Đã giao
            </span>
          </Badge>
        );
      case "đã hủy":
        return (
          <Badge dot color="red">
            <span className="flex items-center">
              <ExclamationCircleOutlined className="mr-1" /> Đã hủy
            </span>
          </Badge>
        );
      default:
        return <Badge dot color="default" text={status} />;
    }
  };

  const getActionButton = (oldStatus) => {
    switch (oldStatus) {
      case "đang xử lý":
        return [
          {
            className: "bg-orange-400",
            icon: <DeliveredProcedureOutlined className="size-2.5" />,
            tooltip: "Đang giao",
            nextStatus: "đang giao",
          },
          {
            className: "ml-2 bg-red-600",
            icon: <CloseOutlined className="size-2.5" />,
            tooltip: "Hủy đơn hàng",
            nextStatus: "đã hủy",
          },
        ];
      case "đang giao":
        return [
          {
            className: "bg-green-600",
            icon: <CheckOutlined className="size-2.5" />,
            tooltip: "Hoàn thành",
            nextStatus: "đã giao",
          },
        ];
      default:
        return [];
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <SectionHeading heading="Danh sách đơn hàng" />
      <div className="flex justify-end">
        <div className="relative text-gray-500">
          <MagnifyingGlassIcon className="size-4 absolute top-1/2 left-2 -translate-y-1/2" />
          <input
            type="search"
            className="block p-2.5 pl-7 w-60 text-xs text-gray-900 rounded-full border-s-2 border border-gray-300"
            placeholder="Mã đơn hàng, người nhận, ..."
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
                Mã đơn hàng
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Người nhận
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Số điện thoại
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Địa chỉ
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Sản phẩm
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Cần thanh toán
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
            {filteredOrders
              ?.slice((currentPage - 1) * 10, currentPage * 10)
              .map((order) => (
                <tr
                  key={order.id}
                  className="bg-white border-b border-gray-200 hover:bg-gray-50 align-middle "
                >
                  <th className="px-6 py-4 text-center">{order.id}</th>
                  <td className="px-6 py-4">{order.user_name}</td>
                  <td className="px-6 py-4 text-center">{order.phone}</td>
                  <td className="px-6 py-4 text-center text-xs">
                    {order.address}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <ul className="text-xs truncate">
                      {order.trees.map((tree, id) => (
                        <li key={id}>{`${tree.name} x ${tree.quantity}`}</li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-6 py-4 text-center text-xs">
                    {formatMoney(order.total)} đ
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(order.status)}</td>
                  <td className="p-6 flex items-center justify-center">
                    {getActionButton(order.status).map((button, id) => (
                      <Tooltip title={button.tooltip} key={id}>
                        <button
                          className={`rounded-full size-6 flex items-center justify-center text-white bg-gray-50 cursor-pointer hover:opacity-80 ${button.className}`}
                          onClick={() =>
                            handleChangeOrderStatus(order, button.nextStatus)
                          }
                          disabled={loading}
                        >
                          {button.icon}
                        </button>
                      </Tooltip>
                    ))}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end my-4">
        <Pagination
          current={currentPage}
          total={filteredOrders.length}
          pageSize={10}
          onChange={handlePageChange}
          showSizeChanger={false}
        />
      </div>
    </>
  );
}
