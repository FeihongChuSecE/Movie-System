"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import "./signup-page.css";

export default function Signup() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate inputs
    if (!formData.firstName.trim()) {
      setError("Please provide a first name");
      return;
    }

    if (!formData.lastName.trim()) {
      setError("Please provide a last name");
      return;
    }

    if (!formData.email.trim()) {
      setError("Please provide an email");
      return;
    }

    if (!formData.password.trim()) {
      setError("Please provide a password");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    if (!/\d/.test(formData.password)) {
      setError("Password must contain at least one number");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        // Handle validation errors
        if (data.message === "Validation failed" && data.error) {
          const errorMessages = data.error.map(err => err.msg).join(", ");
          setError(errorMessages);
        } else {
          setError(data.errorMessage || data.message || "Registration failed");
        }
        return;
      }

      // Registration successful, redirect to login
      router.push("/login");
    } catch (error) {
      console.error("Signup error:", error);
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
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>First Name</label>
          <input
            className="input"
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Last Name</label>
          <input
            className="input"
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email</label>
          <input
            className="input"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            className="input"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Phone (optional)</label>
          <input
            className="input"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="XXX-XXX-XXXX"
          />
        </div>
        <button type="submit" className="button" disabled={loading}>
          {loading ? "Signing up..." : "Sign Up"}
        </button>
      </form>
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <p>
          Already have an account?{" "}
          <a href="/login" style={{ color: "#007bff", textDecoration: "none" }}>
            Login here
          </a>
        </p>
      </div>
    </div>
  );
}
