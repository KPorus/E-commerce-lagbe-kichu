"use client";
import { Flex, Text } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";
import Button from "../button";
import { useAppSelector } from "@/lib/hooks";

const AuthBtn = () => {
  const user = useAppSelector((state) => state.auth.user);
  return (
    <>
      {!user ? (
        <Flex gap={5} alignItems={"center"}>
          <Link href={"/login"}>
            <Button text="Login" intent={"secondary"} />
          </Link>
          <Link href={"/register"}>
            <Button text="Sign up" intent={"secondary"} />
          </Link>
        </Flex>
      ) : (
        <Flex gap={5} alignItems={"center"}>
          {/* <Link href={"/login"}>
            <Button text="Login" intent={"secondary"} />
          </Link> */}
          <Text textStyle={'lg'}>Welcome, {user?.username}</Text>
            <Button text="Log Out" intent={"secondary"} />
        </Flex>
      )}
    </>
  );
};

export default AuthBtn;
