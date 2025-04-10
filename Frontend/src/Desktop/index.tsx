"use client";
import React from "react";
import { useAppDispatch, useAppSelector } from "../lib/hooks";
import { useRouter } from "next/router";

const Desktop = () => {
  // const dispatch = useAppDispatch();
  // const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  if (!user) return <div>Loading...</div>;
  console.log(user);
  return <div>Welcome,{user?.username}</div>;
};

export default Desktop;
