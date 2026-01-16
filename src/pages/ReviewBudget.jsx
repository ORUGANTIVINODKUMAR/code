import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const ReviewBudget = () => {
  const navigate = useNavigate();
  const budgetId = localStorage.getItem("activeBudgetId");

  const [budget, setBudget] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD BUDGET ================= */
  useEffect(() => {
    if (!budgetId) {
      navigate("/townships/view-budgets");
      return;
    }

    const loadBudget = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/budgets/${budgetId}`
        );
        const data = await res.json();

        if (!res.ok) {
          alert("Budget not found");
          navigate("/townships/view-budgets");
          return;
        }

        // ✅ IMPORTANT: normalize entries
        setBudget({
          ...data,
          entries: data.entries || {}   // 🔥 FIX
        });
      } catch (err) {
        alert("Failed to load budget");
      } finally {
        setLoading(false);
      }
    };

    loadBudget();
  }, [budgetId, navigate]);

  /* ================= SUBMIT ================= */
  const submitBudget = async () => {
    try {
      await fetch(
        `http://localhost:5000/api/budgets/${budgetId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: "submitted",
            historyEntry: {
              status: "submitted",
              entries: budget.entries || {}
            }
          })
        }
      );

      alert("Budget submitted for approval");
      navigate("/townships/dashboard");
    } catch (err) {
      alert("Failed to submit budget");
    }
  };

  const calcVariance = (obj = {}) =>
    (obj.budget || 0) - (obj.lastYear || 0);

  if (loading) {
    return <div style={{ padding: "40px" }}>Loading...</div>;
  }

  if (!budget) {
    return (
      <div style={{ padding: "40px" }}>
        <h2>Review Budget</h2>
        <p>No budget data available.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "40px", maxWidth: "1200px", margin: "auto" }}>
      <h2>
        Review Budget –{" "}
        <span style={{ color: "#4f46e5" }}>{budget.name}</span>
      </h2>

      <p>
        <strong>Fiscal Year:</strong> {budget.fiscalYear}
      </p>

      {budget.funds.map((fund) => (
        <div key={fund} style={{ marginBottom: "40px" }}>
          <h3>{formatFundName(fund)}</h3>

          {Object.entries(budget.entries?.[fund] || {}).map(
            ([category, accounts]) => (
              <div key={category} style={{ marginBottom: "25px" }}>
                <h4>{category}</h4>

                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={{ ...styles.th, width: "25%" }}>Account</th>
                      <th style={{ ...styles.th, width: "15%" }}>Budget</th>
                      <th style={{ ...styles.th, width: "15%" }}>Last Yr</th>
                      <th style={{ ...styles.th, width: "15%" }}>Variance</th>
                      <th style={{ ...styles.th, width: "30%" }}>Notes</th>
                    </tr>
                  </thead>

                  <tbody>
                    {Object.entries(accounts || {}).map(
                      ([account, obj]) => (
                        <tr key={account}>
                          <td style={styles.td}>{account}</td>
                          <td style={styles.td}>${obj?.budget || 0}</td>
                          <td style={styles.td}>${obj?.lastYear || 0}</td>
                          <td style={styles.td}>{calcVariance(obj)}</td>
                          <td style={styles.td}>{obj?.notes || ""}</td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            )
          )}
        </div>
      ))}

      <div style={{ marginTop: "30px" }}>
        <button onClick={() => navigate("/townships/budget-entry")}>
          Back to Edit
        </button>

        <button
          style={{ marginLeft: "15px" }}
          onClick={submitBudget}
        >
          Submit Budget
        </button>
      </div>
    </div>
  );
};

/* ================= HELPERS ================= */
const formatFundName = (key) => ({
  generalTown: "General Town",
  generalAssistance: "General Assistance",
  cemetery: "Cemetery",
  insurance: "Insurance",
  socialSecurity: "Social Security",
  retirement: "Retirement / IMRF",
  roadBridge: "Road & Bridge",
  permanentRoad: "Permanent Road",
  equipmentBuilding: "Equipment & Building",
  motorFuelTax: "Motor Fuel Tax"
}[key] || key);

const styles = {
  table: {
    width: "100%",
    borderCollapse: "collapse",
    tableLayout: "fixed"
  },
  th: {
    borderBottom: "2px solid #ccc",
    padding: "6px",
    textAlign: "left"
  },
  td: {
    padding: "6px",
    verticalAlign: "middle"
  }
};

export default ReviewBudget;
