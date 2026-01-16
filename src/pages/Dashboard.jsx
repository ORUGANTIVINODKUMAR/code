import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");
  const townshipId = localStorage.getItem("activeTownshipId");
  const townshipName = localStorage.getItem("activeTownshipName");

  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadBudgets = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/budgets?userId=${userId}&townshipId=${townshipId}`
        );

        if (!res.ok) throw new Error("Failed");

        const data = await res.json();
        setBudgets(data);
      } catch (err) {
        setError("Failed to load budgets");
      } finally {
        setLoading(false);
      }
    };

    if (userId && townshipId) loadBudgets();
    else setLoading(false);
  }, [userId, townshipId]);

  const openBudget = (budget) => {
    localStorage.setItem("activeBudgetId", budget._id);

    if (budget.status === "draft") navigate("/townships/budget-entry");
    if (budget.status === "submitted") navigate("/townships/board-approval");
    if (budget.status === "approved") navigate("/townships/reports");
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "260px 1fr" }}>
      <div style={{ padding: 20, borderRight: "1px solid #ddd" }}>
        <Menu label="Create Budget" onClick={() => navigate("/townships/create-budget")} />
        <Menu label="Approve Budget" onClick={() => navigate("/townships/board-approval")} />
        <Menu label="View Budgets" onClick={() => navigate("/townships/view-budgets")} />
        <Menu label="Reports" onClick={() => navigate("/townships/reports")} />
      </div>

      <div style={{ padding: 30 }}>
        <h2>Welcome 👋 <span style={{ color: "#4f46e5" }}>{townshipName}</span></h2>

        {loading && <p>Loading budgets...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {!loading && budgets.length === 0 && <p>No budgets created yet.</p>}

        {budgets.map(b => (
          <div key={b._id} style={styles.card}>
            <h3>{b.name}</h3>
            <p><strong>Fiscal Year:</strong> {b.fiscalYear}</p>
            <p><strong>Status:</strong> {b.status.toUpperCase()}</p>
            <button onClick={() => openBudget(b)}>Open</button>
          </div>
        ))}
      </div>
    </div>
  );
};

const Menu = ({ label, onClick }) => (
  <div onClick={onClick} style={styles.menu}>{label}</div>
);

const styles = {
  menu: {
    padding: 14,
    marginBottom: 10,
    border: "1px solid #ddd",
    cursor: "pointer"
  },
  card: {
    border: "1px solid #ddd",
    padding: 20,
    marginBottom: 15
  }
};

export default Dashboard;
