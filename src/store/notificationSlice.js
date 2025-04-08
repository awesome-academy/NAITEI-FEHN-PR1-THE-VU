import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const getUserId = () => {
  const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
  if (storedUser) {
    try {
      const user = JSON.parse(storedUser);
      return user.id;
    } catch (error) {
      console.error('Lỗi khi đọc thông tin người dùng:', error);
      return null;
    }
  }
  return null;
};

export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (_, { rejectWithValue }) => {
    try {
      const userId = getUserId();
      
      const response = await axios.get(`http://localhost:5000/notifications?user_id=${userId}`);
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk for marking a single notification as read
export const markNotificationAsRead = createAsyncThunk(
  'notifications/markAsRead',
  async (notificationId, { rejectWithValue }) => {
    try {
      // Get the current notification data
      const response = await axios.get(`http://localhost:5000/notifications/${notificationId}`);
      const notification = response.data;
      
      // Update the read status
      const updatedNotification = {
        ...notification,
        read: true
      };
      
      // Save the updated notification to the server
      await axios.put(`http://localhost:5000/notifications/${notificationId}`, updatedNotification);
      
      return notificationId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk for marking all notifications as read
export const markAllNotificationsAsRead = createAsyncThunk(
  'notifications/markAllAsRead',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { notifications } = getState().notifications;
      
      // Update each unread notification
      const updatePromises = notifications
        .filter(notification => !notification.read)
        .map(notification => {
          const updatedNotification = {
            ...notification,
            read: true
          };
          return axios.put(`http://localhost:5000/notifications/${notification.id}`, updatedNotification);
        });
      
      await Promise.all(updatePromises);
      
      return true;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    notifications: [],
    loading: false,
    error: null,
  },
  reducers: {
    markAsRead: (state, action) => {
      const notificationId = action.payload;
      const notification = state.notifications.find(n => n.id === notificationId);
      if (notification) {
        notification.read = true;
      }
    },
    markAllAsRead: (state) => {
      state.notifications.forEach(notification => {
        notification.read = true;
      });
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        const notification = state.notifications.find(n => n.id === action.payload);
        if (notification) {
          notification.read = true;
        }
      })
      .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
        state.notifications.forEach(notification => {
          notification.read = true;
        });
      });
  }
});

export const { markAsRead, markAllAsRead } = notificationSlice.actions;
export default notificationSlice.reducer;
