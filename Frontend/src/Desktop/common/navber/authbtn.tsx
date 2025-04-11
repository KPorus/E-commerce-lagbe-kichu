"use client";
import { Flex, Text } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";
import Button from "../button";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { logout } from "@/lib/features/authSlice";

const AuthBtn = () => {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
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
          <Text textStyle={"lg"}>Welcome, {user?.username}</Text>
          <Button
            text="Log Out"
            intent={"secondary"}
            onClick={()=>dispatch(logout())}
          />
        </Flex>
      )}
    </>
  );
};

export default AuthBtn;
