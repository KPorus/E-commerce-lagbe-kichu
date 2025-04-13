import Footer from "@/Desktop/common/footer";
import Nav from "@/Desktop/common/navber";
import AddProductsPage from "@/Desktop/pages/seller/addProduct";
import { isMobile } from "@/utils/isMobile";
import { Box, Flex } from "@chakra-ui/react";
import { headers } from "next/headers";

export default function AddProducts() {
  const userAgent = headers().get("user-agent") || "";
  const isMobileDevice = isMobile(userAgent);
  return (
    <main>
      {isMobileDevice ? (
        <Flex
          alignItems={"center"}
          justifyContent="center"
          w={"100vw"}
          h="100vh"
        >
          <Box
            backgroundColor={"green.500"}
            padding="20px"
            borderRadius="8px"
            textAlign="center"
          >
            <p className="font-semibold">Mobile view is not avaiable</p>
          </Box>
        </Flex>
      ) : (
        <>
          <Nav />
          <AddProductsPage />
          <Footer />
        </>
      )}
    </main>
  );
}
