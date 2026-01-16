import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/* ================= MASTER FUND LIST ================= */
const ALL_FUNDS = {
  generalTown: false,
  generalAssistance: false,
  cemetery: false,
  insurance: false,
  socialSecurity: false,
  retirement: false,
  roadBridge: false,
  permanentRoad: false,
  equipmentBuilding: false,
  motorFuelTax: false
};

const CreateBudget = () => {
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");
  const townshipId = localStorage.getItem("activeTownshipId");

  const [budgetName, setBudgetName] = useState("");
  const [fiscalYear, setFiscalYear] = useState("");
  const [funds, setFunds] = useState({ ...ALL_FUNDS });
  const [loading, setLoading] = useState(false);

  /* ================= INIT (RUN ONCE) ================= */
  useEffect(() => {
    const setupData = JSON.parse(localStorage.getItem("initialSetup"));

    if (!setupData) {
      navigate("/initial-setup", { replace: true });
      return;
    }

    let fy = "";
    if (setupData.fiscalYearType === "township") {
      fy = "Township FY (April 1 – March 31)";
    } else if (setupData.fiscalYearType === "calendar") {
      fy = "Calendar Year (Jan 1 – Dec 31)";
    } else {
      fy = `Custom FY (${setupData.customDates.start} – ${setupData.customDates.end})`;
    }

    setFiscalYear(fy);

    if (setupData.selectedFunds) {
      const base = { ...ALL_FUNDS };
      Object.keys(setupData.selectedFunds).forEach(fund => {
        base[fund] = true;
      });
      setFunds(base);
    }
  }, [navigate]); // ✅ ONLY navigate

  /* ================= TOGGLE FUND ================= */
  const toggleFund = (key) => {
    setFunds(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  /* ================= CREATE BUDGET ================= */
  const createBudget = async () => {
    if (!budgetName.trim()) {
      alert("Please enter budget name");
      return;
    }

    const selectedFunds = Object.keys(funds).filter(f => funds[f]);
    if (!selectedFunds.length) {
      alert("Select at least one fund");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/api/budgets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          townshipId,
          name: budgetName.trim(),
          fiscalYear,
          funds: selectedFunds
        })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to create budget");
        return;
      }

      localStorage.setItem("activeBudgetId", data._id);
      navigate("/townships/budget-entry");

    } catch (err) {
      console.error(err);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "40px auto" }}>
      <h2>Create Budget</h2>

      <input
        placeholder="Budget Name (eg: FY 2025 Draft)"
        value={budgetName}
        onChange={e => setBudgetName(e.target.value)}
        style={{ width: "100%", padding: 12, marginBottom: 14 }}
      />

      <p><strong>Fiscal Year:</strong> {fiscalYear}</p>

      <h4>Select Funds</h4>

      {Object.keys(ALL_FUNDS).map(key => (
        <label key={key} style={{ display: "block", marginBottom: 8 }}>
          <input
            type="checkbox"
            checked={!!funds[key]}
            onChange={() => toggleFund(key)}
          />{" "}
          {formatFundName(key)}
        </label>
      ))}

      <div style={{ marginTop: 20 }}>
        <button onClick={createBudget} disabled={loading}>
          {loading ? "Creating..." : "Continue"}
        </button>

        <button
          style={{ marginLeft: 10 }}
          onClick={() => navigate("/townships/dashboard")}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

/* ================= HELPER ================= */
const formatFundName = key => ({
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

export default CreateBudget;
