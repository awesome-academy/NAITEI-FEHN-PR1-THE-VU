import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Create async thunk for fetching products with filters
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params, { rejectWithValue }) => {
    try {
      // Build query string from params
      const queryParams = new URLSearchParams();
      
      if (params.category) queryParams.append('category', params.category);
      if (params.color) queryParams.append('color_like', params.color);
      if (params.minPrice) queryParams.append('price_gte', params.minPrice);
      if (params.maxPrice) queryParams.append('price_lte', params.maxPrice);
      
      // Add search query parameter for name or description
      if (params.searchQuery) {
        queryParams.append('q', params.searchQuery);
      }

      // Sorting
      if (params.sort) {
        queryParams.append('_sort', params.sort.field);
        queryParams.append('_order', params.sort.order);
      }
      
      // Pagination
      const page = params.page || 1;
      const limit = params.limit || 12;
      queryParams.append('_page', page);
      queryParams.append('_limit', limit);
      
      const response = await axios.get(`http://localhost:5000/trees?${queryParams}`);
      
      return {
        products: response.data,
        totalItems: parseInt(response.headers['x-total-count'] || '0'),
        currentPage: page
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  products: [],
  loading: false,
  error: null,
  totalItems: 0,
  currentPage: 1,
  itemsPerPage: 12,
  filters: {
    category: '',
    color: '',
    minPrice: '',
    maxPrice: '',
    searchQuery: '',
  },
  sort: {
    field: '',
    order: 'asc'
  },
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setItemsPerPage: (state, action) => {
      state.itemsPerPage = parseInt(action.payload);
    },
    setCategory: (state, action) => {
      state.filters.category = action.payload;
      state.currentPage = 1; // Reset to first page when filter changes
    },
    setColor: (state, action) => {
      state.filters.color = action.payload;
      state.currentPage = 1;
    },
    setPriceRange: (state, action) => {
      state.filters.minPrice = action.payload.min;
      state.filters.maxPrice = action.payload.max;
      state.currentPage = 1;
    },
    setSorting: (state, action) => {
      state.sort = action.payload;
      state.currentPage = 1;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.filters.searchQuery = action.payload;
      state.currentPage = 1;
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
      state.currentPage = 1;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.totalItems = action.payload.totalItems;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const {
  setItemsPerPage,
  setCategory,
  setColor,
  setPriceRange,
  setSorting,
  setCurrentPage,
  resetFilters,
  setSearchQuery,
} = productSlice.actions;

export default productSlice.reducer;
