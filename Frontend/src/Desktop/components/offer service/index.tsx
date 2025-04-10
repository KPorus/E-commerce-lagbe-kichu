import SectionTitle from "@/Desktop/common/section-title";
import { Container, Flex, Text } from "@chakra-ui/react";
import Image from "next/image";
import offer from "/public/free-delivery 1.png";
const OfferService = () => {
  return (
    <Container maxW={"breakpoint-xl"}>
      <SectionTitle title="What Shopex Offer!" />
      <Flex justifyContent="space-between" gap={6} alignItems={"center"}>
        {Array(4)
          .fill(null)
          .map((_, index) => (
            <Flex
              key={index}
              alignItems={"center"}
              direction={"column"}
              textAlign="center"
              p={4}
               className="border rounded-lg"
            >
              <Image src={offer} alt="offer" width={65} height={65} />
              <Text fontWeight={"bold"} mt={2} color={"rgb(26,11,91)"}>
                24/7 Support
              </Text>
              <Text fontWeight={"normal"} color={"rgb(26,11,91,0.3)"} mt={2}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Massa
                purus gravida.
              </Text>
            </Flex>
          ))}
      </Flex>
    </Container>
  );
};

export default OfferService;
