import { Box, Flex, Text } from "@chakra-ui/react";
import Image from "next/image";
import Rating from "../rating";
import ProductCardBtn from "./button";
import Link from "next/link";

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
  refetch
}: {
  productId: string;
  image: string;
  title: string;
  owner: string;
  description: string;
  price: number;
  discountPrice?: number;
  specialDiscount: boolean;
  discountEndTime?: Date | null;
  rating?: number;
  refetch?: () => void;
}) => {
  return (
    <Box
      key={productId}
      className="border rounded-lg"
      p={4}
      alignItems={"center"}
      mb={8}
    >
      <Link href={`/product/${productId}`} passHref>
        <Box as="span">
          {" "}
          {/* Use Box as span to avoid <a> nesting issues */}
          <Box w={"257px"} h={"236px"} position="relative" mb={4}>
            <Image
              src={image}
              alt={title}
              width={240}
              height={240}
              style={{
                width: "255px",
                height: "236px",
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
          <Text textStyle={"md"} my={2}>
            {description.slice(0, 210)}
          </Text>
          <Flex justifyContent={"space-between"}>
            <Text color={"#151875"} className="text-lg font-semibold">
              {discountPrice ? `$${discountPrice}` : `$${price}`}
            </Text>
            <Rating value={Number(rating)} />
          </Flex>
        </Box>
      </Link>

      {/* Buttons are outside the Link to avoid nesting */}
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
      />
    </Box>
  );
};

export default ProductCard;
