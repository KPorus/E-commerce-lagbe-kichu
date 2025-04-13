"use client";
import {
  useGetAllUsersQuery,
  useToggleUserStatusMutation,
} from "@/lib/api/apiSlice";
import { useAppSelector } from "@/lib/hooks";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  Input,
  Button,
  Flex,
  Container,
  Text,
  Box,
  Table,
} from "@chakra-ui/react";
import { toaster } from "@/components/ui/toaster";
import { UserType } from "@/types/admin";

const AdminTable = () => {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const token = useAppSelector((state) => state.auth.token);

  const [currentPage, setCurrentPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [searchText, setSearchText] = useState("");
  const limit = 5;

  const { data, isLoading, refetch } = useGetAllUsersQuery({
    role: roleFilter,
    status: statusFilter,
    text: searchText,
    page: currentPage,
    limit,
    token,
  });

  const [toggleUserStatus, { isLoading: statusUpdating }] =
    useToggleUserStatusMutation();

  const usersdata: UserType[] = (data?.data || []).filter(
    (i: UserType) => i._id !== user?._id
  );

  const totalUsers = data?.total || 0;
  const totalPages = Math.ceil(totalUsers / limit);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleStatusToggle = async (userId: string) => {
    try {
      // console.log(userId);
      await toggleUserStatus({
        id: userId,
        token,
      }).unwrap();

      toaster.success({
        title: `User status updated.`,
      });

      refetch();
    } catch (error) {
      toaster.error({
        title: `Failed to update status.${error}`,
      });
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!user|| user.role !== "ADMIN") {
        router.push("/login");
      }
    }, 1000); 
    return () => clearTimeout(timer);
  }, [router, token, user]);

  return (
    <Container maxW={"breakpoint-xl"} mt={8}>
      <Flex mb={4} gap={4} direction={"row"}>
        <Input
          borderWidth="3px"
          borderColor="gray.600"
          p={4}
          placeholder="Search user..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          maxW="200px"
        />

        <select
          id="category-select"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          style={{
            width: "100%",
            background: "white",
            padding: "0.8rem",
            border: "2px solid gray",
          }}
        >
          <option value="">Select category</option>
          <option value="ADMIN">ADMIN</option>
          <option value="SELLER">SELLER</option>
          <option value="USER">USER</option>
          <option value="MANAGER">MANAGER</option>
          <option value="ACCOUNTANT">ACCOUNTANT</option>
          <option value="INVENTORY">INVENTORY</option>
        </select>
        <select
          id="Filter by Status"
          value={statusFilter}
          style={{
            width: "100%",
            background: "white",
            padding: "0.8rem",
            border: "2px solid gray",
          }}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">Select category</option>
          <option value="BAN">BAN</option>
          <option value="UNBAN">UNBAN</option>
        </select>
      </Flex>
      <Box overflowX="auto">
        <Table.ScrollArea borderWidth="1px" rounded="md" height="460px">
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
                <Table.ColumnHeader textAlign={"center"}>
                  Afflited
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
              ) : usersdata.length > 0 ? (
                usersdata.map((item, idx) => (
                  <Table.Row key={idx} bg="white">
                    <Table.Cell>
                      <Flex align="center">
                        {/* <Image
                          boxSize="60px"
                          src={item.productImages?.[0]}
                          alt={item.productTitle}
                          objectFit="cover"
                          rounded="md"
                        /> */}
                        <Text ml={2} fontWeight="medium">
                          {item.username}
                        </Text>
                      </Flex>
                    </Table.Cell>
                    <Table.Cell textAlign="center">{item.email}</Table.Cell>
                    <Table.Cell textAlign="center">{item.role}</Table.Cell>
                    <Table.Cell textAlign="center">
                      <Button
                        size="sm"
                        colorScheme={item.status === "BAN" ? "green" : "red"}
                        onClick={() => handleStatusToggle(item._id)}
                        loading={statusUpdating}
                      >
                        {item.status === "BAN" ? "UNBAN" : "BAN"}
                      </Button>
                    </Table.Cell>
                    <Table.Cell textAlign="center">
                      <Text
                        fontWeight="semibold"
                        // color={
                        //   item.status === "Completed"
                        //     ? "green.500"
                        //     : item.status === "Rejected"
                        //     ? "red.500"
                        //     : item.status === "Processing"
                        //     ? "orange.400"
                        //     : "gray.600"
                        // }
                      >
                        {item.created_by}
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

export default AdminTable;
