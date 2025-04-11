import { Box, Flex, Text } from "@chakra-ui/react";
import Image from "next/image";
import Rating from "../rating";
import ProductCardBtn from "./button";

const ProductCard = ({
  productId,
  image,
  description,
  title,
  owner,
  price,
  discountPrice,
  specialDiscount,
  discountEndTime,
  rating,
}: {
  productId: string;
  image: string;
  title: string;
  owner: string;
  description: string;
  price: number;
  discountPrice?: number;
  rating?: number;
  specialDiscount: boolean;
  discountEndTime?: Date | null;
}) => {
  // console.log(image);
  return (
    <Box
      key={productId}
      className="border rounded-lg"
      p={4}
      alignItems={"center"}
      mb={8}
    >
      <Box w={"240px"} h={"236px"} position="relative">
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
      <Flex justifyContent={"space-between"}>
        <Text color={"#151875"} className="text-lg font-semibold">
          {discountPrice ? `$${discountPrice}` : `$${price}`}
        </Text>
        <Rating value={Number(rating)} />
      </Flex>
      <ProductCardBtn
        _id={productId}
        image={image}
        title={title}
        Owner={owner}
        price={price}
        specialDiscount={specialDiscount}
        discountEndTime={discountEndTime}
        rating={rating}
        discount={discountPrice}
      />
    </Box>
  );
};

export default ProductCard;
