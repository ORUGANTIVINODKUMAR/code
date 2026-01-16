import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

/* ================= AVAILABLE FUNDS ================= */
const ALL_FUNDS = [
  "General Town",
  "General Assistance",
  "Cemetery",
  "Insurance",
  "Social Security",
  "Retirement / IMRF",
  "Road & Bridge",
  "Permanent Road",
  "Equipment & Building",
  "Motor Fuel Tax"
];

const Funds = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [selectedFunds, setSelectedFunds] = useState([]);

  /* ================= ONBOARDING GUARD ================= */
  useEffect(() => {
    const name = localStorage.getItem("onboarding_name");
      const usage = localStorage.getItem("onboarding_usage");
      const role = localStorage.getItem("onboarding_role");

      if (!name) {
        navigate("/onboarding/name");
        return;
      }

      if (!usage) {
        navigate("/onboarding/usage");
        return;
      }

      if (!role) {
        navigate("/onboarding/work");
        return;
      }
    }, [navigate]);


  /* ================= FILTER FUNDS ================= */
  const filteredFunds = ALL_FUNDS.filter(
    (fund) =>
      fund.toLowerCase().includes(query.toLowerCase()) &&
      !selectedFunds.includes(fund)
  );

  /* ================= ADD FUND ================= */
  const addFund = (fund) => {
    setSelectedFunds((prev) => [...prev, fund]);
    setQuery("");
  };

  /* ================= REMOVE FUND ================= */
  const removeFund = (fund) => {
    setSelectedFunds((prev) => prev.filter((f) => f !== fund));
  };

  /* ================= FINISH ONBOARDING ================= */
  const finishSetup = () => {
    if (selectedFunds.length === 0) {
      alert("Please select at least one fund");
      return;
    }

    // Save funds
    localStorage.setItem(
      "onboardingFunds",
      JSON.stringify(selectedFunds)
    );

    // Mark user as logged in AFTER onboarding
    localStorage.setItem("isLoggedIn", "true");

    navigate("/dashboard");
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Select Funds</h2>
        <p style={styles.subtitle}>
          Choose the funds you plan to use
        </p>

        {/* SEARCH INPUT */}
        <input
          style={styles.input}
          placeholder="Search funds..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        {/* DROPDOWN */}
        {query && filteredFunds.length > 0 && (
          <div style={styles.dropdown}>
            {filteredFunds.map((fund) => (
              <div
                key={fund}
                style={styles.dropdownItem}
                onClick={() => addFund(fund)}
              >
                {fund}
              </div>
            ))}
          </div>
        )}

        {/* SELECTED FUNDS */}
        <div style={styles.chips}>
          {selectedFunds.map((fund) => (
            <div key={fund} style={styles.chip}>
              {fund}
              <span
                style={styles.remove}
                onClick={() => removeFund(fund)}
              >
                ✕
              </span>
            </div>
          ))}
        </div>

        <button style={styles.button} onClick={finishSetup}>
          Finish Setup
        </button>
      </div>
    </div>
  );
};

/* ================= STYLES ================= */

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f8fafc",
    fontFamily: "system-ui"
  },

  card: {
    background: "#ffffff",
    padding: "32px",
    width: "460px",
    borderRadius: "16px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.12)"
  },

  title: {
    fontSize: "24px",
    fontWeight: "800",
    marginBottom: "6px"
  },

  subtitle: {
    fontSize: "14px",
    color: "#64748b",
    marginBottom: "16px"
  },

  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #c7d2fe",
    marginTop: "8px"
  },

  dropdown: {
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    marginTop: "6px",
    maxHeight: "160px",
    overflowY: "auto"
  },

  dropdownItem: {
    padding: "10px 12px",
    cursor: "pointer",
    borderBottom: "1px solid #f1f5f9"
  },

  chips: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    marginTop: "16px"
  },

  chip: {
    background: "#eef2ff",
    color: "#4338ca",
    padding: "6px 10px",
    borderRadius: "999px",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "14px"
  },

  remove: {
    cursor: "pointer",
    fontWeight: "bold"
  },

  button: {
    width: "100%",
    marginTop: "24px",
    padding: "14px",
    background: "#111827",
    color: "#ffffff",
    border: "none",
    borderRadius: "10px",
    fontWeight: "600",
    cursor: "pointer"
  }
};

export default Funds;
