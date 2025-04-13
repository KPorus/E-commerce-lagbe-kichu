"use client";
import { Flex, Text } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";
import Button from "../button";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { logout } from "@/lib/features/authSlice";
import axios from "axios";
import { toaster } from "@/components/ui/toaster";
const AuthBtn = () => {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    try {
      await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
        withCredentials: true,
      });
      dispatch(logout());
      toaster.success({
        title: "Logged out.",
        description: "You have been logged out successfully.",
      });
    } catch (error: unknown) {
      toaster.error({
        title: "Logout failed.",
        description: `Something went wrong while logging out.${error}`,
      });
    }
  };
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
          <Text textStyle={"lg"}>Welcome, {user?.username}</Text>
          <Button
            text="Log Out"
            intent={"secondary"}
            onClick={handleLogout}
          />
        </Flex>
      )}
    </>
  );
};

export default AuthBtn;
