import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    seller: null,
  },
  reducers: {
    setSeller: (state, action) => {
      state.seller = action.payload;
    },
    logout: (state) => {
      state.seller = null;
    },
  },
});

export const { setSeller, logout } = authSlice.actions;
export default authSlice.reducer;