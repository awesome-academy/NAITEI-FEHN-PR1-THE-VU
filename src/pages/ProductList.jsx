import React, { useState, useEffect } from 'react';
import { Breadcrumb, Pagination } from 'antd';
import { HomeOutlined, UnorderedListOutlined, AppstoreOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import Category from '../components/Category';
import PlantGridItem from '../components/PlantGridItem';
import PlantListItem from '../components/PlantListItem';
import { 
  fetchProducts, 
  setItemsPerPage, 
  setCurrentPage,
  setSorting
} from '../store/productSlice';

export default function ProductList() {
  const [viewType, setViewType] = useState('grid');
  const dispatch = useDispatch();
  const { 
    products, 
    loading, 
    currentPage, 
    totalItems, 
    itemsPerPage,
    filters,
    sort
  } = useSelector(state => state.products);

  useEffect(() => {
    dispatch(fetchProducts({
      category: filters.category,
      color: filters.color,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      searchQuery: filters.searchQuery,
      sort,
      page: currentPage,
      limit: itemsPerPage
    }));
  }, [dispatch, filters, sort, currentPage, itemsPerPage]);

  const handlePageChange = (page) => {
    dispatch(setCurrentPage(page));
    window.scrollTo(0, 0);
  };

  const handleSortChange = (e) => {
    const value = e.target.value;
    let sortConfig = {};
    
    switch (value) {
      case 'name-asc':
        sortConfig = { field: 'name', order: 'asc' };
        break;
      case 'price-asc':
        sortConfig = { field: 'price', order: 'asc' };
        break;
      case 'price-desc':
        sortConfig = { field: '-price', order: 'asc' };
        break;
      default:
        sortConfig = { field: '', order: 'asc' };
    }
    
    dispatch(setSorting(sortConfig));
  };

  const handleItemsPerPageChange = (e) => {
    dispatch(setItemsPerPage(parseInt(e.target.value)));
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <Breadcrumb.Item href="/">
            <HomeOutlined className="mr-1" />
            <span>Home</span>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Danh sách sản phẩm</Breadcrumb.Item>
        </Breadcrumb>

        <div className="flex pt-4 flex-col md:flex-row gap-6">
          {/* Sidebar with categories */}
          <div className="w-full flex md:w-1/4">
            <Category />
            <div className="flex md:hidden gap-2">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                <select 
                  id="sort-select"
                  className="w-full sm:w-auto border rounded p-2 bg-white" 
                  onChange={handleSortChange}
                >
                  <option value="">Mặc định</option>
                  <option value="name-asc">Tên sản phẩm</option>
                  <option value="price-asc">Giá: Thấp đến cao</option>
                  <option value="price-desc">Giá: Cao đến thấp</option>
                </select>
              </div>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                <select 
                  id="items-per-page"
                  className="w-full sm:w-auto border rounded p-2 bg-white" 
                  onChange={handleItemsPerPageChange}
                  value={itemsPerPage}
                >
                  <option value="12">12 sản phẩm</option>
                  <option value="24">24 sản phẩm</option>
                  <option value="36">36 sản phẩm</option>
                </select>
              </div>
            </div>
          </div>

          {/* Product list */}
          <div className="w-full md:w-3/4">
            {/* Banner */}
            <div className="hidden md:block h-48 w-full bg-cover bg-center bg-no-repeat mb-6 rounded-lg" 
                 style={{ backgroundImage: `url('/src/assets/products-banner.png')` }}>
            </div>

            <div className="hidden md:flex justify-between items-start gap-4 mb-6">
              <div className="flex items-center gap-2 w-full md:w-auto">
                <button 
                  onClick={() => setViewType('grid')}
                  className={`p-2 md:p-2 w-[50px] md:w-[40px] h-[40px] flex items-center justify-center rounded ${viewType === 'grid' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}>
                  <AppstoreOutlined className="text-lg md:text-base" />
                </button>
                <button 
                  onClick={() => setViewType('list')}
                  className={`p-2 md:p-2 w-[50px] md:w-[40px] h-[40px] flex items-center justify-center rounded ${viewType === 'list' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}>
                  <UnorderedListOutlined className="text-lg md:text-base" />
                </button>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-center sm:justify-end">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                  <label htmlFor="sort-select" className="text-sm font-medium text-gray-700">Sắp xếp theo:</label>
                  <select 
                    id="sort-select"
                    className="w-full sm:w-auto border rounded p-2 bg-white" 
                    onChange={handleSortChange}
                  >
                    <option value="">Mặc định</option>
                    <option value="name-asc">Tên sản phẩm</option>
                    <option value="price-asc">Giá: Thấp đến cao</option>
                    <option value="price-desc">Giá: Cao đến thấp</option>
                  </select>
                </div>
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                  <label htmlFor="items-per-page" className="text-sm font-medium text-gray-700">Hiển thị:</label>
                  <select 
                    id="items-per-page"
                    className="w-full sm:w-auto border rounded p-2 bg-white" 
                    onChange={handleItemsPerPageChange}
                    value={itemsPerPage}
                  >
                    <option value="12">12 sản phẩm</option>
                    <option value="24">24 sản phẩm</option>
                    <option value="36">36 sản phẩm</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Product grid or list */}
            {loading ? (
              <div className="text-center py-12">Đang tải sản phẩm...</div>
            ) : (
              <div className={viewType === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'flex flex-col gap-4'}>
                {filters.searchQuery && products.length != 0 && (
                  <div className="text-center py-4 col-span-1 md:col-span-2 lg:col-span-3">
                    <span className="text-gray-500">Kết quả tìm kiếm cho: </span>
                    <span className="font-semibold text-gray-800">{filters.searchQuery}</span>
                  </div>
                )}
                {products.map(product => (
                  viewType === 'grid' ? (
                    <PlantGridItem key={product.id} plant={product} />
                  ) : (
                    <PlantListItem key={product.id} plant={product} />
                  )
                ))}
              </div>
            )}

            {/* Pagination */}
            <div className="flex justify-center mt-8">
              <Pagination 
                current={currentPage}
                total={totalItems}
                pageSize={itemsPerPage}
                onChange={handlePageChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
