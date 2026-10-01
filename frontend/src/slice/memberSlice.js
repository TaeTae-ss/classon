import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLogin: false,
  member: null,
};

const memberSlice = createSlice({
  name: "member",
  initialState,
  reducers: {
    // 로그인
    login: (state, action) => {
      state.isLogin = true;
      state.member = action.payload;
    },

    // 로그아웃
    logout: (state) => {
      state.isLogin = false;
      state.member = null;
    },
  },
});

export const { login, logout } = memberSlice.actions;

export default memberSlice.reducer;