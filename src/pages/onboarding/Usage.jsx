import { useState } from "react";
import { useNavigate } from "react-router-dom";

const OPTIONS = [
  {
    id: "township_budget",
    title: "Township Budgeting",
    desc: "Prepare and manage township annual budgets"
  },
  {
    id: "road_district",
    title: "Road District",
    desc: "Budgeting for road & bridge funds"
  },
  {
    id: "board_review",
    title: "Board Review",
    desc: "Review and approve submitted budgets"
  },
  {
    id: "reporting",
    title: "Reporting & Exports",
    desc: "Generate reports for auditors and boards"
  }
];

const Usage = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState("");

  const handleContinue = () => {
    if (!selected) {
      alert("Please select one option");
      return;
    }

    localStorage.setItem("onboarding_usage", selected);
    navigate("/onboarding/work");
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>How will you use Fundworkz?</h1>
        <p style={styles.subtitle}>
          This helps us tailor the setup for you.
        </p>

        <div style={styles.grid}>
          {OPTIONS.map((opt) => (
            <div
              key={opt.id}
              style={{
                ...styles.option,
                borderColor:
                  selected === opt.id ? "#4f46e5" : "#e5e7eb",
                background:
                  selected === opt.id ? "#eef2ff" : "#fff"
              }}
              onClick={() => setSelected(opt.id)}
            >
              <h3>{opt.title}</h3>
              <p>{opt.desc}</p>
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

  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "14px",
    marginBottom: "28px"
  },

  option: {
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

export default Usage;
