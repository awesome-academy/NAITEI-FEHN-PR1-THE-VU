import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Typography, Card, message, Button, Upload, Spin, Modal } from "antd";
import { PlusOutlined, SendOutlined } from "@ant-design/icons";
const { Title, Paragraph } = Typography;

const cloudinaryConfig = {
  cloudName: "dvvzcljcn",
  uploadPreset: "ml_default",
};

export default function RequestPlant() {
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    suggest_tree: {
      name: "",
      description: "",
      images: [],
      status: "đang chờ"
    },
    created_at: new Date().toISOString(),
  });

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", cloudinaryConfig.uploadPreset);

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      return response.data.secure_url;
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      message.error("Tải ảnh lên thất bại");
      return null;
    }
  };

  const beforeUpload = (file) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("Bạn chỉ có thể tải lên file ảnh!");
    }

    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Kích thước ảnh phải nhỏ hơn 2MB!");
    }

    return isImage && isLt2M;
  };

  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      suggest_tree: {
        ...prev.suggest_tree,
        [name]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.suggest_tree.name || formData.suggest_tree.name.length < 3) {
      alert("Tên cây phải có ít nhất 3 ký tự!");
      return;
    }

    if (
      !formData.suggest_tree.description ||
      formData.suggest_tree.description.length < 20
    ) {
      alert("Mô tả phải có ít nhất 20 ký tự!");
      return;
    }

    setLoading(true);

    try {
      const cloudinaryUrls = await Promise.all(
        fileList.map((file) => uploadToCloudinary(file.originFileObj)),
      );

      const updatedFormData = {
        ...formData,
        suggest_tree: {
          ...formData.suggest_tree,
          images: cloudinaryUrls.filter((url) => url !== null),
        },
      };

      const response = await axios.post(
        "http://localhost:5000/requests",
        updatedFormData,
      );

      if (response.status === 201) {
        alert("Yêu cầu của bạn đã được gửi thành công!");

        setFormData({
          suggest_tree: { name: "", description: "", images: [] },
          created_at: new Date().toISOString(),
        });
        setFileList([]);
        setSubmitSuccess(true);
      } else {
        alert("Có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại sau!");
      }

      window.history.pushState({}, "", "/request-plant");
    } catch (error) {
      console.log("Error submitting request:", error);
      alert("Có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại sau!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card className="mb-6">
        <Title level={2}>Yêu cầu thêm cây mới</Title>
        <Paragraph>
          Bạn đang tìm kiếm một loại cây nhưng không tìm thấy trong cửa hàng
          chúng tôi? Hãy gửi yêu cầu và chúng tôi sẽ xem xét bổ sung vào danh
          mục sản phẩm!
        </Paragraph>
        <Paragraph>
          Chúng tôi sẽ xem xét yêu cầu của bạn và phản hồi sớm nhất có thể.
        </Paragraph>
      </Card>

      <Card>
        <Spin spinning={loading} tip="Đang gửi yêu cầu...">
          <div className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="block font-medium">
                Tên cây<span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.suggest_tree.name}
                onChange={handleInputChange}
                placeholder="Nhập tên cây bạn muốn thêm vào cửa hàng"
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="block font-medium">
                Mô tả<span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.suggest_tree.description}
                onChange={handleInputChange}
                placeholder="Mô tả chi tiết về cây (đặc điểm, cách chăm sóc, lý do bạn muốn cửa hàng thêm loại cây này...)"
                className="w-full p-2 border border-gray-300 rounded-md"
                rows={6}
                required
                minLength={20}
              />
            </div>

            <div className="space-y-2">
              <label className="block font-medium">Hình ảnh (nếu có)</label>
              <div className="mt-1">
                <Upload
                  listType="picture-card"
                  fileList={fileList}
                  beforeUpload={beforeUpload}
                  onChange={handleChange}
                  multiple
                  maxCount={5}
                  accept="image/*"
                  customRequest={({ onSuccess }) => {
                    setTimeout(() => {
                      onSuccess("ok");
                    }, 0);
                  }}
                >
                  {fileList.length >= 5 ? null : (
                    <div>
                      <PlusOutlined />
                      <div style={{ marginTop: 8 }}>Tải lên</div>
                    </div>
                  )}
                </Upload>
                <p className="text-sm text-gray-500">
                  Tải lên hình ảnh của cây để chúng tôi có thể hiểu rõ hơn về
                  yêu cầu của bạn.
                </p>
              </div>
            </div>

            <div className="mt-6 flex space-x-4">
              <button
                type="button"
                onClick={handleSubmit}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
              >
                <SendOutlined className="mr-2" />
                Gửi yêu cầu
              </button>

              <button
                type="button"
                onClick={() => navigate("/", { replace: true })}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md"
              >
                Quay lại
              </button>
            </div>
          </div>
        </Spin>
      </Card>
    </div>
  );
}
