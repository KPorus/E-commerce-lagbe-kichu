// lib/store.ts

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import featuredProductsReducer from "./features/productSlice";
import cartProductsReducer from "./features/cartSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      featuredProducts: featuredProductsReducer,
      cart: cartProductsReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
