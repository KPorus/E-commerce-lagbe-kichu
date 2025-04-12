"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/Desktop/common/product-card";
import SectionTitle from "@/Desktop/common/section-title";
import { IProductCard } from "@/types/product.types";
import { Button, Container, Flex, Grid } from "@chakra-ui/react";
import LoadingPage from "@/app/loading";
import { useSearchProductsMutation } from "@/lib/api/apiSlice";

const tabs = [
  { label: "New Arrival", value: "newProduct" },
  { label: "Best Seller", value: "bestArrival" },
  { label: "Featured", value: "featured" },
  { label: "Special Offer", value: "specialDiscount" },
];

const LatestProducts = () => {
  const [activeTab, setActiveTab] = useState(tabs[0].value);
  const [products, setProducts] = useState<IProductCard[]>([]);
  const [searchProducts, { isLoading }] = useSearchProductsMutation();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await searchProducts({ [activeTab]: true }).unwrap();
        setProducts(data.slice(0, 8));
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, [activeTab, searchProducts]);

  return (
    <Container maxW="breakpoint-xl">
      <SectionTitle title="Latest Products" />

      <Flex justify="center" gap={6} mb={10}>
        {tabs.map((tab) => (
          <Button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            fontWeight="medium"
            pb={1}
            color={activeTab === tab.value ? "pink.500" : "gray.600"}
            borderColor={activeTab === tab.value ? "pink.500" : "transparent"}
          >
            {tab.label}
          </Button>
        ))}
      </Flex>

      {isLoading ? (
        <LoadingPage />
      ) : (
        <Grid templateColumns="repeat(4, 1fr)" gap={4}>
          {products.map((product) => (
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
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default LatestProducts;
