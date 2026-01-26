import { useState } from "react";
import { useNavigate } from "react-router-dom";

const TownshipDetails = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    townshipName: "",
    ownerName: "",
    address: "",
    city: "",
    state: "",
    zip: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.townshipName || !form.ownerName) {
      alert("Please fill required fields");
      return;
    }

    const userId = localStorage.getItem("userId");

    // ✅ STRONG SAFETY CHECK
    if (!userId || userId === "undefined") {
      alert("User not logged in. Please login again.");
      navigate("/login");
      return;
    }

    try {
      const res = await fetch(
        "http://localhost:5000/api/townships", // ✅ FIXED
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            townshipName: form.townshipName,
            ownerName: form.ownerName,
            address: form.address,
            city: form.city,
            state: form.state,
            zip: form.zip,
            fiscalYearLabel: "Township FY (April–March)"
          })
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to save township");
        return;
      }

      localStorage.setItem("activeTownshipId", data._id);
      localStorage.setItem("activeTownshipName", data.townshipName);
      

      navigate("/townships/dashboard");

    } catch (err) {
      alert("Server not reachable");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Township Basic Details</h2>

        <input
          name="townshipName"
          placeholder="Township Name *"
          value={form.townshipName}
          onChange={handleChange}
          style={styles.input}
        />
    
        <input
          name="ownerName"
          placeholder="Administrator Name *"
          value={form.ownerName}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          name="city"
          placeholder="City"
          value={form.city}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          name="state"
          placeholder="State"
          value={form.state}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          name="zip"
          placeholder="ZIP Code"
          value={form.zip}
          onChange={handleChange}
          style={styles.input}
        />

        <button style={styles.button} onClick={handleSubmit}>
          Save Township
        </button>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f8fafc",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  card: {
    width: "520px",
    background: "#fff",
    padding: "36px",
    borderRadius: "16px"
  },
  title: {
    fontSize: "26px",
    fontWeight: "800",
    marginBottom: "12px"
  },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "14px"
  },
  button: {
    width: "100%",
    padding: "14px",
    background: "#4f46e5",
    color: "#fff",
    border: "none",
    cursor: "pointer"
  }
};

export default TownshipDetails;
