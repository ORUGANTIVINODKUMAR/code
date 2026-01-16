import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Invalid email or password");
        return;
      }

      // ✅ SAVE LOGIN SESSION
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userId", data.user._id); // 🔑 REQUIRED
      localStorage.setItem("userEmail", data.user.email);
      localStorage.setItem("userRole", data.user.role);

      console.log("Logged in user:", data.user);

      // ✅ LOGIN ALWAYS GOES TO DASHBOARD
      navigate("/townships/dashboard");

    } catch (err) {
      console.error(err);
      setError("Backend server not reachable");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Login</h2>

      {error && <p style={styles.error}>{error}</p>}

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={styles.input}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={styles.input}
      />

      <button
        style={styles.button}
        onClick={handleLogin}
        disabled={loading}
      >
        {loading ? "Logging in..." : "Login"}
      </button>
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
    marginBottom: "15px"
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

export default Login;
