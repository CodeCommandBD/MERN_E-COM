import { createSlice } from "@reduxjs/toolkit";
import { userApiSlice } from "@/store/api/userApiSlice";

const initialState = {
  auth: null,
};

export const authReducer = createSlice({
  name: "authStore",
  initialState,
  reducers: {
    login: (state, action) => {
      state.auth = action.payload;
    },
    logout: (state, action) => {
      state.auth = null;
    },
    updateAvatar: (state, action) => {
      if (state.auth) {
        state.auth.avatar = action.payload;
        // Add timestamp to force cache-busting when avatar changes
        state.auth.avatarUpdatedAt = Date.now();
      }
    },
  },
  extraReducers: (builder) => {
    // Automatically update auth state when updateUser mutation succeeds
    // This ensures Navbar and other components reflect changes immediately
    builder.addMatcher(
      userApiSlice.endpoints.updateUser.matchFulfilled,
      (state, action) => {
        if (action.payload.success) {
          state.auth = {
            ...state.auth,
            ...action.payload.data,
            avatarUpdatedAt: action.payload.data.avatarUpdatedAt || Date.now(),
          };
        }
      }
    );
  },
});

export const { login, logout, updateAvatar } = authReducer.actions;

export default authReducer.reducer;
