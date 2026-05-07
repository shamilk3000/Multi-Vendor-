import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    seller: null,
    user: null,
    sellerId: null,
    shopName: null,
  },
  reducers: {
    setSeller: (state, action) => {
      state.seller = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setSellerId: (state, action) => {
      state.sellerId = action.payload.sellerId;
      state.shopName = action.payload.shopName;
    },
    logout: (state) => {
      state.seller = null;
      // state.user = null;
      // state.shopName = null;
      // state.sellerId = null;
    },
    logoutUser: (state) => {
      state.user = null;
    },
  },
});

export const { setSeller, setUser, setSellerId, logout, logoutUser } =
  authSlice.actions;
export default authSlice.reducer;
