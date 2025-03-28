import React, { useState, useEffect, useRef } from 'react';
import { BellIcon as BellIconSolid } from '@heroicons/react/24/solid';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '../store/notificationSlice';
import { Link } from 'react-router-dom';

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  const { notifications, loading, error } = useSelector(state => state.notifications || { notifications: [], loading: false, error: null });
  const hasUnread = notifications.some(notification => !notification.read);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleNotificationClick = (id) => {
    dispatch(markNotificationAsRead(id));
    setIsOpen(false);
  };

  const handleMarkAllAsRead = () => {
    dispatch(markAllNotificationsAsRead());
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Vừa xong';
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} giờ trước`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} ngày trước`;
    
    return date.toLocaleDateString('vi-VN');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        className="relative flex items-center justify-center rounded-full text-gray-700 hover:text-gray-900"
        onClick={toggleDropdown}
        aria-expanded={isOpen}
      >
        <BellIconSolid className="size-6 md:size-6 text-white sm:text-main" />
        {hasUnread && (
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 flex items-center justify-center text-white text-xs">
            {notifications.filter(n => !n.read).length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-50">
          <div className="p-3 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Thông báo</h3>
            {hasUnread && (
              <button 
                onClick={handleMarkAllAsRead} 
                className="text-xs text-main hover:text-hover"
              >
                Đánh dấu tất cả đã đọc
              </button>
            )}
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {loading && (
              <div className="p-4 text-center text-gray-500">
                Đang tải thông báo...
              </div>
            )}
            
            {error && (
              <div className="p-4 text-center text-red-500">
                Không thể tải thông báo
              </div>
            )}
            
            {!loading && !error && notifications.length === 0 && (
              <div className="p-4 text-center text-gray-500">
                Không có thông báo nào
              </div>
            )}
            
            {!loading && !error && notifications.length > 0 && (
              <ul>
                {notifications.map((notification) => (
                  <li 
                    key={notification.id} 
                    className={`p-3 border-b border-gray-100 hover:bg-gray-50 ${!notification.read ? 'bg-blue-50' : ''}`}
                  >
                    <Link 
                      to={notification.url} 
                      className="flex items-start"
                      onClick={() => handleNotificationClick(notification.id)}
                    >
                      <div className="flex-1">
                        <p className="text-sm text-gray-800">{notification.content}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatTime(notification.created_at || new Date().toISOString())}
                        </p>
                      </div>
                      {!notification.read && (
                        <span className="h-2 w-2 bg-blue-500 rounded-full"></span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          <div className="p-2 text-center border-t border-gray-200">
            <Link 
              to="/notifications" 
              className="text-sm text-main hover:text-hover"
              onClick={() => setIsOpen(false)}
            >
              Xem tất cả
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
