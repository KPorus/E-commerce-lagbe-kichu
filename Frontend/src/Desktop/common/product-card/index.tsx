import { Box, Flex, Text } from "@chakra-ui/react";
import Image from "next/image";
import React from "react";
import Button from "../button";
import Rating from "../rating";

const ProductCard = ({
  productId,
  image,
  description,
  title,
  price,
  discountPrice,
  rating,
}: {
  productId: string;
  image: string;
  title: string;
  description: string;
  price: number;
  discountPrice?: number;
  rating?: number;
}) => {
  return (
    // <Card.Root key={productId} maxW="sm" overflow="hidden">
    //   <Card.Body gap="2">
    //     <Box w={240} h={236} position="relative">
    //       <Image src={image} alt={title} layout="fill" />
    //     </Box>
    //     <Card.Title>{title}</Card.Title>
    //     <Card.Description>{description.slice(0, 210)}</Card.Description>
    //     <Text textStyle="2xl" fontWeight="medium" letterSpacing="tight" mt="2">
    //       {discountPrice ? `$${discountPrice}` : `$${price}`}
    //     </Text>
    //   </Card.Body>
    //   <Card.Footer gap="2">
    //     <Button variant="solid">Buy now</Button>
    //     <Button variant="ghost">Add to cart</Button>
    //   </Card.Footer>
    // </Card.Root>

    <Box
      key={productId}
      className="border rounded-lg"
      p={4}
      alignItems={"center"}
      mb={8}
    >
      <Box w={240} h={236} position="relative">
        <Image src={image} alt={title} layout="fill" />
      </Box>
      <Text
        className="text-lg font-bold"
        color={"#FB2E86"}
        mt={4}
        textAlign={"center"}
      >
        {title}
      </Text>
      <Text textStyle={"md"} my={2}>
        {description.slice(0, 210)}
      </Text>
      <Flex justifyContent={'space-between'}>
        <Text color={"#151875"} className="text-lg font-semibold">
          {discountPrice ? `$${discountPrice}` : `$${price}`}
        </Text>
        <Rating value={Number(rating)} />
      </Flex>
      <Flex gap={2} mt={4}>
        <Button intent={"buyNow"} text="Buy now" />
        <Button intent={"addCart"} text="Add to cart" />
      </Flex>
    </Box>
  );
};

export default ProductCard;
