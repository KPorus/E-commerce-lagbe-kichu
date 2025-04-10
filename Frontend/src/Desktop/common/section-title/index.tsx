import { Box, Text } from "@chakra-ui/react";
import React from "react";

const SectionTitle = ({ title }: { title: string }) => {
  return (
    <Box color={'#1A0B5B'} fontWeight={'bold'} py={10}>
      <Text textAlign={"center"} textStyle={'4xl'}>{title}</Text>
    </Box>
  );
};

export default SectionTitle;
