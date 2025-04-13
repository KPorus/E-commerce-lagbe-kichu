"use client";
import { useGetOrderListQuery } from "@/lib/api/apiSlice";
import { useAppSelector } from "@/lib/hooks";
import { OrderItem } from "@/types/product.types";
import {
  Box,
  Flex,
  Image,
  Text,
  Table,
  Container,
  Button,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const OrderTable = () => {
  const router = useRouter();

  const user = useAppSelector((state) => state.auth.user);

  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  const { data, isLoading } = useGetOrderListQuery({
    page: currentPage,
    limit,
  });

  const orderItems:OrderItem[] = data?.orders || [];
  const totalOrders = data?.total || 0;
  const totalPages = Math.ceil(totalOrders / limit);
  // console.log(data?.total);
  // console.log("Total Orders:", totalOrders);
  // console.log("Total Pages:", totalPages);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!user) router.push("/login");
    }, 1000); 
    return () => clearTimeout(timer);
  }, [router, user]);

  return (
    <Container maxW={"breakpoint-xl"} mt={8}>
      <Box overflowX="auto">
        <Table.ScrollArea borderWidth="1px" rounded="md" height="460px">
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
                <Table.ColumnHeader textAlign={"center"}>
                  Status
                </Table.ColumnHeader>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {isLoading ? (
                <Table.Row>
                  <Table.Cell colSpan={5} textAlign="center">
                    <Text>Loading...</Text>
                  </Table.Cell>
                </Table.Row>
              ) : orderItems.length > 0 ? (
                orderItems.map((item, idx) => (
                  <Table.Row key={idx} bg="white">
                    <Table.Cell>
                      <Flex align="center">
                        <Image
                          boxSize="60px"
                          src={item.productImages?.[0]}
                          alt={item.productTitle}
                          objectFit="cover"
                          rounded="md"
                        />
                        <Text ml={2} fontWeight="medium">
                          {item.productTitle}
                        </Text>
                      </Flex>
                    </Table.Cell>
                    <Table.Cell textAlign="center">
                      ${item.productPrice}
                    </Table.Cell>
                    <Table.Cell textAlign="center">{item.quantity}</Table.Cell>
                    <Table.Cell textAlign="center">
                      ${item.totalPrice.toFixed(2)}
                    </Table.Cell>
                    <Table.Cell textAlign="center">
                      <Text
                        fontWeight="semibold"
                        color={
                          item.status === "Completed"
                            ? "green.500"
                            : item.status === "Rejected"
                            ? "red.500"
                            : item.status === "Processing"
                            ? "orange.400"
                            : "gray.600"
                        }
                      >
                        {item.status}
                      </Text>
                    </Table.Cell>
                  </Table.Row>
                ))
              ) : (
                <Table.Row bg="transparent">
                  <Table.Cell colSpan={5} textAlign="center">
                    <Text textStyle={"lg"} fontWeight={"medium"}>
                      No orders found.
                    </Text>
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table.Root>
        </Table.ScrollArea>

        {/* Pagination controls */}
        {totalPages > 1 && (
          <Flex justify="center" mt={4} gap={4}>
            <Button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              colorScheme="pink"
              variant="outline"
            >
              Previous
            </Button>
            <Text textAlign="center" fontWeight="semibold" mt={2}>
              Page {currentPage} of {totalPages}
            </Text>
            <Button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              colorScheme="pink"
              variant="outline"
            >
              Next
            </Button>
          </Flex>
        )}
      </Box>
    </Container>
  );
};

export default OrderTable;
