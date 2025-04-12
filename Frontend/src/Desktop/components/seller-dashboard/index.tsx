"use client";
import { useGetEmployeeQuery } from "@/lib/api/apiSlice";
import { useAppSelector } from "@/lib/hooks";
import { UserType } from "@/types/admin";
import { Box, Button, Container, Flex, Table, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import AddEmployeeModal from "./createUserModal";
import { useRouter } from "next/navigation";

const SellerDashboard = () => {
  const router = useRouter();
  const { user, token } = useAppSelector((state) => state.auth);
  console.log(user);
  const { data, isLoading, refetch } = useGetEmployeeQuery({
    token,
  });
  console.log(data);
  const emp: UserType[] = data || [];
  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [router, user]);
  return (
    <Container maxW={"breakpoint-xl"} mt={8}>
      <Button
        background={"#F2F2F2"}
        py={8}
        px={8}
        mb={8}
        color={"#FB2E86"}
        onClick={() => setIsModalOpen(true)}
      >
        Add User
      </Button>

      <AddEmployeeModal
        token={token || ""}
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        onClose={() => {
          refetch();
          setIsModalOpen(false);
        }}
        employeeList={emp}
      />
      <Box overflowX="auto">
        <Table.ScrollArea borderWidth="1px" rounded="md" height="190px">
          <Table.Root interactive>
            <Table.Header>
              <Table.Row bg="#FB2E86">
                <Table.ColumnHeader textAlign={"center"}>
                  User Name
                </Table.ColumnHeader>
                <Table.ColumnHeader textAlign={"center"}>
                  Email
                </Table.ColumnHeader>
                <Table.ColumnHeader textAlign={"center"}>
                  Role
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
              ) : emp.length > 0 ? (
                emp.map((item, idx) => (
                  <Table.Row key={idx} bg="white">
                    <Table.Cell>
                      <Flex align="center">
                        <Text ml={2} fontWeight="medium">
                          {item.username}
                        </Text>
                      </Flex>
                    </Table.Cell>
                    <Table.Cell textAlign="center">{item.email}</Table.Cell>
                    <Table.Cell textAlign="center">{item.role}</Table.Cell>
                    <Table.Cell textAlign="center">{item.status}</Table.Cell>
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
      </Box>
    </Container>
  );
};

export default SellerDashboard;
