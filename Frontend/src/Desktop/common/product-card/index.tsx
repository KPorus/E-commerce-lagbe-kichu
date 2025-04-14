import { Box, Flex, Text } from "@chakra-ui/react";
import Image from "next/image";
import Rating from "../rating";
import ProductCardBtn from "./button";
import Link from "next/link";

interface ProductCardProps {
  productId: string;
  image: string;
  title: string;
  owner: string;
  description: string;
  price: number;
  discountPrice?: number;
  specialDiscount: boolean;
  discountEndTime?: number;
  rating?: number;
  refetch?: () => void;
  category?: "ELECTRONICS" | "CLOTHING" | "FURNITURE" | "BEAUTY";
  quantity?: number;
  newProduct?: boolean;
  bestArrival?: boolean;
  featured?: boolean;
}

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
  refetch,
  category,
  quantity,
  newProduct,
  bestArrival,
  featured,
}: ProductCardProps) => {
  return (
    <Box
      key={productId}
      className="border rounded-lg shadow-lg hover:shadow-xl transition-shadow"
      p={4}
      alignItems={"center"}
      mb={8}
      bg="white"
      borderRadius="lg"
    >
      <Link href={`/product/${productId}`} passHref>
        <Box as="span">
          <Box w={"257px"} h={"236px"} position="relative" mb={4} mx="auto">
            <Image
              src={image}
              alt={title}
              width={240}
              height={240}
              style={{
                width: "255px",
                height: "236px",
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />
          </Box>
          <Text
            className="text-lg font-bold"
            color={"#FB2E86"}
            mt={4}
            textAlign={"center"}
          >
            {title}
          </Text>
          <Text textStyle={"md"} my={2} color="gray.600">
            {description.slice(0, 210)}
          </Text>
          <Flex justifyContent={"space-between"} alignItems="center">
            <Text color={"#151875"} className="text-lg font-semibold">
              {discountPrice ? `BDT ${(price*discountPrice)/100}` : `BDT ${price}`}
            </Text>
            <Rating value={Number(rating)} />
          </Flex>
        </Box>
      </Link>

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
        refetch={refetch}
        description={description}
        category={category}
        quantity={quantity}
        newProduct={newProduct}
        bestArrival={bestArrival}
        featured={featured}
      />
    </Box>
  );
};

export default ProductCard;
