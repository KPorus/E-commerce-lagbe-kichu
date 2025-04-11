"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/Desktop/common/product-card";
import { getproducts } from "@/lib/api/product";
import SectionTitle from "@/Desktop/common/section-title";
import { IProductCard } from "@/types/product.types";
import { Button, Container, Flex, Grid } from "@chakra-ui/react";
import LoadingPage from "@/app/loading";

const tabs = [
  { label: "New Arrival", value: "new" },
  { label: "Best Seller", value: "best" },
  { label: "Featured", value: "featured" },
  { label: "Special Offer", value: "offer" },
];

const LatestProducts = () => {
  const [activeTab, setActiveTab] = useState("new");
  const [products, setProducts] = useState<IProductCard[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      let queryParams = {};

      switch (activeTab) {
        case "new":
          queryParams = { newProduct: true };
          break;
        case "best":
          queryParams = { bestArrival: true };
          break;
        case "featured":
          queryParams = { featured: true };
          break;
        case "offer":
          queryParams = { specialDiscount: true };
          break;
        default:
          break;
      }

      try {
        const data = await getproducts(queryParams);
        setProducts(data.slice(0, 8));
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
      setLoading(false);
    };

    fetchProducts();
  }, [activeTab]);

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
            // borderBottom={activeTab === tab.value ? "2px solid" : "none"}
            borderColor={activeTab === tab.value ? "pink.500" : "transparent"}
          >
            {tab.label}
          </Button>
        ))}
      </Flex>

      {loading ? (
        <LoadingPage />
      ) : (
        <Grid templateColumns="repeat(4, 1fr)" gap="4">
          {products.map((product) => {
            return (
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
            );
          })}
        </Grid>
      )}
    </Container>
  );
};

export default LatestProducts;
