"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { storeAuth } from "@/utils/authService";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:5001/api/users/login", {
        email,
        password,
      });

      const { user, token } = res.data;

      storeAuth(user, token);
      router.push("/");
    } catch (err) {
      alert("Login failed: " + (err.response?.data || err.message));
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#0d1117] text-white">
      <h2 className="text-3xl font-bold mb-6">Login to Your Account</h2>
      <div className="flex flex-col gap-4 w-80">
        <input
          type="email"
          placeholder="Email"
          className="p-2 rounded bg-[#1c2128] text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="p-2 rounded bg-[#1c2128] text-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleLogin}
          className="bg-blue-600 hover:bg-blue-700 rounded px-4 py-2"
        >
          Login
        </button>
        <button
          onClick={() => router.push("/signup")}
          className="text-sm text-green-400 hover:underline"
        >
          Don't have an account? Sign up
        </button>
        <button
          onClick={() => router.push("/")}
          className="text-sm text-gray-400 hover:underline"
        >
          ← Back to Home
        </button>
      </div>
    </main>
  );
}
