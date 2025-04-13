"use client";
import { Flex } from "@chakra-ui/react";
import React from "react";
import Button from "../button";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setCartProducts } from "@/lib/features/cartSlice";
import { toaster } from "@/components/ui/toaster";
import Link from "next/link";

const ProductCardBtn = ({
  _id,
  image,
  title,
  price,
  rating,
  Owner,
  specialDiscount,
  discountEndTime,
  discount,
}: {
  _id: string;
  image: string;
  title: string;
  price: number;
  Owner: string;
  specialDiscount: boolean;
  discountEndTime?: Date | null;
  rating?: number;
  discount?: number;
}) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const addCart = () => {
    dispatch(
      setCartProducts({
        _id,
        image,
        quantity: 1,
        title,
        price,
        Owner,
        rating,
        specialDiscount,
        discountEndTime,
        discount: discount || 0,
      })
    );
    toaster.success({
      type: "success",
      title: "Item Added!",
      // description: "The item has been successfully added to your cart.",
    });
  };

  return (
    <>
      {user?.role === "SELLER" || user?.role === "ADMIN" ? (
        <Flex mt={4} gap={4}>
          <Button intent="addCart" text="Delete" />
          <Button intent="buyNow" text="Edit" />
        </Flex>
      ) : (
        <Flex gap={2} mt={4}>
          <Link href={"/checkout"}>
            <Button intent="buyNow" text="Buy now" onClick={addCart} />
          </Link>
          <Button intent="addCart" text="Add to cart" onClick={addCart} />
        </Flex>
      )}
    </>
  );
};

export default ProductCardBtn;
