"use client";
import { toaster } from "@/components/ui/toaster";
import {
  useGetSellerOrderQuery,
  useUpdateOrderStatusMutation,
} from "@/lib/api/apiSlice";
import { useAppSelector } from "@/lib/hooks";
import { IOrder } from "@/types/seller";

import { Box, Flex, Text, Table, Container, Button } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const SellerOrderTable = () => {
  const router = useRouter();
  const [updateOrderStatus] = useUpdateOrderStatusMutation();
  const user = useAppSelector((state) => state.auth.user);
  const token = useAppSelector((state) => state.auth.token);

  const [currentPage, setCurrentPage] = useState(1);
  const limit = 5;

  // Skip query if token is not available
  const { data, isLoading, refetch } = useGetSellerOrderQuery(
    { page: currentPage, limit },
    { skip: !token }
  );

  const orderItems: IOrder[] = data?.orders || [];
  const totalOrders = data?.total || 0;
  const totalPages = Math.ceil(totalOrders / limit);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    if (!token) {
      toaster.error({
        title: "Auth Error",
        description: "Please log in to update order status.",
      });
      router.push("/login");
      return;
    }

    try {
      const res = await updateOrderStatus({
        id: orderId,
        status: newStatus,
        token,
      }).unwrap();

      console.log(res);
      toaster.success({
        title: "Order Status",
        description: `Order state updated to ${newStatus}`,
      });

      await new Promise((resolve) => setTimeout(resolve, 500));
      await refetch();

      console.log(`Changing status for order ${orderId} to ${newStatus}`);
    } catch (error) {
      console.error("Failed to update order status:", error);
      toaster.error({
        title: "Update Failed",
        description: "Could not update the order status. Try again.",
      });
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!user) router.push("/login");
    }, 1000);
    return () => clearTimeout(timer);
  }, [user, router]);

  return (
    <Container maxW={"breakpoint-xl"} mt={8}>
      <Box overflowX="auto">
        <Table.Root interactive>
          <Table.Header>
            <Table.Row bg="#FB2E86">
              <Table.ColumnHeader textAlign={"center"}>
                Product Name
              </Table.ColumnHeader>
              <Table.ColumnHeader textAlign={"center"}>
                Price
              </Table.ColumnHeader>
              <Table.ColumnHeader textAlign={"center"}>
                Quantity
              </Table.ColumnHeader>
              <Table.ColumnHeader textAlign={"center"}>
                Payment Method
              </Table.ColumnHeader>
              <Table.ColumnHeader textAlign={"center"}>
                Shipping Address
              </Table.ColumnHeader>
              <Table.ColumnHeader textAlign={"center"}>
                Status
              </Table.ColumnHeader>
              <Table.ColumnHeader textAlign={"center"}>
                Action
              </Table.ColumnHeader>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {isLoading ? (
              <Table.Row>
                <Table.Cell colSpan={7} textAlign="center">
                  <Text>Loading...</Text>
                </Table.Cell>
              </Table.Row>
            ) : orderItems.length > 0 ? (
              orderItems.map((item, idx) => (
                <Table.Row key={idx} bg="white">
                  <Table.Cell textAlign="center">
                    <Text>{item.products[0]?.productTitle}</Text>
                  </Table.Cell>
                  <Table.Cell textAlign="center">
                    BDT {item.products[0]?.price}
                  </Table.Cell>
                  <Table.Cell textAlign="center">
                    {item.products[0]?.quantity}
                  </Table.Cell>
                  <Table.Cell textAlign="center">
                    {item.paymentMethod}
                  </Table.Cell>
                  <Table.Cell textAlign="center">
                    {item.shippingAddress}
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
                  <Table.Cell textAlign="center">
                    <select
                      style={{
                        width: "100%",
                        background: "white",
                        padding: "0.8rem",
                        border: "2px solid gray",
                      }}
                      value={item.status}
                      onChange={(e) =>
                        handleStatusChange(item._id, e.target.value)
                      }
                    >
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                      <option value="Processing">Processing</option>
                      <option value="Out for Delivery">Out for Delivery</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </Table.Cell>
                </Table.Row>
              ))
            ) : (
              <Table.Row bg="transparent">
                <Table.Cell colSpan={7} textAlign="center">
                  <Text textStyle={"lg"} fontWeight={"medium"}>
                    No orders found.
                  </Text>
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table.Root>

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

export default SellerOrderTable;
