import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  count: 0,
  orders: [],
  loading: false,
  error: null,
};

export const orderReducer = createSlice({
  name: "orderStore",
  initialState,
  reducers: {
    // Optimistic increment (before API call)
    incrementOrderCount: (state) => {
      state.count += 1;
    },

    // Revert optimistic update on failure
    decrementOrderCount: (state) => {
      if (state.count > 0) state.count -= 1;
    },

    // Set exact count from server (authoritative)
    setOrderCount: (state, action) => {
      state.count = action.payload;
    },

    // Set all orders (from My Orders page fetch)
    setOrders: (state, action) => {
      state.orders = action.payload;
      // Update count based on active orders (not cancelled/delivered)
      state.count = action.payload.filter(
        (order) => !["cancelled", "delivered"].includes(order.orderStatus)
      ).length;
    },

    // Add new order optimistically
    addOrder: (state, action) => {
      state.orders.unshift(action.payload);
      state.count += 1;
    },

    // Update order status (after cancel)
    updateOrderStatus: (state, action) => {
      const { orderId, status, paymentStatus } = action.payload;
      const order = state.orders.find((o) => o._id === orderId);
      if (order) {
        order.orderStatus = status;
        // If caller specifies paymentStatus explicitly (e.g., revert), use it
        if (typeof paymentStatus !== "undefined") {
          order.paymentStatus = paymentStatus;
        } else if (status === "cancelled" && order.paymentStatus === "pending") {
          // Default behavior: pending -> failed on cancel
          order.paymentStatus = "failed";
        }
        if (status === "cancelled") {
          order.cancelledAt = new Date().toISOString();
        }
        // Recalculate count based on active orders
        state.count = state.orders.filter(
          (order) => !["cancelled", "delivered"].includes(order.orderStatus)
        ).length;
      }
    },

    // Clear all orders (on logout)
    clearOrders: (state) => {
      state.count = 0;
      state.orders = [];
    },

    // Set loading state
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    // Set error state
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  incrementOrderCount,
  decrementOrderCount,
  setOrderCount,
  setOrders,
  addOrder,
  updateOrderStatus,
  clearOrders,
  setLoading,
  setError,
} = orderReducer.actions;

export default orderReducer.reducer;
