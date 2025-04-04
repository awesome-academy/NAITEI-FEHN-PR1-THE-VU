import { PencilIcon, PlusIcon, XMarkIcon } from "@heroicons/react/24/solid";
import React, { useEffect, useState } from "react";

export default function CategoryModal({
  isOpen,
  onClose,
  onSubmit,
  category = null,
}) {
  const [formData, setFormData] = useState({
    id: category?.id || null,
    name: category?.name || "",
    description: category?.description || "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name.trim().length < 5) {
      alert("Tên phải dài hơn 5 ký tự!");
      return;
    }
    if (formData.description.trim().length < 20) {
      alert("Mô tả phải dài hơn 20 ký tự!");
      return;
    }
    console.log(formData);
    onSubmit(formData);
    onClose();
  };

  useEffect(() => {
    setFormData({
      id: category?.id || null,
      name: category?.name || "",
      description: category?.description || "",
    });
  }, [category]);

  if (!isOpen) return null;

  return (
    <div
      id="crud-modal"
      tabIndex="-1"
      aria-hidden={!isOpen}
      className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full bg-gray-50/40"
    >
      <div className="relative p-4 w-full max-w-md max-h-full">
        <div className="relative bg-white rounded-lg shadow-lg">
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t border-gray-200 font-beVietNamPro">
            <h3 className="text-lg font-semibold text-gray-900">
              {category === null ? "Tạo thể loại mới" : "Sửa thể loại"}
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
            <div className="grid gap-4 mb-4 grid-cols-2">
              <div className="col-span-2">
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Tên thể loại
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  placeholder="Nhập tên thể loại"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
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
                  rows="4"
                  className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nhập mô tả thể loại..."
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <button
              type="submit"
              className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              {category === null ? (
                <>
                  <PlusIcon className="size-5 mr-1" />
                  Tạo thể loại mới
                </>
              ) : (
                <>
                  <PencilIcon className="size-4 mr-1" />
                  Sửa thể loại
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
