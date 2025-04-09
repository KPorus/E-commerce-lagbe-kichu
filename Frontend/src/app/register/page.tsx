"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/app/lib/api/auth";
import { useAppDispatch } from "@/app/lib/hooks";
import { setCredentials } from "@/app/lib/features/authSlice";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await registerUser(username, email, pass,"USER");
      dispatch(setCredentials({ user: data, token: null }));
      router.push("/login");
    } catch (err: unknown) {
        console.log(err);
      setError("Registration failed");
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-500">{error}</p>}
        <input type="text" placeholder="Username" className="w-full p-2 border rounded" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input type="email" placeholder="Email" className="w-full p-2 border rounded" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" className="w-full p-2 border rounded" value={pass} onChange={(e) => setPass(e.target.value)} />
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">Register</button>
      </form>
    </div>
  );
}
