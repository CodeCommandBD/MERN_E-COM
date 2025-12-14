import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  auth: null
}

export const authReducer = createSlice({
  name: 'authStore',
  initialState,
  reducers: {
    login : (state, action) => {
        state.auth = action.payload
    },
    logout : (state, action) => {
        state.auth = null
    },
    updateAvatar : (state, action) => {
        if (state.auth) {
            state.auth.avatar = action.payload
            // Add timestamp to force cache-busting when avatar changes
            state.auth.avatarUpdatedAt = Date.now()
        }
    }
  }
    

})

export const {login, logout, updateAvatar } = authReducer.actions

export default authReducer.reducer