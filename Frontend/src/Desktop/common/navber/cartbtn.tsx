"use client";
import IconCart from "@/Desktop/icons/iconCart";
import { useAppSelector } from "@/lib/hooks";
import { Box } from "@chakra-ui/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const Cartbtn = () => {
  const cartItems = useAppSelector((state) => state.cart.products);
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <Link href={"/checkout"} className="relative">
      <div style={{ position: "relative" }}>
        <IconCart color="#333333" />
        {isMounted && totalQuantity >= 0 && (
          <Box
            background={"#FB2E86"}
            color={"#FFFFFF"}
            position={"absolute"}
            left={"13px"}
            top={"-19px"}
            w={"20px"}
            h={"20px"}
            borderRadius={"full"}
            textAlign={"center"}
            fontSize={"12px"}
            lineHeight={"20px"}
            border={"1px solid black"} // for debug visibility
          >
            {totalQuantity}
          </Box>
        )}
      </div>
    </Link>
  );
};

export default Cartbtn;
