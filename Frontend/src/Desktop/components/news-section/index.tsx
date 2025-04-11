import { Box, Container, Text } from "@chakra-ui/react";
import news from "/public/news.png";
import Button from "@/Desktop/common/button";
import Link from "next/link";
const NewsSection = () => {
  return (
    <Box
      backgroundImage={`url(${news.src})`}
      backgroundSize="cover"
      backgroundPosition="center"
      mt={10}
    >
      <Container
        maxW={"breakpoint-xl"}
        pt={"174px"}
        pb={"103px"}
        display={"flex"}
        alignItems={"center"}
        flexDirection={"column"}
        textAlign={"center"}
      >
        <Text
          fontSize={"4xl"}
          color={"rgb(26,11,91)"}
          mb={4}
          fontWeight={"bold"}
        >
          Get Leatest Update By Subscribe <br /> 0ur Newslater
        </Text>
        <Link href={"/product"}>
          <Button text="Shop Now" />
        </Link>
      </Container>
    </Box>
  );
};

export default NewsSection;
