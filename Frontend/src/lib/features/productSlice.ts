import { Product } from "@/types/product.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FeaturedProductsState {
  products: Product[];
}

const initialState: FeaturedProductsState = {
  products: localStorage.getItem("featuredProducts")
    ? JSON.parse(localStorage.getItem("featuredProducts") || "[]")
    : [],
};

const featuredProductsSlice = createSlice({
  name: "featuredProducts",
  initialState,
  reducers: {
    setFeaturedProducts: (state, action: PayloadAction<Product[]>) => {
      console.log("Setting featured products:", action.payload); // Debugging
      state.products = action.payload;

      // Check the localStorage before setting the value
      console.log("Storing in localStorage:", action.payload);
      localStorage.setItem("featuredProducts", JSON.stringify(action.payload));
    },

    // Optional
    resetFeaturedProducts: (state) => {
      state.products = [];
      localStorage.removeItem("featuredProducts");
    },
  },
});

export const { setFeaturedProducts, resetFeaturedProducts } =
  featuredProductsSlice.actions;
export default featuredProductsSlice.reducer;
