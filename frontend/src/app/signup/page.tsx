"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { storeAuth } from "@/utils/authService";

export default function Signup() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [confirmationCode, setConfirmationCode] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false); // Flag to show confirmation form

  const handleRegister = async () => {
    try {
      // Step 1: Register user
      await axios.post("http://localhost:5001/api/users/signup", {
        email,
        password,
        city: "Toronto",
        province: "ON",
        country: "Canada",
        formattedAddress: "123 Front St, Toronto, ON",
      });

      // Step 2: After registration, show the confirmation form
      setIsConfirmed(true);
    } catch (err: any) {
      const msg = err.response?.data || err.message;
      setError("Registration failed: " + msg);
    }
  };

  const handleConfirmCode = async () => {
    try {
      await axios.post("http://localhost:5001/api/users/confirm-signup", {
        email,
        otp: confirmationCode,
      });
      // Proceed to login after confirmation
      const loginRes = await axios.post(
        "http://localhost:5001/api/users/login",
        {
          email,
          password,
        }
      );
      const { token } = loginRes.data;
      storeAuth({ email }, token);
      router.push("/");
    } catch (err: any) {
      const msg = err.response?.data || err.message;
      setError("Confirmation failed: " + msg);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#0d1117] text-white">
      <h2 className="text-3xl font-bold mb-6">Create Your Account</h2>
      <div className="flex flex-col gap-4 w-80">
        {!isConfirmed ? (
          <>
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
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button
              onClick={handleRegister}
              className="bg-green-600 hover:bg-green-700 rounded px-4 py-2"
            >
              Sign Up
            </button>
          </>
        ) : (
          <>
            <input
              type="text"
              placeholder="Enter Confirmation Code"
              className="p-2 rounded bg-[#1c2128] text-white"
              value={confirmationCode}
              onChange={(e) => setConfirmationCode(e.target.value)}
            />
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button
              onClick={handleConfirmCode}
              className="bg-blue-600 hover:bg-blue-700 rounded px-4 py-2"
            >
              Confirm Code
            </button>
          </>
        )}
        <button
          onClick={() => router.push("/login")}
          className="text-sm text-blue-400 hover:underline"
        >
          Already have an account? Log in here
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
