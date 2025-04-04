import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, message, Modal, Input, Menu, Tooltip } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import SectionHeading from "../components/SectionHeading";

export default function PlantRequestList() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await axios.get("http://localhost:5000/requests");
      setRequests(response.data);
    } catch (error) {
      message.error("Không thể tải danh sách yêu cầu");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    try {
      await axios.post("http://localhost:5000/notifications", {
        user_id: selectedRequest.user_id,
        title: "Yêu cầu thêm cây mới bị từ chối",
        content: `Yêu cầu thêm cây "${selectedRequest.suggest_tree.name}" đã bị từ chối với lý do: ${rejectReason}`,
        read: false,
        created_at: new Date().toISOString()
      });

      await axios.patch(`http://localhost:5000/requests/${selectedRequest.id}`, {
        status: "đã từ chối",
        reject_reason: rejectReason
      });

      message.success("Đã từ chối yêu cầu");
      setRejectModalVisible(false);
      setRejectReason("");
      setSelectedRequest(null);
      fetchRequests();
    } catch (error) {
      message.error("Có lỗi xảy ra khi từ chối yêu cầu");
    }
  };

  const handleApprove = async (record) => {
    try {
      window.location.href = `/admin/products?name=${encodeURIComponent(record.suggest_tree.name)}&description=${encodeURIComponent(record.suggest_tree.description)}&images=${encodeURIComponent(JSON.stringify(record.suggest_tree.images))}&user_id=${record.user_id}&request_id=${record.id}`;
    } catch (error) {
      message.error("Có lỗi xảy ra");
    }
  };

  const actionMenu = (record) => (
    <Menu>
      <Menu.Item key="approve" onClick={() => handleApprove(record)}>
        <span className="text-green-600">Duyệt</span>
      </Menu.Item>
      <Menu.Item key="reject" onClick={() => {
        setSelectedRequest(record);
        setRejectModalVisible(true);
      }}>
        <span className="text-red-600">Từ chối</span>
      </Menu.Item>
    </Menu>
  );

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 50,
    },
    {
      title: "Tên cây",
      dataIndex: ["suggest_tree", "name"],
      key: "name",
    },
    {
      title: "Mô tả",
      dataIndex: ["suggest_tree", "description"],
      key: "description",
      ellipsis: true,
    },
    {
      title: "Hình ảnh",
      dataIndex: ["suggest_tree", "images"],
      key: "images",
      render: (images) => (
        <div className="flex space-x-2">
          {images?.map((url, index) => (
            <img
              key={index}
              src={url}
              alt="plant"
              className="w-10 h-10 object-cover rounded cursor-pointer hover:opacity-80"
              onClick={() => {
                setSelectedImage(url);
                setImageModalVisible(true);
              }}
            />
          ))}
        </div>
      ),
    },
    {
      title: "Ngày yêu cầu",
      dataIndex: "created_at",
      key: "created_at",
      width: "15%",
      render: (date) => new Date(date).toLocaleDateString("vi-VN"),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: "15%",
      render: (status) => {
        const statusColors = {
          "đang chờ": "bg-yellow-100 text-yellow-800",
          "đã duyệt": "bg-green-100 text-green-800",
          "đã từ chối": "bg-red-100 text-red-800",
        };
        const statusText = {
          "đang chờ": "Đang chờ",
          "đã duyệt": "Đã duyệt",
          "đã từ chối": "Đã từ chối",
        };
        return (
          <span className={`px-2 py-1 rounded-full text-xs ${statusColors[status || 'pending']}`}>
            {statusText[status || 'pending']}
          </span>
        );
      },
    },
    {
      title: "Hành động",
      key: "action",
      width: "15%",
      render: (_, record) => (
        <div className="flex space-x-2">
          <Tooltip title="Duyệt yêu cầu">
            <Button
              type="text"
              icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />} // Icon check màu xanh
              onClick={() => handleApprove(record)}
              disabled={record.status !== "đang chờ"}
              className="hover:text-green-700"
            />
          </Tooltip>
          <Tooltip title="Từ chối yêu cầu">
            <Button
              type="text"
              icon={<CloseCircleOutlined style={{ color: '#ff4d4f' }} />} // Icon close màu đỏ
              onClick={() => {
                setSelectedRequest(record);
                setRejectModalVisible(true);
              }}
              disabled={record.status !== "đang chờ"}
              className="hover:text-red-700"
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div className="px-2.5 py-1">
      <SectionHeading heading="Danh sách yêu cầu thêm cây mới" />
      
      <Table
        columns={columns}
        dataSource={requests}
        loading={loading}
        rowKey="id"
        pagination={{
          pageSize: 10,
        }}
      />

      <Modal
        title="Từ chối yêu cầu"
        open={rejectModalVisible}
        onOk={handleReject}
        onCancel={() => {
          setRejectModalVisible(false);
          setRejectReason("");
          setSelectedRequest(null);
        }}
        okText="Xác nhận"
        cancelText="Hủy"
      >
        <div className="space-y-4">
          <p>Bạn có chắc chắn muốn từ chối yêu cầu này?</p>
          <div>
            <label className="block mb-2">Lý do từ chối:</label>
            <Input.TextArea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Nhập lý do từ chối yêu cầu..."
              rows={4}
            />
          </div>
        </div>
      </Modal>

      <Modal
        open={imageModalVisible}
        footer={null}
        onCancel={() => setImageModalVisible(false)}
        width={800}
      >
        <img 
          src={selectedImage} 
          alt="plant preview" 
          className="w-full h-auto max-h-[70vh] object-contain"
        />
      </Modal>
    </div>
  );
}
