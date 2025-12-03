import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  count: 0,
  products: [],
};

export const cartReducer = createSlice({
  name: "cartStore",
  initialState,
  reducers: {
    addIntoCart: (state, action) => {
      const payload = action.payload;
      const existingProduct = state.products.findIndex(
        (product) =>
          product.productId === payload.productId &&
          product.variantId === payload.variantId
      );
      if (existingProduct < 0) {
        state.products.push(payload);
        state.count = state.products.length;
      }
    },

    increseQuantity: (state, action) => {
      const { productId, variantId } = action.payload;
      const existingProduct = state.products.findIndex(
        (product) =>
          product.productId === productId && product.variantId === variantId
      );
      if (existingProduct >= 0) {
        state.products[existingProduct].quantity += 1;
      }
    },

    decreseQuantity: (state, action) => {
      const { productId, variantId } = action.payload;
      const existingProduct = state.products.findIndex(
        (product) =>
          product.productId === productId && product.variantId === variantId
      );
      if (existingProduct >= 0) {
        if (state.products[existingProduct].quantity > 1) {
          state.products[existingProduct].quantity -= 1;
        }
      }
    },

    removeProduct: (state, action) => {
      const { productId, variantId } = action.payload;
      state.products = state.products.filter(
        (product) =>
          !(product.productId === productId && product.variantId === variantId)
      );
      state.count = state.products.length;
    },

    clearCart: (state) => {
      state.products = [];
      state.count = 0;
    },
  },
});

export const {
  addIntoCart,
  increseQuantity,
  decreseQuantity,
  removeProduct,
  clearCart,
} = cartReducer.actions;

export default cartReducer.reducer;
