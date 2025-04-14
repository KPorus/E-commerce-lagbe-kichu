"use client";
import { useGetSellerProductQuery } from "@/lib/api/apiSlice";
import { useAppSelector } from "@/lib/hooks";
import { Button, Container, Grid, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IProductCard } from "@/types/product.types";
import ProductCard from "@/Desktop/common/product-card";
import LoadingPage from "@/app/loading";
import AddProductModal from "./addProductModal";

const SellerAddProduct = () => {
  const router = useRouter();
  const { user, token } = useAppSelector((state) => state.auth);
  console.log(user);
  const { data, isLoading, refetch, error } = useGetSellerProductQuery({
    token,
  });
  // console.log(data);
  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!user) router.push("/login");
    }, 1000);
    return () => clearTimeout(timer);
  }, [router, user]);
  return (
    <Container maxW={"breakpoint-xl"} mt={8}>
      <Button
        background={"#FB2E86"}
        py={8}
        px={8}
        mb={8}
        color={"#F2F2F2"}
        onClick={() => setIsModalOpen(true)}
      >
        + Add User
      </Button>

      <AddProductModal
        isOpen={isModalOpen}
        onClose={() => {
          refetch();
          setIsModalOpen(false);
        }}
      />
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
                  refetch={refetch}
                  category={product.category}
                  quantity={product.quantity}
                  newProduct={product.newProduct}
                  bestArrival={product.bestArrival}
                  featured={product.featured}
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

export default SellerAddProduct;
