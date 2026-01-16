import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const BudgetHistory = () => {
  const navigate = useNavigate();
  const activeBudgetId = localStorage.getItem("activeBudgetId");

  const [budget, setBudget] = useState(null);

  useEffect(() => {
    const budgets = JSON.parse(localStorage.getItem("budgets")) || [];
    const found = budgets.find(b => b.id === activeBudgetId);
    setBudget(found || null);
  }, [activeBudgetId]);

  if (!budget) {
    return (
      <div style={{ padding: 40 }}>
        <h2>Budget History</h2>
        <p>No budget selected.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 40, maxWidth: 900, margin: "auto" }}>
      <h2>
        Budget History –{" "}
        <span style={{ color: "#4f46e5" }}>{budget.name}</span>
      </h2>

      <p>
        <strong>Fiscal Year:</strong> {budget.fiscalYear}
      </p>

      {budget.history?.length === 0 && (
        <p>No history available.</p>
      )}

      {budget.history?.map((h) => (
        <div
          key={h.version}
          style={{
            border: "1px solid #ddd",
            padding: 20,
            marginBottom: 15,
            borderRadius: 6
          }}
        >
          <p>
            <strong>Version:</strong> {h.version}
          </p>

          <p>
            <strong>Status:</strong>{" "}
            <span style={getStatusStyle(h.status)}>
              {h.status.toUpperCase()}
            </span>
          </p>

          <p>
            <strong>Saved At:</strong>{" "}
            {new Date(h.savedAt).toLocaleString()}
          </p>

          <button onClick={() => restoreVersion(h)}>
            Restore This Version
          </button>
        </div>
      ))}

      <button
        style={{ marginTop: 20 }}
        onClick={() => navigate("/townships/view-budgets")}
      >
        ← Back to Budgets
      </button>
    </div>
  );
};

/* ================= RESTORE ================= */
const restoreVersion = (historyItem) => {
  const budgets = JSON.parse(localStorage.getItem("budgets")) || [];
  const activeBudgetId = localStorage.getItem("activeBudgetId");

  const budget = budgets.find(b => b.id === activeBudgetId);
  if (!budget) return;

  budget.entries = historyItem.entries;
  budget.status = "draft";

  budget.history.push({
    version: budget.history.length + 1,
    status: "restored",
    entries: historyItem.entries,
    savedAt: new Date().toISOString()
  });

  localStorage.setItem("budgets", JSON.stringify(budgets));

  alert("Version restored. You can now edit the budget.");
};

/* ================= HELPERS ================= */
const getStatusStyle = (status) => {
  if (status === "draft") return { color: "orange", fontWeight: "bold" };
  if (status === "submitted") return { color: "blue", fontWeight: "bold" };
  if (status === "approved") return { color: "green", fontWeight: "bold" };
  if (status === "restored") return { color: "purple", fontWeight: "bold" };
  return {};
};

export default BudgetHistory;
