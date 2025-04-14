"use client";

import { useState, useEffect } from "react";
import LoadingPage from "@/app/loading";
import ProductCard from "@/Desktop/common/product-card";
import { useSearchProductsMutation } from "@/lib/api/apiSlice";
import { GetProductsParams, IProductCard } from "@/types/product.types";
import { Container, Text, Box, Input, Flex, Grid } from "@chakra-ui/react";

const ProductList = () => {
  const [searchProducts, { isLoading, data, error }] =
    useSearchProductsMutation();

  // States for the filters
  const [category, setCategory] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(0);

  const categories = ["ELECTRONICS", "CLOTHING", "FURNITURE", "BEAUTY"];

  // Default filter values
  const filters: GetProductsParams = {
    category,
    name,
    minPrice,
    maxPrice,
  };

  // Handle the search logic on filter changes
  const handleSearch = () => {
    searchProducts(filters);
  };

  useEffect(() => {
    handleSearch();
  }, [category, name, minPrice, maxPrice]);

  // Trigger search when any filter value changes
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
    handleSearch();
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    handleSearch();
  };

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMinPrice(Number(e.target.value));
    handleSearch();
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMaxPrice(Number(e.target.value));
    handleSearch();
  };

  console.log(data);

  return (
    <Container maxW={"breakpoint-xl"} mt={4}>
      <Box mb={4}>
        {/* Search Bar */}
        <Flex mb={4} gap={4} justify="space-between" align="center">
          <Input
            borderWidth="3px"
            borderColor="gray.600"
            p={4}
            placeholder="Search products..."
            value={name}
            onChange={handleNameChange}
            width="50%"
          />

          {/* Category Dropdown */}
          <div style={{ width: "20%" }}>
            <select
              id="category-select"
              value={category}
              onChange={handleCategoryChange}
              style={{
                width: "100%",
                background: "white",
                padding: "0.8rem",
                border: "2px solid gray",
              }}
            >
              <option value="">Select category</option>
              {categories.map((categoryItem) => (
                <option key={categoryItem} value={categoryItem}>
                  {categoryItem}
                </option>
              ))}
            </select>
          </div>

          {/* Min and Max Price Sliders */}
          <Flex direction="row" align="center">
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <label htmlFor="minPrice">Min Price: BDT {minPrice}</label>
              <input
                type="range"
                id="minPrice"
                min="0"
                max="1000"
                step="10"
                value={minPrice}
                onChange={handleMinPriceChange}
                style={{ width: "100px" }}
              />
              <label htmlFor="maxPrice">Max Price: BDT {maxPrice}</label>
              <input
                type="range"
                id="maxPrice"
                min="0"
                max="1000"
                step="10"
                value={maxPrice}
                onChange={handleMaxPriceChange}
                style={{ width: "100px" }}
              />
            </div>
          </Flex>

          {/* Search Button */}
          {/* <Button onClick={handleSearch} colorScheme="pink" variant="solid">
            Search
          </Button> */}
        </Flex>
      </Box>

      {isLoading ? (
        <LoadingPage />
      ) : error ? (
        <Text color="red.500">There was an error fetching the products</Text>
      ) : (
        <Grid templateColumns="repeat(4, 1fr)" gap={4}>
          {data && data.length > 0 ? (
            data.map((product: IProductCard) => (
              <ProductCard
                key={product._id}
                productId={product._id}
                image={product.images[0]}
                title={product.title}
                owner={product.Owner}
                description={product.description}
                specialDiscount={product.specialDiscount}
                discountEndTime={product.discountEndTime}
                price={product.price}
                discountPrice={product.discount}
                rating={product.rating}
              />
            ))
          ) : (
            <Text>No products found.</Text>
          )}
        </Grid>
      )}
    </Container>
  );
};

export default ProductList;
