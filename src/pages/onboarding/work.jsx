import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ROLES = [
  {
    id: "clerk",
    title: "Township Clerk",
    desc: "Manages records, budgets, and reports"
  },
  {
    id: "treasurer",
    title: "Treasurer",
    desc: "Handles finances and approvals"
  },
  {
    id: "supervisor",
    title: "Supervisor",
    desc: "Oversees township operations"
  },
  {
    id: "board",
    title: "Board Member",
    desc: "Reviews and approves budgets (read-only)"
  }
];

const Work = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("");

  const handleContinue = () => {
    if (!role) {
        alert("Please select your role");
        return;
    }

    localStorage.setItem("onboarding_role", role);



    navigate("/onboarding/funds");
  };


  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>What best describes your role?</h1>
        <p style={styles.subtitle}>
          This helps us set up the right permissions.
        </p>

        <div style={styles.list}>
          {ROLES.map((r) => (
            <div
              key={r.id}
              style={{
                ...styles.item,
                borderColor: role === r.id ? "#4f46e5" : "#e5e7eb",
                background: role === r.id ? "#eef2ff" : "#fff"
              }}
              onClick={() => setRole(r.id)}
            >
              <h3>{r.title}</h3>
              <p>{r.desc}</p>
            </div>
          ))}
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
    fontFamily: "system-ui"
  },

  card: {
    width: "520px",
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

  list: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
    marginBottom: "28px"
  },

  item: {
    padding: "16px",
    borderRadius: "12px",
    border: "2px solid #e5e7eb",
    cursor: "pointer",
    transition: "all 0.2s ease"
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

export default Work;
