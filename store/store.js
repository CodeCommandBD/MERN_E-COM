import { combineReducers } from "@reduxjs/toolkit";
import persistReducer from "redux-persist/es/persistReducer";
import localStorage from "redux-persist/es/storage";
import { configureStore } from "@reduxjs/toolkit";
import persistStore from "redux-persist/es/persistStore";
import authReducer from "./reducer/authReducer";
import cartReducer from "./reducer/cartReducer";
import orderReducer from "./reducer/orderReducer";

import { apiSlice } from "./api/apiSlice";

const rootReducer = combineReducers({
  authStore: authReducer,
  cartStore: cartReducer,
  orderStore: orderReducer,
  [apiSlice.reducerPath]: apiSlice.reducer,
});

const persistConfig = {
  key: "root",
  storage: localStorage,
  blacklist: [apiSlice.reducerPath], // Don't persist API cache
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(apiSlice.middleware),
});

export const persistor = persistStore(store);
