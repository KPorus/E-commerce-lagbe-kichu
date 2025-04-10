import { Container } from "@chakra-ui/react";
import Image from "next/image";
import React from "react";
import ad from "/public/ad.png";
const Ad = () => {
  return (
    <Container
      maxW={"breakpoint-xl"}
      display={"flex"}
      justifyContent={"center"}
      my={8}
    >
      <Image
        src={ad}
        alt="ad"
        width={1000}
        height={1000}
        style={{
          width: "100%",
          height: "100%",
        }}
      />
    </Container>
  );
};

export default Ad;
