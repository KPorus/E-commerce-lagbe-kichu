"use client";
import { Flex } from "@chakra-ui/react";
import React from "react";
import Button from "../button";
import { useAppDispatch } from "@/lib/hooks";
import { setCartProducts } from "@/lib/features/cartSlice";

const ProductCardBtn = ({
  _id,
  image,
  title,
  price,
  rating,
  Owner,
  discount,
}: {
  _id: string;
  image: string;
  title: string;
  price: number;
  Owner:string,
  rating?: number;
  discount?: number;
}) => {
  const dispatch = useAppDispatch();

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
        discount: discount || 0,
      })
    );
  };

  return (
    <Flex gap={2} mt={4}>
      <Button intent="buyNow" text="Buy now" />
      <Button intent="addCart" text="Add to cart" onClick={addCart} />
    </Flex>
  );
};

export default ProductCardBtn;
