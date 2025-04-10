// lib/store.ts

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import featuredProductsReducer from "./features/productSlice";

export const makeStore = () => {
  return configureStore({
    reducer: { auth: authReducer, featuredProducts: featuredProductsReducer },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
