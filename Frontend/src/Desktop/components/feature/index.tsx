"use client";
import { useState, useEffect } from "react";
import { Container, Flex } from "@chakra-ui/react";
import SectionTitle from "@/Desktop/common/section-title";
import ProductCard from "@/Desktop/common/product-card";
import { IProductCard } from "@/types/product.types";
import LoadingPage from "@/app/loading";
import { useSearchProductsMutation } from "@/lib/api/apiSlice";

const Feature = () => {
  const [products, setProducts] = useState<IProductCard[]>([]);
  const [searchProducts, { isLoading }] = useSearchProductsMutation();

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await searchProducts({ featured: true }).unwrap();

        if (Array.isArray(response)) {
          setProducts(response.slice(0, 4));
        } else {
          console.error("Unexpected response structure:", response);
        }
      } catch (error) {
        console.error("Error fetching featured products:", error);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <Container maxW="breakpoint-xl">
      <SectionTitle title="Featured Products" />
      {isLoading ? (
        <LoadingPage />
      ) : products.length > 0 ? (
        <Flex gap={8}>
          {products.map((product) => (
            <ProductCard
              key={product._id}
              productId={product._id}
              image={product.images[0]}
              title={product.title}
              description={product.description}
              owner={product.Owner}
              price={product.price}
              specialDiscount={product.specialDiscount}
              discountEndTime={product.discountEndTime}
              discountPrice={product.discount}
              rating={product.rating}
            />
          ))}
        </Flex>
      ) : (
        <p>No featured products available.</p>
      )}
    </Container>
  );
};

export default Feature;
