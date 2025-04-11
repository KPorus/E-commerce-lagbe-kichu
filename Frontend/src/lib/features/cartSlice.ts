import { cartProduct } from "@/types/product.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CartProductsState {
  products: cartProduct[];
}

const initialState: CartProductsState = {
  products:
    typeof window !== "undefined" && localStorage.getItem("cartProducts")
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
    addQuantity: (state, action: PayloadAction<string>) => {
      const item = state.products.find((p) => p._id === action.payload);
      if (item) {
        item.quantity += 1;
        localStorage.setItem("cartProducts", JSON.stringify(state.products));
      }
    },

    decreaseQuantity: (state, action: PayloadAction<string>) => {
      const item = state.products.find((p) => p._id === action.payload);
      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1;
        } else {
          state.products = state.products.filter(
            (p) => p._id !== action.payload
          );
        }
        localStorage.setItem("cartProducts", JSON.stringify(state.products));
      }
    },

    removeItem: (state, action: PayloadAction<string>) => {
      state.products = state.products.filter((p) => p._id !== action.payload);
      localStorage.setItem("cartProducts", JSON.stringify(state.products));
    },

    // Optional
    resetItem: (state) => {
      state.products = [];
      localStorage.removeItem("cartProducts");
    },
  },
});

export const {
  setCartProducts,
  addQuantity,
  decreaseQuantity,
  removeItem,
  resetItem,
} = cartProductsSlice.actions;
export default cartProductsSlice.reducer;
