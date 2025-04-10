import axios from "axios";

export const loginUser = async (email: string, pass: string) => {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
    { email, pass },
    { withCredentials: true }
  );
  return res.data;
};

export const registerUser = async (
  username: string,
  email: string,
  pass: string,
  role: string
) => {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
    { username, email, pass, role }
  );
  return res.data;
};

export const refreshAccessToken = async () => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
    { withCredentials: true }
  );
  return res.data;
};
