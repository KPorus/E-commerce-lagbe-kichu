"use client";
import IconCart from "@/Desktop/icons/iconCart";
import { useAppSelector } from "@/lib/hooks";
import { Box } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";

const Cartbtn = () => {
  const cartItems = useAppSelector((state) => state.cart.products);
  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <Link href={"/"}>
      <div className="relative">
        <IconCart color="#333333" />
        <Box
          background={"#FB2E86"}
          color={"#FFFFFF"}
          position={"absolute"}
          left={"314px"}
          top={"20px"}
          w={"20px"}
          h={"20px"}
          borderRadius={"full"}
          textAlign={"center"}
          fontSize={"12px"}
          lineHeight={"20px"}
        >
          {totalQuantity}
        </Box>
      </div>
    </Link>
  );
};

export default Cartbtn;
