import React from 'react';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

const SuccessPopup = ({ onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md text-center">
        <div className="text-green-500 mb-4">
          <CheckCircleIcon className="w-16 h-16 mx-auto" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Đặt hàng thành công!</h3>
        <p className="text-gray-600 mb-6">
          Cảm ơn quý khách đã mua hàng tại Green Shop. Đơn hàng của quý khách sẽ được xử lý trong thời gian sớm nhất.
        </p>
        <button
          onClick={onClose}
          className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
        >
          ĐÓNG
        </button>
      </div>
    </div>
  );
};

export default SuccessPopup;
