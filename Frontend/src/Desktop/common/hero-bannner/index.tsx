import { Box, Container, Text } from "@chakra-ui/react";
import React from "react";
import style from './herobanner.module.scss'
const HeroBanner = ({ title }: { title: string }) => {
  return (
    <Box background={"#F6F5FF"} pt={'96px'} pb={'127px'}>
      <Container maxW={'breakpoint-xl'}>
        <Text textStyle={"4xl"} color={'#101750'} >{title}</Text>
        <Text textStyle={"sm"}  display={'flex'} flexDirection={'row'}>Home .{' '}
            <span className={style.small}> {title}</span>
        </Text>
      </Container>
    </Box>
  );
};

export default HeroBanner;
