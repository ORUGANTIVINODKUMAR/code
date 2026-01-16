import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Name = () => {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const handleContinue = () => {
    if (!firstName || !lastName) {
      alert("Please enter first and last name");
      return;
    }

    // Save for later steps (simple & effective)
    localStorage.setItem(
      "onboarding_name",
      JSON.stringify({ firstName, lastName })
    );

    navigate("/onboarding/usage");
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Tell us about you</h1>
        <p style={styles.subtitle}>
          This helps us personalize your Fundworkz experience.
        </p>

        <div style={styles.row}>
          <div style={styles.field}>
            <label>First name</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="John"
            />
          </div>

          <div style={styles.field}>
            <label>Last name</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Smith"
            />
          </div>
        </div>

        <button style={styles.button} onClick={handleContinue}>
          Continue
        </button>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f8fafc",
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont"
  },

  card: {
    width: "420px",
    background: "#fff",
    borderRadius: "16px",
    padding: "32px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.15)"
  },

  title: {
    fontSize: "26px",
    fontWeight: "800",
    marginBottom: "8px"
  },

  subtitle: {
    fontSize: "14px",
    color: "#64748b",
    marginBottom: "24px"
  },

  row: {
    display: "flex",
    gap: "12px",
    marginBottom: "24px"
  },

  field: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "6px"
  },

  button: {
    width: "100%",
    padding: "14px",
    borderRadius: "10px",
    border: "none",
    background: "#4f46e5",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer"
  }
};

export default Name;
