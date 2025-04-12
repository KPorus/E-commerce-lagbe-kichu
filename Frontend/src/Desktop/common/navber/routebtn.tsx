"use client";
import { Flex } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import Button from "../button";
import Cartbtn from "./cartbtn";
import logo from "/public/Lagba Kichu1.png";
import { useAppSelector } from "@/lib/hooks";
const RouteBtn = () => {
  const user = useAppSelector((state) => state.auth.user);
  console.log(user);
  return (
    <Flex gap={5} alignItems={"center"}>
      <Image src={logo} alt="Logo" width={100} height={50} />
      {/* Common for all users */}
      <Link href={"/"}>
        <Button text="Home" intent={"tertiary"} />
      </Link>
      {user?.role === "SELLER" || user?.role === "ADMIN" ? "" :
      <Link href={"/product"}>
        <Button text="Product" intent={"tertiary"} />
      </Link>}

      {/* USER only */}
      {user?.role === "USER" && (
        <>
          <Link href={"/order"}>
            <Button text="Order" intent={"tertiary"} />
          </Link>
        </>
      )}

      {/* ADMIN only */}
      {user?.role === "ADMIN" && (
        <Link href={"/admin/dashboard"}>
          <Button text="Dashboard" intent={"tertiary"} />
        </Link>
      )}

      {/* SELLER only */}
      {user?.role === "SELLER" && (
        <>
          <Link href={"/seller/dashboard"}>
            <Button text="Seller Dashboard" intent={"tertiary"} />
          </Link>
          <Link href={"/seller/add-product"}>
            <Button text="Add Product" intent={"tertiary"} />
          </Link>
          <Link href={"/seller/orders"}>
            <Button text="My Orders" intent={"tertiary"} />
          </Link>
        </>
      )}

      {user?.role === "SELLER" || user?.role === "ADMIN" ? "" : <Cartbtn />}
    </Flex>
  );
};

export default RouteBtn;
