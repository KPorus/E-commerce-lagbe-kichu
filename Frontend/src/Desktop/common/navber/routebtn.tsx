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
      {user?.role == "USER" && user ? (
        <>
          <Link href={"/"}>
            <Button text="Home" intent={"tertiary"} />
          </Link>
          <Link href={"/"}>
            <Button text="Product" intent={"tertiary"} />
          </Link>
          <Link href={"/order"}>
            <Button text="Order" intent={"tertiary"} />
          </Link>
        </>
      ) : (
        <>
          <Link href={"/"}>
            <Button text="Home" intent={"tertiary"} />
          </Link>
          <Link href={"/"}>
            <Button text="Product" intent={"tertiary"} />
          </Link>
        </>
      )}
      <Cartbtn />
    </Flex>
  );
};

export default RouteBtn;
