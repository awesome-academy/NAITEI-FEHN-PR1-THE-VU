import { useState, useEffect } from "react";
import SectionHeading from "../components/SectionHeading";
import {
  MagnifyingGlassIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import ProductModal from "../components/ProductModal";
import { Pagination } from "antd";
import formatMoney from "../helper/FormatMoney";
import axios from "axios";

export default function AdminProductList() {
  const [products, setProducts] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState(null);
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

  const handleDeleteProduct = async (id) => {
    if (confirm("Bạn có chắn chắn muốn xóa sản phẩm này?")) {
      setLoading(true);
      try {
        await axios.delete(`http://localhost:5000/trees/${id}`);

        setProducts((prevProducts) => prevProducts.map((p) => p.id !== id));
        setFilteredProducts((prevProducts) =>
          prevProducts.map((p) => p.id !== id),
        );
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/trees`);
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (products) {
      const filtered = products.filter(
        (products) =>
          products.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          products.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
      setFilteredProducts(filtered);
    }
  }, [searchTerm, products]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <SectionHeading heading="Sản phẩm" />
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
            placeholder="Tên cây, mô tả, ..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      <ProductModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedProduct(null);
        }}
        onOpen={() => setModalOpen(true)}
        product={selectedProduct}
      />

      <div className="relative my-6 overflow-x-auto shadow sm:rounded-lg">
        <table className="w-full table-auto text-sm text-left rtl:text-right text-gray-500">
          <thead className="text-xs text-gray-700 bg-gray-200">
            <tr>
              <th scope="col" className="px-6 py-3">
                Tên
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Hình ảnh
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Mô tả
              </th>
              <th scope="col" className="px-6 py-3">
                Tags
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Lượt mua
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Giá bán
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts
              ?.slice((currentPage - 1) * 10, currentPage * 10)
              .map((product) => (
                <tr
                  key={product.id}
                  className="bg-white border-b border-gray-200 hover:bg-gray-50 align-middle "
                >
                  <th className="px-6 py-4 truncate">{product.name}</th>
                  <td className="px-6 py-4 truncate">
                    <img
                      src={product?.image[0]}
                      alt={product.name}
                      className="size-10"
                    />
                  </td>
                  <td className="px-6 py-4 ">{product.description}</td>
                  <td className="px-6 py-4">
                    <ul className="truncate text-xs">
                      {product.tags.map((tag, id) => (
                        <li key={id}>{tag}</li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-6 py-4 text-center">{product.bought}</td>
                  <td className="px-6 py-4 text-center">
                    {formatMoney(product.price)}
                  </td>
                  <td className="px-6 py-9 flex justify-center items-center">
                    <PencilIcon
                      className="size-3.5 mr-3.5 text-hover hover:opacity-70 cursor-pointer"
                      onClick={() => {
                        setSelectedProduct(product);
                        setModalOpen(true);
                      }}
                    />
                    <TrashIcon
                      className="size-3.5 text-red-400 hover:opacity-70 cursor-pointer"
                      onClick={() => handleDeleteProduct(product.id)}
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
          total={products.length}
          pageSize={10}
          onChange={handlePageChange}
          showSizeChanger={false}
        />
      </div>
    </>
  );
}
