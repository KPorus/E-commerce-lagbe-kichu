"use client";
import { Toaster, toaster } from "@/components/ui/toaster";
import { checkout } from "@/lib/api/order";
import {
  addQuantity,
  decreaseQuantity,
  resetItem,
} from "@/lib/features/cartSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  Input,
  Stack,
  Text,
  Table,
  Grid,
  Container,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Cart = () => {
  const router = useRouter();
  const [address, setAddress] = useState({
    country: "",
    city: "",
    postalCode: "",
  });

  const isAddressValid = address.country && address.city && address.postalCode;
  const [value, setValue] = useState<string>("CASH");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.products);
  const token = useAppSelector((state) => state.auth.token);
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const shipping = 16;
  const total = subtotal + shipping;

  const handleCheckout = async () => {
    if (!token) {
      toaster.error({
        title: "Login required",
        description: "Please login to proceed with checkout.",
      });
      return router.push('/login');
    }
  
    const products = cartItems.map((item) => ({
      productId: item._id,
      quantity: item.quantity,
      price: item.price,
    }));
  
    const requestBody = {
      products,
      totalAmount: total,
      shippingAddress: `${address.country}, ${address.city}, ${address.postalCode}`,
      paymentMethod: value === "CASH" ? "CASH ON DELEVERY" : "BKASH",
    };
  
    try {
      const res = await checkout(requestBody, token);
      console.log(res);
      toaster.success({
        title: "Order Placed!",
        description: `${res.message}` || "Your order has been submitted successfully."
      });
      dispatch(resetItem());
    } catch (err) {
      toaster.error({
        title: "Checkout failed",
        description: "Please try again later.",
      });
      console.error(err);
    }
  };
  
  return (
    <Container maxW={"breakpoint-xl"} p={6}>
      <Toaster />
      <Grid templateColumns="repeat(2, 1fr)" gap="4">
        {/* 🛒 Left: Cart Table */}
        <Box overflowX="auto">
          <Table.ScrollArea borderWidth="1px" rounded="md" height="360px">
            <Table.Root interactive>
              <Table.Header>
                <Table.Row bg="#FB2E86">
                  <Table.ColumnHeader textAlign={"center"}>
                    Product
                  </Table.ColumnHeader>
                  <Table.ColumnHeader textAlign={"center"}>
                    Price
                  </Table.ColumnHeader>
                  <Table.ColumnHeader textAlign={"center"}>
                    Quantity
                  </Table.ColumnHeader>
                  <Table.ColumnHeader textAlign={"center"}>
                    Total
                  </Table.ColumnHeader>
                </Table.Row>
              </Table.Header>

              {cartItems.length > 0 ? (
                <Table.Body p={4}>
                  {cartItems.map((item, idx) => (
                    <Table.Row key={idx} bg="white">
                      <Table.Cell>
                        <Flex align="center">
                          <Image
                            boxSize="60px"
                            src={item.image}
                            alt={item.title}
                            mr={3}
                            rounded="md"
                          />
                          <Box>
                            <Text fontWeight="medium">{item.title}</Text>
                            <Text fontSize="sm" color="gray.500">
                              Rating: {item.rating}
                            </Text>
                          </Box>
                        </Flex>
                      </Table.Cell>
                      <Table.Cell>BDT {item.price}</Table.Cell>
                      <Table.Cell>
                        <Flex align="center" gap={2}>
                          <Button
                            size="sm"
                            onClick={() => dispatch(decreaseQuantity(item._id))}
                            colorScheme="gray"
                          >
                            -
                          </Button>
                          <Input
                            type="number"
                            value={item.quantity}
                            width="60px"
                            textAlign="center"
                            readOnly
                          />
                          <Button
                            size="sm"
                            onClick={() => dispatch(addQuantity(item._id))}
                            colorScheme="gray"
                          >
                            +
                          </Button>
                        </Flex>
                      </Table.Cell>
                      <Table.Cell>BDT {item.price * item.quantity}</Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              ) : (
                <Table.Body>
                  <Text mt={2} ml={4} fontWeight={"bold"}>
                    No product add to cart
                  </Text>
                </Table.Body>
              )}
            </Table.Root>
          </Table.ScrollArea>
          <Flex mt={4} gap={4}>
            {/* <Button colorScheme="pink">Update Cart</Button> */}
            <Button
              colorScheme="pink"
              background={"#F2F2F2"}
              py={8}
              px={8}
              color={"#FB2E86"}
              onClick={() => dispatch(resetItem())}
            >
              Clear Cart
            </Button>
          </Flex>
        </Box>

        {/* ✅ Right: Cart Totals + Shipping */}
        <Stack>
          {/* Cart Totals */}
          <Box borderWidth="1px" borderRadius="lg">
            <Heading size="md" p={4} background={"#FB2E86"} color={"#F2F2F2"}>
              Cart Totals
            </Heading>
            <Box p={6}>
              <Flex justify="space-between">
                <Text>Subtotal:</Text>
                <Text fontWeight="bold">BDT {subtotal}</Text>
              </Flex>
              <Flex justify="space-between" mt={2}>
                <Text>Shipping Cost:</Text>
                <Text fontWeight="bold">BDT {shipping}</Text>
              </Flex>
              <Flex justify="space-between" mt={2}>
                <Text>Total:</Text>
                <Text fontWeight="bold">BDT {total}</Text>
              </Flex>
              <Stack>
                <Input
                  placeholder="Country"
                  required
                  value={address.country}
                  onChange={(e) =>
                    setAddress({ ...address, country: e.target.value })
                  }
                />
                <Input
                  placeholder="City, Area"
                  value={address.city}
                  required
                  onChange={(e) =>
                    setAddress({ ...address, city: e.target.value })
                  }
                />
                <Input
                  placeholder="Postal Code"
                  value={address.postalCode}
                  required
                  onChange={(e) =>
                    setAddress({ ...address, postalCode: e.target.value })
                  }
                />
                <label>
                  <input
                    type="radio"
                    name="options"
                    value="CASH"
                    checked={value === "CASH"}
                    onChange={handleChange}
                  />
                  CASH
                </label>

                <label>
                  <input
                    type="radio"
                    name="options"
                    value="BKASH"
                    checked={value === "BKASH"}
                    onChange={handleChange}
                  />
                  BKASH
                </label>
              </Stack>
              <Text fontSize="sm" color="gray.500" mt={2}>
                Shipping & taxes calculated at checkout
              </Text>
              <Button
                w="full"
                mt={4}
                background={isAddressValid ? "#FB2E86" : "gray.300"}
                py={8}
                px={8}
                color={isAddressValid ? "#F2F2F2" : "gray.500"}
                onClick={handleCheckout}
                disabled={!isAddressValid}
                _hover={{ bg: isAddressValid ? "#e02777" : "gray.300" }}
              >
                Proceed To Checkout
              </Button>
            </Box>
          </Box>
        </Stack>
      </Grid>
    </Container>
  );
};

export default Cart;
