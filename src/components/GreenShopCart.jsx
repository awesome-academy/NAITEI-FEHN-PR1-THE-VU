import React, { useState } from 'react';
import CheckoutPopup from './CheckoutPopup';
import SuccessPopup from './SuccessPopup';

const GreenShopCart = () => {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    email: '',
    paymentMethod: 'COD'
  });

  const cartItems = [
    {
      id: 1,
      name: 'CÂY VĂN PHÒNG',
      price: 270000,
      quantity: 1,
      image: '/api/placeholder/80/80'
    },
    {
      id: 2,
      name: 'CÂY VĂN PHÒNG',
      price: 270000,
      quantity: 1,
      image: '/api/placeholder/80/80'
    },
    {
      id: 3,
      name: 'CÂY VĂN PHÒNG',
      price: 270000,
      quantity: 1,
      image: '/api/placeholder/80/80'
    }
  ];

  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleCheckout = () => {
    setIsCheckoutOpen(true);
  };

  const handleSubmitOrder = (e) => {
    e.preventDefault();
    setIsCheckoutOpen(false);
    setIsSuccessOpen(true);
  };

  const handleClosePopup = () => {
    setIsCheckoutOpen(false);
    setIsSuccessOpen(false);
  };

  return (
    <div className="bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="text-sm text-gray-500">
          <a href="#" className="hover:text-green-500">Home</a> / Giỏ hàng
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-12">
        <h2 className="text-2xl text-green-500 font-medium py-4">GIỎ HÀNG</h2>
        
        <div className="w-full border-collapse">
          <div className="flex bg-green-500 text-white">
            <div className="w-24 p-3 text-center font-normal">HÌNH ẢNH</div>
            <div className="flex-grow p-3 text-left font-normal">TÊN SẢN PHẨM</div>
            <div className="w-32 p-3 text-center font-normal">ĐƠN GIÁ</div>
            <div className="w-32 p-3 text-center font-normal">SỐ LƯỢNG</div>
            <div className="w-32 p-3 text-center font-normal">THÀNH TIỀN</div>
            <div className="w-16 p-3 text-center font-normal">XÓA</div>
          </div>
          
          {cartItems.map((item) => (
            <div key={item.id} className="flex bg-white border-b">
              <div className="w-24 p-4 text-center">
                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover mx-auto" />
              </div>
              <div className="flex-grow p-4 flex items-center">
                <a href="#" className="text-green-500 hover:text-green-600">{item.name}</a>
              </div>
              <div className="w-32 p-4 text-center flex items-center justify-center">
                {item.price.toLocaleString()} đ
              </div>
              <div className="w-32 p-4 text-center flex items-center justify-center">
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  className="w-12 h-8 text-center border border-gray-300 rounded"
                />
              </div>
              <div className="w-32 p-4 text-center flex items-center justify-center">
                {(item.price * item.quantity).toLocaleString()} đ
              </div>
              <div className="w-16 p-4 text-center flex items-center justify-center">
                <button className="text-gray-400 hover:text-red-500">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {/* Buttons and Summary */}
        <div className="mt-6 flex justify-between">
          {/* Right side buttons */}
          <div className="flex-1"></div>
          <div className="flex gap-2">
            <button className="h-12 px-4 bg-white border border-gray-300 rounded text-gray-600 hover:bg-gray-100 flex items-center justify-center">
              CẬP NHẬT HÀNG
            </button>
            <button className="h-12 px-4 bg-green-500 text-white rounded hover:bg-green-600 flex items-center justify-center">
              TIẾP TỤC MUA
            </button>
          </div>
        </div>
        
        {/* Summary in bordered box */}
        <div className="mt-6 flex justify-end">
          <div className="w-96 border border-gray-200 rounded bg-white">
            <div className="p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-700">TỔNG TIỀN (CHƯA THUẾ)</span>
                <span className="text-green-500 font-medium">{subtotal.toLocaleString()} đ</span>
              </div>
              
              <div className="flex justify-between items-center mb-3">
                <span className="text-gray-700">THUẾ (VAT 10%)</span>
                <span className="text-green-500 font-medium">{tax.toLocaleString()} đ</span>
              </div>
              
              <div className="flex justify-between items-center bg-green-500 text-white p-3 mb-4">
                <span className="font-medium">TỔNG PHẢI THANH TOÁN</span>
                <span className="font-medium">{total.toLocaleString()} đ</span>
              </div>
              
              <div className="flex justify-end">
                <button 
                  onClick={handleCheckout}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  THANH TOÁN
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Popups */}
      {isCheckoutOpen && (
        <CheckoutPopup 
          formData={formData}
          total={total}
          onInputChange={handleInputChange}
          onSubmit={handleSubmitOrder}
          onClose={handleClosePopup}
        />
      )}

      {isSuccessOpen && (
        <SuccessPopup onClose={handleClosePopup} />
      )}
    </div>
  );
};

export default GreenShopCart;
