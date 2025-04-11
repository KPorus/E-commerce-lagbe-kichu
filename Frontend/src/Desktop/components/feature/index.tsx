"use client";
import { useState, useEffect } from "react";
import { getproducts } from "@/lib/api/product";
import { useAppDispatch } from "@/lib/hooks";
import { Container, Flex } from "@chakra-ui/react";
import SectionTitle from "@/Desktop/common/section-title";
import ProductCard from "@/Desktop/common/product-card";
import { IProductCard } from "@/types/product.types";
import LoadingPage from "@/app/loading";

const Feature = () => {
  const dispatch = useAppDispatch();
   const [products, setProducts] = useState<IProductCard[]>([]);
    const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true)
        const data = await getproducts({ featured: true });
        if (data && Array.isArray(data)) {
          setProducts(data.slice(0, 4));
        } else {
          console.error("No products found in the response");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
      setLoading(false)
    };
    fetchFeaturedProducts();
  }, [dispatch]);

  return (
    <Container maxW="breakpoint-xl">
      <SectionTitle title="Featured Products" />
      {loading ? (
        <LoadingPage />
      ) :products.length > 0 ? (
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
