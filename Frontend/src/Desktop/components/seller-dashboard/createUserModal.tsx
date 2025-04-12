"use client";
import { toaster } from "@/components/ui/toaster";
import { useCreateEmployeeMutation } from "@/lib/api/apiSlice";
import { UserType } from "@/types/admin";
import { Box, Button, Flex, Input, Text } from "@chakra-ui/react";
import React, { Dispatch, SetStateAction, useState } from "react";
interface AddEmployeeModalProps {
  token: string;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  onClose: () => void;
  employeeList: UserType[];
}

const AddEmployeeModal = ({
  token,
  isOpen,
  onClose,
  setIsOpen,
  employeeList,
}: AddEmployeeModalProps) => {
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    pass: "",
    role: "",
  });
  const [createEmployee] = useCreateEmployeeMutation();

  const handleSubmit = async () => {
    if (!token) {
      toaster.warning({
        title: "Token Missing",
        description: "No valid token found.",
      });
      return;
    }

    const roleExists = employeeList.some((emp) => emp.role === newUser.role);

    if (roleExists) {
      toaster.warning({
        title: "Role Already Assigned",
        description: `An employee with the role ${newUser.role} already exists.`,
      });
      return;
    }

    try {
      await createEmployee({
        token,
        newUser,
      }).unwrap();
      toaster.success({
        title: ` ${newUser.role} Employee`,
        description: "Employee created successfully!",
      });
      onClose();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toaster.error({
        title: "Error",
        description: `Error: ${
          error?.data?.message || "Failed to create user."
        }`,
      });
    }
  };

  if (!isOpen) return null;
  return (
    <>
      {isOpen && (
        <Box
          position="fixed"
          top="0"
          left="0"
          right="0"
          bottom="0"
          bg="blackAlpha.600"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Box bg="white" p={6} borderRadius="md" minW="400px">
            <Text fontSize="lg" mb={4} fontWeight={"semibold"}>
              Create New Employee
            </Text>

            <Input
              borderWidth="3px"
              borderColor="gray.600"
              p={4}
              placeholder="Username"
              mb={2}
              value={newUser.username}
              onChange={(e) =>
                setNewUser({ ...newUser, username: e.target.value })
              }
            />
            <Input
              borderWidth="3px"
              borderColor="gray.600"
              p={4}
              placeholder="Email"
              mb={2}
              value={newUser.email}
              onChange={(e) =>
                setNewUser({ ...newUser, email: e.target.value })
              }
            />
            <Input
              borderWidth="3px"
              borderColor="gray.600"
              p={4}
              placeholder="Password"
              type="password"
              mb={2}
              value={newUser.pass}
              onChange={(e) => setNewUser({ ...newUser, pass: e.target.value })}
            />
            <select
              id="category-select"
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              style={{
                width: "100%",
                background: "white",
                padding: "0.8rem",
                border: "2px solid gray",
              }}
            >
              <option value="MANAGER">MANAGER</option>
              <option value="ACCOUNTANT">ACCOUNTANT</option>
              <option value="INVENTORY">INVENTORY</option>
            </select>

            <Flex justify="flex-end" gap={4} mt={4}>
              <Button
                background={"#F2F2F2"}
                py={4}
                px={4}
                color={"#FB2E86"}
                // mr={2}
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button
                background={"#FB2E86"}
                py={4}
                px={4}
                color={"#F2F2F2"}
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </Flex>
          </Box>
        </Box>
      )}
    </>
  );
};

export default AddEmployeeModal;
