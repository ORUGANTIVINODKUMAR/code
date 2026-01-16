import { useState } from "react";
import { useNavigate } from "react-router-dom";

const NewTownship = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    townshipName: "",
    address: "",
    fiscalYearLabel: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const saveTownship = async () => {
    setError("");

    if (!form.townshipName || !form.fiscalYearLabel) {
      setError("Township name and fiscal year are required");
      return;
    }

    const userId = localStorage.getItem("userId");
    if (!userId) {
      setError("User not logged in");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/api/townships", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId,
          townshipName: form.townshipName,
          address: form.address,
          fiscalYearLabel: form.fiscalYearLabel
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to create township");
        return;
      }

      // ✅ Optional: store active township for UI usage
      localStorage.setItem("activeTownshipId", data._id);

      // ✅ Go to township dashboard
      navigate("/townships/dashboard");

    } catch (err) {
      setError("Backend server not reachable");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "40px", maxWidth: "600px", margin: "auto" }}>
      <h2>Create Township</h2>

      {error && (
        <p style={{ color: "red", marginBottom: "10px" }}>
          {error}
        </p>
      )}

      <input
        placeholder="Township Name *"
        value={form.townshipName}
        onChange={(e) =>
          setForm({ ...form, townshipName: e.target.value })
        }
        style={styles.input}
      />

      <input
        placeholder="Address"
        value={form.address}
        onChange={(e) =>
          setForm({ ...form, address: e.target.value })
        }
        style={styles.input}
      />

      <input
        placeholder="Fiscal Year (2025–2026) *"
        value={form.fiscalYearLabel}
        onChange={(e) =>
          setForm({ ...form, fiscalYearLabel: e.target.value })
        }
        style={styles.input}
      />

      <br />

      <button
        onClick={saveTownship}
        disabled={loading}
        style={styles.button}
      >
        {loading ? "Saving..." : "Save Township"}
      </button>
    </div>
  );
};

const styles = {
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "12px",
    borderRadius: "6px",
    border: "1px solid #ddd"
  },
  button: {
    padding: "12px 20px",
    cursor: "pointer",
    borderRadius: "6px",
    border: "none",
    background: "#4f46e5",
    color: "#fff",
    fontWeight: "600"
  }
};

export default NewTownship;
