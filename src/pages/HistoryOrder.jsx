import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Breadcrumb, Tabs, Empty, Badge, Spin } from "antd";
import { 
  HomeOutlined, 
  ShoppingOutlined, 
  ClockCircleOutlined, 
  CheckCircleOutlined,
  TruckOutlined,
  ExclamationCircleOutlined
} from "@ant-design/icons";

export default function HistoryOrder() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState({});

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const userId = 2; // Example: user with ID 2
        
        const orderResponse = await axios.get(`http://localhost:5000/orders?user_id=${userId}`);
        
        const productsResponse = await axios.get('http://localhost:5000/trees');
        
        const productsMap = {};
        productsResponse.data.forEach(product => {
          productsMap[product.id] = product;
        });
        
        setProducts(productsMap);
        setOrders(orderResponse.data);
      } catch (err) {
        setError(err.message || "Không thể tải dữ liệu đơn hàng");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const formatMoney = (amount) => {
    return new Intl.NumberFormat('vi-VN').format(amount);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "đang xử lý":
        return <Badge dot color="blue"><span className="flex items-center"><ClockCircleOutlined className="mr-1" /> Đang xử lý</span></Badge>;
      case "đang giao":
        return <Badge dot color="orange"><span className="flex items-center"><TruckOutlined className="mr-1" /> Đang giao</span></Badge>;
      case "đã giao":
        return <Badge dot color="green"><span className="flex items-center"><CheckCircleOutlined className="mr-1" /> Đã giao</span></Badge>;
      case "đã hủy":
        return <Badge dot color="red"><span className="flex items-center"><ExclamationCircleOutlined className="mr-1" /> Đã hủy</span></Badge>;
      default:
        return <Badge dot color="default" text={status} />;
    }
  };

  const calculateOrderTotal = (orderItems) => {
    return orderItems.reduce((total, item) => {
      const product = products[item.id];
      if (product) {
        return total + (product.price * item.quantity);
      }
      return total;
    }, 0);
  };

  const renderOrderItems = (orderItems) => {
    return orderItems.map(item => {
      const product = products[item.id];
      if (!product) return null;

      return (
        <div key={item.id} className="flex items-center py-4 border-b">
          <div className="w-16 h-16 flex-shrink-0 mr-4">
            <img 
              src={product.image[0]} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <Link to={`/product/${product.id}`} className="text-gray-800 hover:text-green-600 font-medium">
              {product.name}
            </Link>
            <p className="text-gray-500 text-sm">x{item.quantity}</p>
          </div>
          <div className="text-red-500 font-medium">
            {formatMoney(product.price)} đ
          </div>
        </div>
      );
    });
  };

  const renderOrders = (status = "all") => {
    const filteredOrders = status === "all" 
      ? orders 
      : orders.filter(order => order.status === status);

    if (filteredOrders.length === 0) {
      return <Empty description="Không tìm thấy đơn hàng nào" className="py-10" />;
    }

    return filteredOrders.map(order => (
      <div key={order.id} className="bg-white rounded-md shadow-sm mb-6">
        <div className="flex justify-between items-center border-b p-4">
          <div className="flex items-center">
            <ShoppingOutlined className="text-green-600 mr-2" />
            <span className="text-gray-600">Đơn hàng #{order.id}</span>
          </div>
          {getStatusBadge(order.status)}
        </div>
        
        <div className="p-4">
          {renderOrderItems(order.trees)}
        </div>
        
        <div className="bg-gray-50">
          <div className="p-4 pb-0 flex justify-between items-center border-t">
            <div className="text-gray-600 flex-2">
              <p>Địa chỉ: {order.address}</p>
              <p>Số điện thoại: {order.phone}</p>
            </div>
            <div className="text-right flex-1fa">
              <p className="text-gray-600">Tổng thanh toán:</p>
              <p className="text-xl text-red-500 font-bold">
                {formatMoney(calculateOrderTotal(order.trees))} đ
              </p>
            </div>
          </div>
          <div className="space-x-2 flex justify-end p-2">
            {order.status === "đang xử lý" && (
              <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                Hủy đơn
              </button>
            )}
            {order.status === "đã giao" && !order.rated && (
              <button className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">
                Đánh giá
              </button>
            )}
            {(order.status === "đã giao" || order.status === "đã hủy") && (
              <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                Mua lại
              </button>
            )}
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-6">
        <Breadcrumb.Item href="/">
          <HomeOutlined className="mr-1" />
          <span>Home</span>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Lịch sử mua hàng</Breadcrumb.Item>
      </Breadcrumb>

      <h1 className="text-2xl mt-4 font-bold mb-6">Lịch sử mua hàng</h1>

      <Spin spinning={loading} tip="Đang tải đơn hàng...">
        {error ? (
          <div className="text-center py-10 text-red-500">{error}</div>
        ) : (
          <Tabs 
            defaultActiveKey="all"
            items={[
              {
                label: "Tất cả",
                key: "all",
                children: renderOrders()
              },
              {
                label: "Đang xử lý",
                key: "đang xử lý",
                children: renderOrders("đang xử lý")
              },
              {
                label: "Đang giao",
                key: "đang giao",
                children: renderOrders("đang giao")
              },
              {
                label: "Đã giao",
                key: "đã giao",
                children: renderOrders("đã giao")
              },
              {
                label: "Đã hủy",
                key: "đã hủy",
                children: renderOrders("đã hủy")
              }
            ]}
          />
        )}
      </Spin>
    </div>
  );
}
