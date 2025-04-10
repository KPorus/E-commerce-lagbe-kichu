"use client";
import { useState, useEffect } from "react";
import { getproducts } from "@/lib/api/product";
import { setFeaturedProducts } from "@/lib/features/productSlice";
import { useAppDispatch } from "@/lib/hooks";
import { RootState } from "@/lib/store";
import { Container, Flex } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import SectionTitle from "@/Desktop/common/section-title";
import ProductCard from "@/Desktop/common/product-card";

const Feature = () => {
  const dispatch = useAppDispatch();
  //   const [loading, setLoading] = useState(true); // Add loading state

  const featuredProducts = useSelector(
    (state: RootState) => state.featuredProducts.products || []
  );

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const data = await getproducts({ featured: true });
        if (data && Array.isArray(data)) {
          dispatch(setFeaturedProducts(data.slice(0, 4)));
        } else {
          console.error("No products found in the response");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchFeaturedProducts();
  }, [dispatch]);

  return (
    <Container maxW="breakpoint-xl">
      <SectionTitle title="Featured Products" />
      {featuredProducts.length > 0 ? (
        <Flex gap={8}>
          {featuredProducts.map((product) => (
            <ProductCard
            key={product._id}
            productId={product._id}
            image={product.images[0]}
            title={product.title}
            description={product.description}
            price={product.price}
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
