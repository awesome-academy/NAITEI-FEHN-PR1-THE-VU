import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setCategory, setColor, setPriceRange, fetchProducts } from '../store/productSlice';
import { FilterOutlined, CloseOutlined } from '@ant-design/icons';

export default function Category() {
  const dispatch = useDispatch();
  const { filters, itemsPerPage, currentPage, sort } = useSelector(state => state.products);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
      const fetchCategories = async () => {
        try {
          setLoading(true);
          const response = await axios.get('http://localhost:5000/categories');
          setCategories(response.data);
          setTotalItems(response.data.length);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching categories:', error);
          setLoading(false);
        }
      };
  
      fetchCategories();
    }, []);

  // Close drawer when resizing to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsDrawerOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close drawer when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const drawer = document.getElementById('category-drawer');
      const filterButton = document.getElementById('filter-button');
      
      if (isDrawerOpen && 
          drawer && 
          !drawer.contains(event.target) &&
          filterButton && 
          !filterButton.contains(event.target)) {
        setIsDrawerOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDrawerOpen]);

  const handleCategoryClick = (categoryId) => {
    dispatch(setCategory(categoryId));
  };

  const handleColorClick = (color) => {
    dispatch(setColor(color));
  };

  const handlePriceRangeClick = (min, max) => {
    dispatch(setPriceRange({ min, max }));
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const priceRanges = [
    { id: 1, min: 0, max: 100000, range: '0 - 100.000 đ' },
    { id: 2, min: 100001, max: 200000, range: '100.000 đ - 200.000 đ' },
    { id: 3, min: 200001, max: 300000, range: '200.000 đ - 300.000 đ' },
    { id: 4, min: 300001, max: 4000000, range: '300.000 đ - 400.000 đ' },
    { id: 5, min: 400001, max: 5000000, range: '400.000 đ - 500.000 đ' }
  ];

  const colors = [
    { id: 1, name: 'Xanh lá', value: 'Xanh lá', color: 'bg-green-500' },
    { id: 2, name: 'Đỏ', value: 'Đỏ', color: 'bg-red-500' },
    { id: 3, name: 'Tím', value: 'Tím', color: 'bg-purple-500' },
    { id: 4, name: 'Xanh biển', value: 'Xanh biển', color: 'bg-blue-500' },
    { id: 5, name: 'Trắng', value: 'Trắng', color: 'bg-white-500 border border-gray-400' },
    { id: 6, name: 'Hồng', value: 'Hồng', color: 'bg-pink-500' }
  ];

  return (
    <>
      <div className="md:hidden w-full mb-4">
        <button 
          id="filter-button"
          onClick={toggleDrawer}
          className="bg-white p-3 rounded-lg shadow-sm flex items-center text-green-700 font-semibold border border-gray-200"
        >
          <FilterOutlined/>
        </button>
      </div>

      {/* Mobile drawer */}
      <div 
        id="category-drawer"
        className={`fixed md:hidden top-0 left-0 h-full w-4/5 max-w-xs bg-white z-50 overflow-y-auto transition-transform duration-300 shadow-lg ${
          isDrawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-green-700">Bộ lọc sản phẩm</h3>
            <button 
              onClick={() => setIsDrawerOpen(false)}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <CloseOutlined />
            </button>
          </div>

          <div className="border-t pt-4">
            <h3 className="text-base font-semibold mb-4 text-green-700">Danh mục sản phẩm</h3>
            <ul className="space-y-3">
              {categories.map(category => (
                <li key={category.id}>
                  <span 
                    className={`text-gray-700 hover:text-green-600 cursor-pointer flex items-center ${filters.category === category.id ? 'text-green-600 font-semibold' : ''}`}
                    onClick={() => handleCategoryClick(category.id)}
                  >
                    <span className="mr-2">▸</span>
                    {category.name}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t pt-4 mt-4">
            <h3 className="text-base font-semibold mb-4 text-green-700">Tìm theo giá</h3>
            <ul className="space-y-3">
              {priceRanges.map(range => (
                <li key={range.id}>
                  <span 
                    className={`text-gray-700 hover:text-green-600 cursor-pointer flex items-center ${
                      filters.minPrice === range.min && filters.maxPrice === range.max ? 'text-green-600 font-semibold' : ''
                    }`}
                    onClick={() => handlePriceRangeClick(range.min, range.max)}
                  >
                    <span className="mr-2">▸</span>
                    {range.range}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t pt-4 mt-4">
            <h3 className="text-base font-semibold mb-4 text-green-700">Tìm theo màu</h3>
            <div className="flex flex-wrap gap-2">
              {colors.map(color => (
                <div 
                  key={color.id} 
                  className={`flex items-center mb-2 mr-2 cursor-pointer ${
                    filters.color === color.value ? 'font-semibold text-green-600' : ''
                  }`}
                  onClick={() => handleColorClick(color.value)}
                >
                  <div className={`w-4 h-4 rounded-full ${color.color} mr-2`}></div>
                  <span className="text-gray-700">{color.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isDrawerOpen && (
        <div 
          className="fixed md:hidden inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsDrawerOpen(false)}
        ></div>
      )}

      <div className="hidden md:block sticky top-[10px] h-[calc(100vh-20px)] bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold border-b pb-2 mb-4 text-green-700">Danh mục sản phẩm</h3>
        <ul className="space-y-2">
          {categories.map(category => (
            <li key={category.id} className="flex items-center justify-between">
              <span 
                className={`text-gray-700 hover:text-green-600 cursor-pointer flex items-center ${filters.category === category.id ? 'text-green-600 font-semibold' : ''}`}
                onClick={() => handleCategoryClick(category.id)}
              >
                <span className="mr-2">▸</span>
                {category.name}
              </span>
            </li>
          ))}
        </ul>

        <h3 className="text-lg font-semibold border-b pb-2 mb-4 mt-8 text-green-700">Tìm theo giá</h3>
        <ul className="space-y-2">
          {priceRanges.map(range => (
            <li key={range.id} className="flex items-center">
              <span 
                className={`text-gray-700 hover:text-green-600 cursor-pointer flex items-center ${
                  filters.minPrice === range.min && filters.maxPrice === range.max ? 'text-green-600 font-semibold' : ''
                }`}
                onClick={() => handlePriceRangeClick(range.min, range.max)}
              >
                <span className="mr-2">▸</span>
                {range.range}
              </span>
            </li>
          ))}
        </ul>

        <h3 className="text-lg font-semibold border-b pb-2 mb-4 mt-8 text-green-700">Tìm theo màu</h3>
        <div className="flex flex-wrap gap-2">
          {colors.map(color => (
            <div 
              key={color.id} 
              className={`flex items-center mb-2 mr-2 cursor-pointer ${
                filters.color === color.value ? 'font-semibold text-green-600' : ''
              }`}
              onClick={() => handleColorClick(color.value)}
            >
              <div className={`w-4 h-4 rounded-full ${color.color} mr-2`}></div>
              <span className="text-gray-700">{color.name}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
