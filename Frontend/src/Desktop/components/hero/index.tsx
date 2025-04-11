import { Flex, Stack, Text } from "@chakra-ui/react";
import React from "react";
import styles from "./hero.module.scss";
import Image from "next/image";
import heroimageone from "/public/hero1.png";
import heroimagetwo from "/public/sofa.png";
import Button from "@/Desktop/common/button";
import Link from "next/link";
const Hero = () => {
  return (
    <Flex background={"#F2F0FF"} fontWeight={"semibold"}>
      <Image
        src={heroimageone}
        alt="hero"
        width={387}
        height={387}
        className={styles.heroImageone}
      />
      <Stack justifyContent={"center"} direction={"column"} gap={8}>
        <Text className={styles.heroSmallTitle} textStyle={"sm"}>
          Best Furniture For Your Castle....
        </Text>
        <Text className="font-bold" textStyle={"4xl"}>
          New Furniture Collection <br /> Trends in 2020
        </Text>
        <Text className="" textStyle={"sm"}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Purus commodo
          ipsum duis laoreet maecenas. Feugiat pretium nibh ipsum consequat.
          Tempus iaculis urna id volutpat lacus laoreet non curabitur gravida
          arcu ac.
        </Text>
        <Link href={'/product'} className="mt-14">
          <Button text="Shop Now" />
        </Link>
      </Stack>

      <Image
        src={heroimagetwo}
        alt="hero"
        width={529}
        height={529}
        // className={styles.heroImagetwo}
      />
    </Flex>
  );
};

export default Hero;
