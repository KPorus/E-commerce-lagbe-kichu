"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/lib/hooks";
import { setCredentials } from "@/lib/features/authSlice";
import { useRegisterUserMutation } from "@/lib/api/apiSlice";
import {
  Button,
  Container,
  Input,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import Link from "next/link";
const Register = () => {
  const [username, setUsername] = useState("");
  const [value, setValue] = useState<string>("USER");

  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [registerUser, { isLoading }] = useRegisterUserMutation();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  setValue(event.target.value);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await registerUser({
        username,
        email,
        pass,
        role: value,
      }).unwrap();

      dispatch(setCredentials({ user: data, token: null }));
      router.push("/login");
    } catch (err: unknown) {
      console.log(err);
      setError("Registration failed");
    }
  };

  return (
    <Container maxW="sm" mt={10}>
      {error && <Text color="red.500">{error}</Text>}
      <VStack>
        <Text fontSize="2xl" fontWeight="bold">
          Register
        </Text>
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <Stack>
            <Input
              borderWidth="3px"
              borderColor="gray.600"
              p={4}
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
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
            <label>
              <input
                type="radio"
                name="options"
                value="USER"
                checked={value === "USER"}
                onChange={handleChange}
              />
              USER
            </label>

            <label>
              <input
                type="radio"
                name="options"
                value="SELLER"
                checked={value === "SELLER"}
                onChange={handleChange}
              />
              SELLER
            </label>
            <Link href={"/login"} className="font-medium">
              Already have an account
            </Link>
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
            loadingText="Creating account in..."
            mt={4}
          >
            Register
          </Button>
        </form>
      </VStack>
    </Container>
  );
};

export default Register;
