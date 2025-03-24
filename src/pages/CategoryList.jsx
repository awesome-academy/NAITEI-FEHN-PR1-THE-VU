import {
  MagnifyingGlassIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import SectionHeading from "../components/SectionHeading";
import { useState, useEffect } from "react";
import { Pagination } from "antd";
import CategoryModal from "../components/CategoryModal";
import axios from "axios";

export default function CategoryList() {
  const [categories, setCategories] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [filteredCategories, setFilteredCategories] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDeleteCategory = async (id) => {
    if (confirm("Bạn có chắn chắn muốn xóa thể loại cây này?")) {
      setLoading(true);
      try {
        await axios.delete(`http://localhost:5000/categories/${id}`);

        setCategories((prevCategories) =>
          prevCategories.map((c) => c.id !== id),
        );
        setFilteredCategories((prevCategories) =>
          prevCategories.map((c) => c.id !== id),
        );
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleModalSubmit = async (formData) => {
    setLoading(true);
    try {
      if (formData?.id === null) {
        const response = await axios.post(`http://localhost:5000/categories`, {
          name: formData.name,
          description: formData.description,
        });

        const updatedCategory = response.data;
        setCategories((prevCategories) => [...prevCategories, updatedCategory]);
        setFilteredCategories((prevCategories) => [
          ...prevCategories,
          updatedCategory,
        ]);
      } else {
        const response = await axios.patch(
          `http://localhost:5000/categories/${formData.id}`,
          {
            name: formData.name,
            description: formData.description,
          },
        );

        const updatedCategory = response.data;
        setCategories((prevCategories) =>
          prevCategories.map((c) =>
            c.id === updatedCategory.id ? { ...c, ...updatedCategory } : c,
          ),
        );
        setFilteredCategories((prevCategories) =>
          prevCategories.map((c) =>
            c.id === updatedCategory.id ? { ...c, ...updatedCategory } : c,
          ),
        );
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/categories`);
        const data = await response.json();
        setCategories(data);
        setFilteredCategories(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [currentPage]);

  useEffect(() => {
    if (categories) {
      const filtered = categories.filter(
        (categories) =>
          categories.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          categories.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
      setFilteredCategories(filtered);
    }
  }, [searchTerm, categories]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <SectionHeading heading="Danh mục sản phẩm" />
      <div className="flex justify-end items-center">
        <div
          className="rounded-full bg-main hover:bg-hover text-white size-8 p-2 mr-2 flex items-center justify-center cursor-pointer"
          onClick={() => setModalOpen(true)}
        >
          <PlusIcon className="size-10" />
        </div>

        <div className="relative text-gray-500">
          <MagnifyingGlassIcon className="size-4 absolute top-1/2 left-2 -translate-y-1/2" />
          <input
            type="search"
            className="block p-2.5 pl-7 w-60 text-xs text-gray-900 rounded-full border-s-2 border border-gray-300"
            placeholder="Tên loại cây, ..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      <CategoryModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedCategory(null);
        }}
        onSubmit={handleModalSubmit}
        category={selectedCategory}
      />

      <div className="relative my-6 overflow-x-auto shadow sm:rounded-lg">
        <table className="w-full table-auto text-sm text-left rtl:text-right text-gray-500">
          <thead className="text-xs text-gray-700 bg-gray-200">
            <tr>
              <th scope="col" className="px-6 py-3">
                Loại cây
              </th>
              <th scope="col" className="px-6 py-3">
                Mô tả
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredCategories
              ?.slice((currentPage - 1) * 10, currentPage * 10)
              .map((category) => (
                <tr
                  key={category.id}
                  className="bg-white border-b border-gray-200 hover:bg-gray-50 align-middle "
                >
                  <th className="px-6 py-4 truncate">{category.name}</th>
                  <td className="px-6 py-4 truncate">{category.description}</td>
                  <td className="p-6 flex items-center justify-center">
                    <PencilIcon
                      className="size-3.5 mr-3.5 text-hover hover:opacity-70 cursor-pointer"
                      onClick={() => {
                        setSelectedCategory(category);
                        setModalOpen(true);
                      }}
                    />
                    <TrashIcon
                      className="size-3.5 text-red-400 hover:opacity-70 cursor-pointer"
                      onClick={() => handleDeleteCategory(category.id)}
                    />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end my-4">
        <Pagination
          current={currentPage}
          total={10}
          pageSize={10}
          onChange={handlePageChange}
          showSizeChanger={false}
        />
      </div>
    </>
  );
}
