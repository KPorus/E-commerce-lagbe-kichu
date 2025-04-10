import { Container, Flex } from "@chakra-ui/react";
import Image from "next/image";
import React from "react";
import logo from "/public/Lagba Kichu1.png";
import Link from "next/link";
import Button from "@/Desktop/common/button";

const Nav = () => {
  return (
    <Container maxW="breakpoint-xl" py={5}>
      <Flex  justifyContent={"space-between"} color={"#0D0E43"}>
        <Flex gap={5} alignItems={"center"}>
          <Image src={logo} alt="Logo" width={100} height={50} />
          <Link href={"/"}><Button text="Home" intent={'tertiary'}/></Link>
          <Link href={"/"}><Button text="Product" intent={'tertiary'}/></Link>
        </Flex>
        <Flex gap={5} alignItems={"center"}>
          <Link href={"/login"}><Button text="Login" intent={'secondary'}/></Link>
          <Link href={"/register"}><Button text="Sign up" intent={'secondary'}/></Link>
        </Flex>
      </Flex>
    </Container>
  );
};

export default Nav;
