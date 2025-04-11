"use client";

import { toaster } from "@/components/ui/toaster";
import Button from "@/Desktop/common/button";
import { useProductDetailsQuery } from "@/lib/api/apiSlice";
import { setCartProducts } from "@/lib/features/cartSlice";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import {
  Box,
  Image,
  Text,
  Heading,
  Spinner,
  Flex,
  Badge,
} from "@chakra-ui/react";
import Link from "next/link";

type Props = {
  id: string;
};

const ProductDetails = ({ id }: Props) => {
  const token = useAppSelector((state) => state.auth.token);
  const dispatch = useAppDispatch();

  const { data, isLoading, error } = useProductDetailsQuery({ id, token });

  if (isLoading) {
    return (
      <Flex justify="center" align="center" height="60vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (error || !data) {
    return (
      <Box textAlign="center" mt="10">
        <Text color="red.500">Failed to load product details.</Text>
      </Box>
    );
  }

  const {
    _id,
    title,
    description,
    price,
    category,
    images,
    previewVideo,
    seller,
    rating,
    specialDiscount,
    discountEndTime,
    discount,
  } = data;
  const image = images[0];
  const addCart = () => {
    dispatch(
      setCartProducts({
        _id,
        image,
        quantity: 1,
        title,
        price,
        rating,
        specialDiscount,
        discountEndTime,
        discount: discount || 0,
        Owner: seller._id,
      })
    );
    toaster.success({
      type: "success",
      title: "Item Added!",
    });
  };

  return (
    <Box maxW="1000px" mx="auto" mt={8} p={4}>
      <Flex direction={["column", "row"]} gap={8}>
        {/* Images */}
        <Box flex="1">
          <Image
            src={images?.[0]}
            alt={title}
            borderRadius="md"
            w="100%"
            h="auto"
            objectFit="cover"
          />
          {previewVideo && (
            <Box mt={4}>
              <video width="100%" controls>
                <source src={previewVideo} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </Box>
          )}
        </Box>

        {/* Product Info */}
        <Box flex="1">
          <Heading mb={2}>{title}</Heading>
          <Badge colorScheme="blue" mb={2}>
            {category}
          </Badge>
          <Text fontSize="xl" fontWeight="bold" mb={2}>
            ${price}
          </Text>
          <Text mb={2}>⭐ {rating} / 5</Text>
          <Text mb={4} color="gray.700">
            {description}
          </Text>

          <Box>
            <Text fontWeight="semibold">Seller:</Text>
            <Text>{seller?.username}</Text>
            <Text fontSize="sm" color="gray.500">
              {seller?.email}
            </Text>
          </Box>

          <Flex gap={4} mt={4} flexWrap="wrap">
            <Link href="/checkout">
              <Button intent="buyNow" text="Buy now" onClick={addCart} />
            </Link>
            <Button intent="addCart" text="Add to cart" onClick={addCart} />
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
};

export default ProductDetails;
