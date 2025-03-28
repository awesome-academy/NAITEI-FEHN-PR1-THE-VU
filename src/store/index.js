import { configureStore } from '@reduxjs/toolkit';
import productReducer from './productSlice';
import notificationReducer from './notificationSlice';

export const store = configureStore({
  reducer: {
    products: productReducer,
    notifications: notificationReducer,
  },
});
