import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import chartOfAccounts from "../data/chartOfAccounts";

const BudgetEntry = () => {
  const navigate = useNavigate();
  const budgetId = localStorage.getItem("activeBudgetId");

  const [budget, setBudget] = useState(null);
  const [entries, setEntries] = useState({});
  const [activeFund, setActiveFund] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD BUDGET ================= */
  useEffect(() => {
    const loadBudget = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/budgets/${budgetId}`
        );
        const data = await res.json();

        if (!res.ok || !data) {
          alert("Budget not found");
          navigate("/townships/dashboard");
          return;
        }

        const initEntries = data.entries ? { ...data.entries } : {};

        if (!initEntries.__meta) {
          initEntries.__meta = {
            beginningBalance: "",
            beginningBalanceLastYear: ""
          };
        }

        data.funds.forEach((fund) => {
          const fundCOA = chartOfAccounts[fund];
          if (!fundCOA) return;

          if (!initEntries[fund]) initEntries[fund] = {};

          Object.entries(fundCOA)
            .filter(([k]) => k !== "meta")
            .forEach(([dept, deptObj]) => {
              if (!initEntries[fund][dept]) {
                initEntries[fund][dept] = {};
              }

              /* ===== FLAT (REVENUES) ===== */
              if (deptObj.accounts) {
                if (!initEntries[fund][dept].accounts) {
                  initEntries[fund][dept].accounts = {};
                }

                deptObj.accounts.forEach((acc) => {
                  if (!initEntries[fund][dept].accounts[acc.name]) {
                    initEntries[fund][dept].accounts[acc.name] = {
                      code: acc.code,
                      budget: "",
                      lastYear: "",
                      notes: ""
                    };
                  }
                });
              }

              /* ===== NESTED ===== */
              Object.entries(deptObj)
                .filter(([k, v]) => k !== "meta" && v?.accounts)
                .forEach(([category, catObj]) => {
                  if (!initEntries[fund][dept][category]) {
                    initEntries[fund][dept][category] = {};
                  }

                  catObj.accounts.forEach((acc) => {
                    if (!initEntries[fund][dept][category][acc.name]) {
                      initEntries[fund][dept][category][acc.name] = {
                        code: acc.code,
                        budget: "",
                        lastYear: "",
                        notes: ""
                      };
                    }
                  });
                });
            });
        });

        setEntries(initEntries);
        setBudget(data);
        setActiveFund(data.funds.find((f) => chartOfAccounts[f]) || null);
      } catch (err) {
        console.error("LOAD ERROR:", err);
        alert("Failed to load budget");
      } finally {
        setLoading(false);
      }
    };

    if (budgetId) loadBudget();
  }, [budgetId, navigate]);

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (dept, category, name, field, value) => {
    setEntries((prev) => ({
      ...prev,
      [activeFund]: {
        ...prev[activeFund],
        [dept]: {
          ...prev[activeFund][dept],
          [category]: {
            ...prev[activeFund][dept][category],
            [name]: {
              ...prev[activeFund][dept][category][name],
              [field]:
                field === "notes"
                  ? value
                  : value === ""
                  ? ""
                  : Number(value)
            }
          }
        }
      }
    }));
  };

  const variance = (obj) =>
    (Number(obj.budget) || 0) - (Number(obj.lastYear) || 0);

  /* ================= SAVE ================= */
  const saveAndSubmit = async () => {
    await fetch(`http://localhost:5000/api/budgets/${budgetId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        entries,
        status: "submitted",
        historyEntry: { status: "submitted", entries }
      })
    });

    navigate("/townships/dashboard");
  };

  if (loading || !budget || !activeFund) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: 40, maxWidth: 1300, margin: "auto" }}>
      <h2>
        {chartOfAccounts[activeFund].meta.code}{" "}
        {chartOfAccounts[activeFund].meta.label}
      </h2>

      <p><b>Fiscal Year:</b> {budget.fiscalYear}</p>

      {/* BEGINNING BALANCE */}
      <div style={{ marginTop: 20 }}>
        <h3>BEGINNING BALANCE</h3>

        <table width="100%" border="1" cellPadding="6">
          <thead>
            <tr>
              <th>Code</th>
              <th>Account</th>
              <th>Last Yr</th>
              <th>Budget</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>—</td>
              <td>Beginning Balance</td>
              <td>
                <input
                  type="number"
                  value={entries.__meta.beginningBalanceLastYear}
                  onChange={(e) =>
                    setEntries((prev) => ({
                      ...prev,
                      __meta: {
                        ...prev.__meta,
                        beginningBalanceLastYear:
                          e.target.value === "" ? "" : Number(e.target.value)
                      }
                    }))
                  }
                />
              </td>
              <td>
                <input
                  type="number"
                  value={entries.__meta.beginningBalance}
                  onChange={(e) =>
                    setEntries((prev) => ({
                      ...prev,
                      __meta: {
                        ...prev.__meta,
                        beginningBalance:
                          e.target.value === "" ? "" : Number(e.target.value)
                      }
                    }))
                  }
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* FUND SELECTOR */}
      {budget.funds
        .filter((f) => chartOfAccounts[f])
        .map((fund) => (
          <button
            key={fund}
            onClick={() => setActiveFund(fund)}
            style={{
              marginRight: 8,
              marginTop: 20,
              background: fund === activeFund ? "#2563eb" : "#e5e7eb",
              color: fund === activeFund ? "#fff" : "#000"
            }}
          >
            {formatFundName(fund)}
          </button>
        ))}

      {/* DATA ENTRY */}
      {Object.entries(entries[activeFund] || {})
        .filter(([k]) => k !== "__meta")
        .map(([dept, deptData]) => (
          <div key={dept} style={{ marginTop: 40 }}>
            <h2>
              {chartOfAccounts[activeFund][dept].meta?.code}{" "}
              {chartOfAccounts[activeFund][dept].meta?.label}
            </h2>

            {deptData.accounts && (
              <TableBlock
                rows={deptData.accounts}
                dept={dept}
                category="accounts"
                handleChange={handleChange}
                variance={variance}
              />
            )}

            {Object.entries(deptData)
              .filter(([k]) => k !== "accounts")
              .map(([category, accounts]) => (
                <div key={category} style={{ marginTop: 20 }}>
                  <h3>{category}</h3>
                  <TableBlock
                    rows={accounts}
                    dept={dept}
                    category={category}
                    handleChange={handleChange}
                    variance={variance}
                  />
                </div>
              ))}
          </div>
        ))}

      <button style={{ marginTop: 30 }} onClick={saveAndSubmit}>
        Save & Submit
      </button>

      <button
        style={{ marginTop: 30, marginLeft: 10 }}
        onClick={async () => {
          await fetch(`http://localhost:5000/api/budgets/${budgetId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ entries, status: "draft" })
          });
          navigate("/townships/create-budget");
        }}
      >
        Back to Funds
      </button>
    </div>
  );
};

/* ================= TABLE ================= */
const TableBlock = ({ rows, dept, category, handleChange, variance }) => (
  <table width="100%" border="1" cellPadding="6">
    <thead>
      <tr>
        <th>Code</th>
        <th>Account</th>
        <th>Budget</th>
        <th>Last Yr</th>
        <th>Variance</th>
        <th>Notes</th>
      </tr>
    </thead>
    <tbody>
      {Object.entries(rows).map(([name, obj]) => (
        <tr key={name}>
          <td>{obj.code}</td>
          <td>{name}</td>
          <td>
            <input
              type="number"
              value={obj.budget}
              onChange={(e) =>
                handleChange(dept, category, name, "budget", e.target.value)
              }
            />
          </td>
          <td>
            <input
              type="number"
              value={obj.lastYear}
              onChange={(e) =>
                handleChange(dept, category, name, "lastYear", e.target.value)
              }
            />
          </td>
          <td>{variance(obj)}</td>
          <td>
            <input
              value={obj.notes}
              onChange={(e) =>
                handleChange(dept, category, name, "notes", e.target.value)
              }
            />
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

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
    motorFuelTax: "Tort Judgment & Liability Insurance"
  }[key] || key);

export default BudgetEntry;
