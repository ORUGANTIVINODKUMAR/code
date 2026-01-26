import { useState } from "react";
import { useNavigate } from "react-router-dom";

/* ================= FUND GROUPS ================= */

const FUND_GROUPS = {
  GENERAL_TOWN: {
    label: "General Town",
    funds: [
      "generalTown",
      "generalAssistance",
      "cemetery",
      "insurance",
      "socialSecurity",
      "retirement"
    ]
  },
  ROAD_BRIDGE: {
    label: "Road & Bridge",
    funds: [
      "roadBridge",
      "permanentRoad",
      "equipmentBuilding",
      "motorFuelTax"
    ]
  }
};

/* ================= COMPONENT ================= */

const CreateBudget = () => {
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");
  const townshipId = localStorage.getItem("activeTownshipId");

  const [budgetName, setBudgetName] = useState("");

  /* ===== Fiscal Year ===== */
  const [fyType, setFyType] = useState("CURRENT");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

  /* ===== Budget Type ===== */
  const [budgetType, setBudgetType] = useState(null); // GENERAL_TOWN | ROAD_BRIDGE

  /* ===== Funds ===== */
  const [funds, setFunds] = useState({
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
  });

  const [loading, setLoading] = useState(false);

  /* ================= HELPERS ================= */

  const generateFiscalYearLabel = () => {
    const today = new Date();

    if (fyType === "CURRENT") {
      return today.getFullYear().toString();
    }

    if (fyType === "TOWNSHIP") {
      const startYear =
        today.getMonth() >= 3 ? today.getFullYear() : today.getFullYear() - 1;
      return `Township FY (April 1 – March 31) ${startYear}-${startYear + 1}`;
    }

    if (fyType === "CUSTOM" && customStart && customEnd) {
      return `Custom FY (${customStart} – ${customEnd})`;
    }

    return "";
  };

  const selectBudgetType = (type) => {
    setBudgetType(type);

    const reset = {
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

    if (type === "GENERAL_TOWN") reset.generalTown = true;
    if (type === "ROAD_BRIDGE") reset.roadBridge = true;

    setFunds(reset);
  };

  const toggleFund = (key) => {
    setFunds((prev) => ({
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

    if (!budgetType) {
      alert("Please select General Town or Road & Bridge");
      return;
    }

    const selectedFunds = Object.keys(funds).filter((f) => funds[f]);
    if (!selectedFunds.length) {
      alert("Select at least one fund");
      return;
    }

    const fiscalYear = generateFiscalYearLabel();
    if (!fiscalYear) {
      alert("Please select fiscal year");
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
          funds: selectedFunds,
          budgetType
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

  /* ================= UI ================= */

  return (
    <div style={{ maxWidth: 600, margin: "40px auto" }}>
      <h2>Create Budget</h2>

      <input
        placeholder="Budget Name (eg: FY 2025 Draft)"
        value={budgetName}
        onChange={(e) => setBudgetName(e.target.value)}
        style={{ width: "100%", padding: 12, marginBottom: 16 }}
      />

      <h4>Fiscal Year</h4>

      <select
        value={fyType}
        onChange={(e) => setFyType(e.target.value)}
        style={{ width: "100%", padding: 10, marginBottom: 10 }}
      >
        <option value="CURRENT">Current Tax Year</option>
        <option value="TOWNSHIP">Township FY (April 1 – March 31)</option>
        <option value="CUSTOM">Custom Date Range</option>
      </select>

      {fyType === "CUSTOM" && (
        <>
          <input
            type="date"
            value={customStart}
            onChange={(e) => setCustomStart(e.target.value)}
            style={{ width: "100%", padding: 10, marginBottom: 8 }}
          />
          <input
            type="date"
            value={customEnd}
            onChange={(e) => setCustomEnd(e.target.value)}
            style={{ width: "100%", padding: 10 }}
          />
        </>
      )}

      <p>
        <strong>Selected Fiscal Year:</strong> {generateFiscalYearLabel()}
      </p>

      <h4>Select Budget Type</h4>

      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <button
          onClick={() => selectBudgetType("GENERAL_TOWN")}
          style={{
            flex: 1,
            padding: 14,
            background:
              budgetType === "GENERAL_TOWN" ? "#2563eb" : "#e5e7eb",
            color:
              budgetType === "GENERAL_TOWN" ? "#fff" : "#000",
            border: "none",
            cursor: "pointer"
          }}
        >
          General Town
        </button>

        <button
          onClick={() => selectBudgetType("ROAD_BRIDGE")}
          style={{
            flex: 1,
            padding: 14,
            background:
              budgetType === "ROAD_BRIDGE" ? "#2563eb" : "#e5e7eb",
            color:
              budgetType === "ROAD_BRIDGE" ? "#fff" : "#000",
            border: "none",
            cursor: "pointer"
          }}
        >
          Road & Bridge
        </button>
      </div>

      {budgetType && (
        <>
          <h4>{FUND_GROUPS[budgetType].label} Funds</h4>

          {FUND_GROUPS[budgetType].funds.map((key) => (
            <label key={key} style={{ display: "block", marginBottom: 8 }}>
              <input
                type="checkbox"
                checked={funds[key]}
                onChange={() => toggleFund(key)}
              />{" "}
              {formatFundName(key)}
            </label>
          ))}
        </>
      )}

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
    permanentRoad: "R&B Special Road Improvement",
    equipmentBuilding: "Equipment & Building",
    motorFuelTax: "Tort Judgment & Liability Insurance"
  }[key] || key);

export default CreateBudget;
