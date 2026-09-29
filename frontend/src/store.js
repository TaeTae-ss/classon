import { configureStore } from "@reduxjs/toolkit";
import memberReducer from "./slice/memberSlice";

const store = configureStore({
  reducer: {
    member: memberReducer,
  },
});

export default store;