import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const BoardApproval = () => {
  const navigate = useNavigate();
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD SUBMITTED BUDGETS ================= */
  useEffect(() => {
    const load = async () => {
      const userId = localStorage.getItem("userId");
      const townshipId = localStorage.getItem("activeTownshipId");

      const res = await fetch(
        `http://localhost:5000/api/budgets?userId=${userId}&townshipId=${townshipId}&status=submitted`
      );

      const data = await res.json();
      setBudgets(data);
      setLoading(false);
    };

    load();
  }, []);


  /* ================= APPROVE ================= */
  const approveBudget = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/budgets/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "approved" })
        }
      );

      if (!res.ok) {
        alert("Approval failed");
        return;
      }

      // ✅ REMOVE FROM SCREEN AFTER APPROVAL
      setBudgets(prev => prev.filter(b => b._id !== id));

      alert("Budget approved successfully");
    } catch (err) {
      console.error("APPROVE ERROR:", err);
      alert("Server error");
    }
  };

  /* ================= UI STATES ================= */
  if (loading) {
    return <div style={{ padding: 40 }}>Loading...</div>;
  }

  if (budgets.length === 0) {
    return (
      <div style={{ padding: 40 }}>
        <h2>Board Approval</h2>
        <p>No submitted budgets pending approval.</p>

        <button onClick={() => navigate("/townships/dashboard")}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: 40, maxWidth: 1200, margin: "auto" }}>
      <h2>Board Approval</h2>

      {budgets.map(budget => (
        <div key={budget._id} style={styles.card}>
          <h3>{budget.name}</h3>

          <p>
            <strong>Fiscal Year:</strong> {budget.fiscalYear}
          </p>

          <button
            onClick={() => approveBudget(budget._id)}
            style={styles.approve}
          >
            Approve Budget
          </button>
        </div>
      ))}

      <button
        style={{ marginTop: 30 }}
        onClick={() => navigate("/townships/dashboard")}
      >
        Back to Dashboard
      </button>
    </div>
  );
};

/* ================= STYLES ================= */
const styles = {
  card: {
    border: "1px solid #ddd",
    padding: 20,
    borderRadius: 6,
    marginBottom: 20,
    background: "#fff"
  },
  approve: {
    marginTop: 10,
    padding: "10px 16px",
    background: "#16a34a",
    color: "#fff",
    border: "none",
    cursor: "pointer"
  }
};

export default BoardApproval;
