import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import cartProductsReducer from "./features/cartSlice";
import { apiSlice } from "./api/apiSlice"; // Import your apiSlice

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      cart: cartProductsReducer,
      [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(apiSlice.middleware),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
