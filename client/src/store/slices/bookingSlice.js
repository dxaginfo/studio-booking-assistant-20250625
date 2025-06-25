import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Initial state
const initialState = {
  bookings: [],
  currentBooking: null,
  loading: false,
  error: null,
  calendarView: 'month', // 'month', 'week', 'day'
  filters: {
    studio: null,
    room: null,
    status: null,
    startDate: null,
    endDate: null,
  },
};

// Async thunks
export const fetchBookings = createAsyncThunk(
  'booking/fetchBookings',
  async (filters, { rejectWithValue }) => {
    try {
      // Build query parameters from filters
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value) {
            params.append(key, value);
          }
        });
      }
      
      const response = await axios.get(`/api/bookings?${params.toString()}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchBookingById = createAsyncThunk(
  'booking/fetchBookingById',
  async (bookingId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/bookings/${bookingId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createBooking = createAsyncThunk(
  'booking/createBooking',
  async (bookingData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/bookings', bookingData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateBooking = createAsyncThunk(
  'booking/updateBooking',
  async ({ bookingId, bookingData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/bookings/${bookingId}`, bookingData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const cancelBooking = createAsyncThunk(
  'booking/cancelBooking',
  async (bookingId, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`/api/bookings/${bookingId}/cancel`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const checkAvailability = createAsyncThunk(
  'booking/checkAvailability',
  async ({ studioId, roomId, startTime, endTime }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/bookings/availability`, {
        params: { studioId, roomId, startTime, endTime }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Booking slice
const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setCalendarView: (state, action) => {
      state.calendarView = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        studio: null,
        room: null,
        status: null,
        startDate: null,
        endDate: null,
      };
    },
    clearCurrentBooking: (state) => {
      state.currentBooking = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchBookings cases
      .addCase(fetchBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ? action.payload.message : 'Failed to fetch bookings';
      })
      
      // fetchBookingById cases
      .addCase(fetchBookingById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookingById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBooking = action.payload;
      })
      .addCase(fetchBookingById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ? action.payload.message : 'Failed to fetch booking';
      })
      
      // createBooking cases
      .addCase(createBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings.push(action.payload);
        state.currentBooking = action.payload;
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ? action.payload.message : 'Failed to create booking';
      })
      
      // updateBooking cases
      .addCase(updateBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBooking.fulfilled, (state, action) => {
        state.loading = false;
        // Update the booking in the bookings array
        const index = state.bookings.findIndex(b => b._id === action.payload._id);
        if (index !== -1) {
          state.bookings[index] = action.payload;
        }
        state.currentBooking = action.payload;
      })
      .addCase(updateBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ? action.payload.message : 'Failed to update booking';
      })
      
      // cancelBooking cases
      .addCase(cancelBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        state.loading = false;
        // Update the booking in the bookings array
        const index = state.bookings.findIndex(b => b._id === action.payload._id);
        if (index !== -1) {
          state.bookings[index] = action.payload;
        }
        if (state.currentBooking && state.currentBooking._id === action.payload._id) {
          state.currentBooking = action.payload;
        }
      })
      .addCase(cancelBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ? action.payload.message : 'Failed to cancel booking';
      })
      
      // checkAvailability cases
      .addCase(checkAvailability.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAvailability.fulfilled, (state) => {
        state.loading = false;
        // Availability check doesn't modify state, just returns data
      })
      .addCase(checkAvailability.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ? action.payload.message : 'Failed to check availability';
      });
  },
});

export const { 
  setCalendarView, 
  setFilters, 
  clearFilters,
  clearCurrentBooking,
  clearError 
} = bookingSlice.actions;

export default bookingSlice.reducer;