"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/lib/hooks";
import { setCredentials } from "@/lib/features/authSlice";
import { toaster } from "@/components/ui/toaster";
import { useLoginUserMutation } from "@/lib/api/apiSlice";
import {
  Button,
  Container,
  Input,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import Link from "next/link";

const Login = () => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const dispatch = useAppDispatch();

  // Use the useLoginUserMutation hook from the apiSlice
  const [loginUser, { isLoading }] = useLoginUserMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await loginUser({ email, pass }).unwrap();
      // console.log(data);
      dispatch(setCredentials({ user: data.data, token: data.token }));
      router.push("/");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.log(err);
      toaster.error({
        title: "Login failed",
        description:
          err?.message || "Login failed. Please check your email or password.",
      });
      setError("Login failed");
    }
  };

  return (
    <Container maxW="sm" mt={10}>
      {error && <Text color="red.500">{error}</Text>}
      <VStack>
        <Text fontSize="2xl" fontWeight="bold">
          Login
        </Text>
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <Stack>
            <Input
              borderWidth="3px"
              borderColor="gray.600"
              p={4}
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              borderWidth="3px"
              borderColor="gray.600"
              p={4}
              type="password"
              placeholder="Password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
            />
            <Link href={"/register"} className="font-medium">Create a Account</Link>
          </Stack>
          <Button
            type="submit"
            colorScheme="blue"
            background={"#FB2E86"}
            p={8}
            textStyle={"lg"}
            color={"#F2F2F2"}
            width="full"
            loading={isLoading}
            loadingText="Logging in..."
            mt={4}
          >
            Login
          </Button>
        </form>
      </VStack>
    </Container>
  );
};

export default Login;
