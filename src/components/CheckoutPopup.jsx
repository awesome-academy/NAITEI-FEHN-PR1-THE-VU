import React from 'react';
import { StarIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { HeartIcon } from '@heroicons/react/24/outline';

const CheckoutPopup = ({ formData, total, onInputChange, onSubmit, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <h3 className="text-xl font-semibold text-green-600 mb-4">Thông tin thanh toán</h3>
        
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Họ và tên <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={onInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Số điện thoại <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={onInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Địa chỉ nhận hàng <span className="text-red-500">*</span>
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={onInputChange}
              required
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
            ></textarea>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={onInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Phương thức thanh toán <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  checked={formData.paymentMethod === 'COD'}
                  onChange={onInputChange}
                  className="mr-2"
                />
                <span>Thanh toán khi nhận hàng (COD)</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Banking"
                  checked={formData.paymentMethod === 'Banking'}
                  onChange={onInputChange}
                  className="mr-2"
                />
                <span>Chuyển khoản ngân hàng</span>
              </label>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Tổng thanh toán: <span className="font-semibold text-green-600">{total.toLocaleString()} đ</span>
            </div>
            <button
              type="submit"
              className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
            >
              ĐẶT HÀNG
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPopup;
