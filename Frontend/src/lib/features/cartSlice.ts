import { cartProduct } from "@/types/product.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CartProductsState {
  products: cartProduct[];
}

const initialState: CartProductsState = {
  products: typeof window !== "undefined" && localStorage.getItem("cartProducts")
    ? JSON.parse(localStorage.getItem("cartProducts")!)
    : [],
};


const cartProductsSlice = createSlice({
  name: "cartProducts",
  initialState,
  reducers: {
    setCartProducts: (state, action: PayloadAction<cartProduct>) => {
      const existingIndex = state.products.findIndex(
        (p) => p._id === action.payload._id
      );

      if (existingIndex !== -1) {
        state.products[existingIndex].quantity += action.payload.quantity;
      } else {
        state.products.push(action.payload);
      }

      localStorage.setItem("cartProducts", JSON.stringify(state.products));
    },

    // Optional
    resetCartProducts: (state) => {
      state.products = [];
      localStorage.removeItem("featuredProducts");
    },
  },
});

export const { setCartProducts, resetCartProducts } = cartProductsSlice.actions;
export default cartProductsSlice.reducer;
