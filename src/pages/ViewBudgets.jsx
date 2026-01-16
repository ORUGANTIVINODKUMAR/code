import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ViewBudgets = () => {
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");
  const townshipId = localStorage.getItem("activeTownshipId");

  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD APPROVED BUDGETS ================= */
  useEffect(() => {
    const loadBudgets = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/budgets?userId=${userId}&townshipId=${townshipId}&status=approved`
        );

        if (!res.ok) {
          throw new Error("Failed to load budgets");
        }

        const data = await res.json();
        setBudgets(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("ViewBudgets error:", err);
        alert("Failed to load approved budgets");
      } finally {
        setLoading(false);
      }
    };

    if (userId && townshipId) {
      loadBudgets();
    } else {
      setLoading(false);
    }
  }, [userId, townshipId]);

  /* ================= OPEN REPORT ================= */
  const openReport = (budget) => {
    localStorage.setItem("activeBudgetId", budget._id);
    localStorage.setItem("activeTownshipId", budget.townshipId);
    navigate("/townships/reports");
  };

  /* ================= UI ================= */
  if (loading) {
    return <div style={{ padding: 40 }}>Loading...</div>;
  }

  if (budgets.length === 0) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <h2>Approved Budgets</h2>
        <p>No approved budgets available.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 40, maxWidth: 900, margin: "auto" }}>
      <h2>Approved Budgets</h2>

      {budgets.map((budget) => (
        <div key={budget._id} style={styles.card}>
          <h3>{budget.name}</h3>

          <p>
            <strong>Fiscal Year:</strong> {budget.fiscalYear}
          </p>

          <p>
            <strong>Status:</strong>{" "}
            <span style={{ color: "green", fontWeight: "bold" }}>
              APPROVED
            </span>
          </p>

          <p>
            <strong>Funds:</strong>{" "}
            {(budget.funds || []).map(formatFundName).join(", ")}
          </p>

          <button onClick={() => openReport(budget)}>
            View Report
          </button>
        </div>
      ))}
    </div>
  );
};

/* ================= HELPERS ================= */

const formatFundName = (key) =>
  ({
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

/* ================= STYLES ================= */

const styles = {
  card: {
    border: "1px solid #ddd",
    padding: 25,
    borderRadius: 6,
    backgroundColor: "#fff",
    marginBottom: 20
  }
};

export default ViewBudgets;
