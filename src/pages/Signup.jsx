import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSignup = async () => {
    setError("");

    const { name, email, password, confirmPassword } = form;

    if (!name || !email || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, password })
      });

      const data = await res.json();
      console.log("Signup response:", data); // ✅ DEBUG LOG

      if (!res.ok) {
        setError(data.message || "Signup failed");
        return;
      }

      // 🔐 SAFETY CHECK
      if (!data.user || !data.user._id) {
        setError("Invalid signup response. Please try again.");
        return;
      }

      // ✅ LOGIN SESSION
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userId", data.user._id); // ⭐ MOST IMPORTANT
      localStorage.setItem("userEmail", data.user.email);
      localStorage.setItem("userRole", data.user.role);

      // ✅ GO TO TOWNSHIP SETUP
      navigate("/setup-details");

    } catch (err) {
      console.error(err);
      setError("Backend server not reachable");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Create Account</h2>

      {error && <p style={styles.error}>{error}</p>}

      <input
        name="name"
        placeholder="Full Name"
        value={form.name}
        onChange={handleChange}
        style={styles.input}
      />

      <input
        name="email"
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        style={styles.input}
      />

      <input
        name="password"
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        style={styles.input}
      />

      <input
        name="confirmPassword"
        type="password"
        placeholder="Confirm Password"
        value={form.confirmPassword}
        onChange={handleChange}
        style={styles.input}
      />

      <button
        style={styles.button}
        onClick={handleSignup}
        disabled={loading}
      >
        {loading ? "Creating account..." : "Continue"}
      </button>

      <p style={{ marginTop: "15px" }}>
        Already have an account?{" "}
        <span
          style={{ cursor: "pointer", color: "blue" }}
          onClick={() => navigate("/login")}
        >
          Login
        </span>
      </p>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "400px",
    margin: "80px auto",
    padding: "30px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    textAlign: "center"
  },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "12px"
  },
  button: {
    width: "100%",
    padding: "12px",
    cursor: "pointer"
  },
  error: {
    color: "red",
    marginBottom: "10px"
  }
};

export default Signup;
