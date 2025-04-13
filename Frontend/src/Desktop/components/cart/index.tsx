"use client";
import { toaster } from "@/components/ui/toaster";
import { useCheckoutMutation } from "@/lib/api/apiSlice";
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
  const [hasMounted, setHasMounted] = useState(false);

  const router = useRouter();
  const [address, setAddress] = useState({
    country: "",
    city: "",
    postalCode: "",
  });
  const [value, setValue] = useState<string>("CASH");
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.products);
  const token = useAppSelector((state) => state.auth.token);
  const [checkout, { isLoading }] = useCheckoutMutation();
  
  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null;
  const isAddressValid = address.country && address.city && address.postalCode;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

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
      return router.push("/login");
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
      const res = await checkout({ body: requestBody, token }).unwrap();
      // console.log(res);
      toaster.success({
        title: "Order Placed!",
        description:
          `${res.message}` || "Your order has been submitted successfully.",
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
      <Grid templateColumns="repeat(2, 1fr)" gap="4">
        {/* Left: Cart Table */}
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

              <Table.Body>
                {isLoading ? (
                  <Table.Row>
                    <Table.Cell colSpan={4} textAlign="center">
                      <Text>Loading...</Text>
                    </Table.Cell>
                  </Table.Row>
                ) : cartItems.length > 0 ? (
                  cartItems.map((item, idx) => (
                    <Table.Row key={idx} bg="white">
                      <Table.Cell>
                        <Flex align="center">
                          <Image
                            boxSize="60px"
                            src={item.image}
                            alt={item.title}
                            style={{ width: "60px", height: "60px" }}
                          />
                          <Text ml={2}>{item.title}</Text>
                        </Flex>
                      </Table.Cell>
                      <Table.Cell textAlign="center">${item.price}</Table.Cell>
                      <Table.Cell textAlign="center">
                        <Flex align="center" justify="center">
                          <Button
                            size="sm"
                            onClick={() => dispatch(decreaseQuantity(item._id))}
                          >
                            -
                          </Button>
                          <Text mx={2}>{item.quantity}</Text>
                          <Button
                            size="sm"
                            onClick={() => dispatch(addQuantity(item._id))}
                          >
                            +
                          </Button>
                        </Flex>
                      </Table.Cell>
                      <Table.Cell textAlign="center">
                        ${(item.price * item.quantity).toFixed(2)}
                      </Table.Cell>
                    </Table.Row>
                  ))
                ) : (
                  <Table.Row bg="transparent">
                    <Table.Cell colSpan={4} textAlign="center">
                      <Text textStyle={"lg"} fontWeight={"medium"}>
                        No items in the cart
                      </Text>
                    </Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table.Root>
          </Table.ScrollArea>
          <Flex mt={4} gap={4}>
            <Button
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

        {/* Right: Cart Totals + Shipping */}
        <Stack>
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
                disabled={!isAddressValid || isLoading}
                loading={isLoading}
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
