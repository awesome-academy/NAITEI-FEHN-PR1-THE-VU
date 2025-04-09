import { PencilIcon, PlusIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { Select, Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { message } from "antd";
import React, { useEffect, useState } from "react";
import axios from "axios";

const cloudinaryConfig = {
  cloudName: "dvvzcljcn",
  uploadPreset: "ml_default",
};

const urlParams = new URLSearchParams(window.location.href.split("?")[1]);

export default function ProductModal({
  isOpen,
  onClose,
  onOpen,
  afterSubmit,
  product = null,
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState(null);
  const [tags, setTags] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [autoOpened, setAutoOpened] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    science_name: "",
    price: "",
    old_price: "",
    color: "",
    description: "",
    tags: [],
    information: {
      family: "",
      height: "",
      full_description: "",
    },
    image: [],
  });

  const transformImageUrlToUploadFormat = (imageUrls) => {
    return imageUrls?.map((url, index) => ({
      uid: `-${index}`,
      name: `image${index + 1}.jpg`,
      status: "done",
      url: url,
    }));
  };

  const handleInformationChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      information: {
        ...prev.information,
        [name]: value,
      },
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTagsChange = (value) => {
    setSelectedTags(value);
  };

  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || formData.name.length < 3) {
      alert("Tên cây phải có ít nhất 3 ký tự!");
      return;
    }

    if (!formData.description || formData.description.length < 20) {
      alert("Mô tả phải có ít nhất 20 ký tự!");
      return;
    }

    if (!formData.category) {
      alert("Chưa chọn loại cây!");
      return;
    }

    if (fileList.length < 1 || fileList.length > 5) {
      alert("Vui lòng chọn từ 1-5 ảnh!");
      return;
    }

    setLoading(true);
    try {
      const filesAlreadySaved = fileList
        .filter((file) => file.url)
        .map((file) => file.url);
      const newFiles = fileList.filter((file) => !file.url);
      const cloudinaryUrls = await Promise.all(
        newFiles.map((file) => uploadToCloudinary(file.originFileObj)),
      );

      const updatedFormData = {
        ...formData,
        tags: selectedTags,
        image: [
          ...filesAlreadySaved,
          ...cloudinaryUrls.filter((url) => url !== null),
        ],
      };

      let response;

      if (formData.id === null) {
        response = await axios.post(
          "http://localhost:5000/trees",
          updatedFormData,
        );
        if (urlParams.get("user_id")) {
          await axios.post("http://localhost:5000/notifications", {
            user_id: urlParams.get("user_id"),
            title: "Yêu cầu thêm cây mới đã được duyệt",
            content: `Yêu cầu thêm cây "${formData.name}" của bạn đã được duyệt.`,
            read: false,
            created_at: new Date().toISOString(),
          });
          await axios.patch(
            `http://localhost:5000/requests/${urlParams.get("request_id")}`,
            {
              status: "đã duyệt",
            },
          );
        }
      } else {
        response = await axios.patch(
          `http://localhost:5000/trees/${formData.id}`,
          updatedFormData,
        );
      }

      if (response.status === 201 || response.status === 200) {
        alert(
          `${formData.id === null ? "Thêm" : "Sửa thông tin"} cây thành công!`,
        );

        setFormData({
          suggest_tree: { name: "", description: "", images: [] },
          created_at: new Date().toISOString(),
        });
        setFileList([]);
        afterSubmit(response.data);
      } else {
        alert("Đã có lỗi xảy ra. Vui lòng thử lại sau!");
      }

      window.history.pushState({}, "", "/admin/products");
    } catch (error) {
      console.log("Error submitting request:", error);
      alert("Có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại sau!");
    } finally {
      setLoading(false);
    }

    onClose();
  };

  useEffect(() => {
    const requestId = urlParams.get("request_id");
    if (requestId && !autoOpened && !isOpen && onOpen) {
      onOpen();
      setAutoOpened(true);
    }
  }, [isOpen, onOpen, autoOpened]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [products, categories] = await Promise.all([
          fetch("http://localhost:5000/trees").then((res) => res.json()),
          fetch("http://localhost:5000/categories").then((res) => res.json()),
        ]);

        const tags = new Set(products.flatMap((product) => product.tags));
        setTags([...tags]);
        setCategories(categories);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setFormData({
      id: product?.id || null,
      name: product?.name || urlParams.get("name") || "",
      science_name: product?.science_name || "",
      price: product?.price || "",
      old_price: product?.old_price || "",
      color: product?.color || "",
      category: product?.category || "",
      description: product?.description || urlParams.get("description") || "",
      tags: product?.tags || [],
      information: {
        family: product?.information?.family || "",
        height: product?.information?.height || "",
        full_description: product?.information?.full_description || "",
      },
      image: product?.image || [],
      bought: product?.bought || 0,
      created_at: product?.created_at || new Date().toISOString(),
    });
    setSelectedTags(product?.tags || []);
    setFileList(
      transformImageUrlToUploadFormat(
        product?.image ||
          urlParams
            .get("images")
            ?.replaceAll(/[\[\]"]/g, "")
            .split(","),
      ) || [],
    );
  }, [product]);

  if (!isOpen) return null;
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div
      tabIndex="-1"
      aria-hidden={!isOpen}
      className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full bg-gray-50/40"
    >
      <div className="relative py-4 w-full max-w-xl max-h-full">
        <div className="relative bg-white rounded-lg shadow-lg">
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t border-gray-200 font-beVietNamPro">
            <h3 className="text-lg font-semibold text-gray-900">
              {product === null ? "Thêm sản phẩm mới" : "Sửa sản phẩm"}
            </h3>
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
              onClick={onClose}
            >
              <XMarkIcon className="size-6" />
              <span className="sr-only">Close modal</span>
            </button>
          </div>

          <form className="p-4 md:p-5" onSubmit={handleSubmit}>
            <div className="grid gap-4 mb-4 grid-cols-4">
              <div className="col-span-2">
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Tên
                  <span className="text-red-600"> *</span>
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  placeholder="Hoa hồng"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-span-2">
                <label
                  htmlFor="science_name"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Tên khoa học
                </label>
                <input
                  type="text"
                  name="science_name"
                  id="science_name"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  placeholder="Rosa"
                  value={formData.science_name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-span-1">
                <label
                  htmlFor="price"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Giá
                  <span className="text-red-600"> *</span>
                </label>
                <input
                  type="number"
                  name="price"
                  id="price"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  placeholder="200.000"
                  required
                  value={formData.price}
                  min="10000"
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-span-1">
                <label
                  htmlFor="old_price"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Giá cũ
                  <span className="text-red-600"> *</span>
                </label>
                <input
                  type="number"
                  name="old_price"
                  id="old_price"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  placeholder="300.000"
                  required
                  value={formData.old_price}
                  min="10000"
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-span-1">
                <label
                  htmlFor="category"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Loại cây
                  <span className="text-red-600"> *</span>
                </label>
                <select
                  id="category"
                  name="category"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                  value={formData.category}
                  onChange={handleInputChange}
                >
                  <option>Chọn loại cây</option>
                  {categories.map((category, id) => (
                    <option key={id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-span-1">
                <label
                  htmlFor="color"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Màu
                </label>
                <input
                  type="text"
                  name="color"
                  id="color"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  placeholder="Đỏ"
                  value={formData.color}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-span-2">
                <label
                  htmlFor="family"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Họ
                </label>
                <input
                  type="text"
                  name="family"
                  id="family"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  placeholder="Moraceae"
                  value={formData.information.family}
                  onChange={handleInformationChange}
                />
              </div>
              <div className="col-span-2">
                <label
                  htmlFor="height"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Chiều cao
                </label>
                <input
                  type="text"
                  name="height"
                  id="height"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  placeholder="1-2 mét"
                  value={formData.information.height}
                  onChange={handleInformationChange}
                />
              </div>
              <div className="col-span-2">
                <label
                  htmlFor="description"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Mô tả
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows="2"
                  className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Hoa hồng là một loài hoa phổ biến..."
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-span-2">
                <label
                  htmlFor="full_description"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Mô tả chi tiết
                </label>
                <textarea
                  id="full_description"
                  name="full_description"
                  rows="2"
                  className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Hoa hồng là một loài hoa phổ biến..."
                  value={formData.information.full_description}
                  onChange={handleInformationChange}
                />
              </div>
              <div className="col-span-4">
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  Tags
                </label>
                <Select
                  mode="tags"
                  style={{ width: "100%" }}
                  onChange={handleTagsChange}
                  value={selectedTags}
                  tokenSeparators={[","]}
                  options={tags.map((tag) => ({ value: tag, label: tag }))}
                />
              </div>
              <div className="col-span-4">
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  Hình ảnh
                  <span className="text-xs"> (Chọn từ 1-5 hình)</span>
                </label>
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
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 pr-5 text-center"
            >
              {product === null ? (
                <>
                  <PlusIcon className="size-5 mr-1" />
                  Tạo
                </>
              ) : (
                <>
                  <PencilIcon className="size-4 mr-1" />
                  Sửa
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
