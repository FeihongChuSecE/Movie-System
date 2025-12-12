"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import "./login-page.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate inputs
    if (!email.trim()) {
      setError("Please provide an email");
      return;
    }

    if (!password.trim()) {
      setError("Please provide a password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.errorMessage || data.message || "Login failed");
        return;
      }

      // Save token
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      router.push("/");
    } catch (error) {
      console.error("Login error:", error);
      setError("Network error. Check if backend is running on port 5000.");
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div>
        <p className="error">{error}</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input
            className="input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            className="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="button" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <p>
          Don&apos;t have an account?{" "}
          <a href="/signup" style={{ color: "#007bff", textDecoration: "none" }}>
            Sign up here
          </a>
        </p>
      </div>
    </div>
  );
}
