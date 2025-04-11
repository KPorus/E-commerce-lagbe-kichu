import { Container, Flex } from "@chakra-ui/react";
import AuthBtn from "./authbtn";
import RouteBtn from "./routebtn";

const Nav = () => {
  return (
    <Container maxW="breakpoint-xl" py={5}>
      <Flex  justifyContent={"space-between"} color={"#0D0E43"}>
        <Flex gap={5} alignItems={"center"}>
          <RouteBtn/>
        </Flex>
        <AuthBtn/>
      </Flex>
    </Container>
  );
};

export default Nav;
