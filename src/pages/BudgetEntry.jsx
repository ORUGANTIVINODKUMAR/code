import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import chartOfAccounts from "../data/chartOfAccounts";

const BudgetEntry = () => {
  const navigate = useNavigate();
  const budgetId = localStorage.getItem("activeBudgetId");

  const [budget, setBudget] = useState(null);
  const [entries, setEntries] = useState({});
  const [activeFund] = useState("generalTown");

  useEffect(() => {
    const loadBudget = async () => {
      const res = await fetch(`http://localhost:5000/api/budgets/${budgetId}`);
      const data = await res.json();
      setBudget(data);
      setEntries(data.entries || {});
    };
    loadBudget();
  }, [budgetId]);

  /* ================= ADD ROW ================= */
  const addRow = (fund, category) => {
    const newKey = `New Account ${Date.now()}`;

    setEntries(prev => ({
      ...prev,
      [fund]: {
        ...prev[fund],
        [category]: {
          ...prev[fund]?.[category],
          [newKey]: {
            code: "",
            lastYear: 0,
            budget: 0
          }
        }
      }
    }));
  };

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (fund, category, key, field, value) => {
    setEntries(prev => ({
      ...prev,
      [fund]: {
        ...prev[fund],
        [category]: {
          ...prev[fund]?.[category],
          [key]: {
            ...prev[fund]?.[category]?.[key],
            [field]: field === "code" ? value : Number(value)
          }
        }
      }
    }));
  };

  /* ================= SAVE ================= */
  const saveDraft = async () => {
    await fetch(`http://localhost:5000/api/budgets/${budgetId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        entries,
        status: "submitted"
      })
    });
    navigate("/townships/dashboard");
  };

  if (!budget) return null;

  return (
    <div style={{ padding: 40 }}>
      <h2>{budget.name}</h2>

      {Object.entries(chartOfAccounts[activeFund]).map(
        ([category, defaultAccounts]) => {
          const storedAccounts =
            entries?.[activeFund]?.[category] || {};

          return (
            <div key={category} style={{ marginBottom: 40 }}>
              <h3>{category}</h3>

              <table width="100%">
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Account</th>
                    <th>Last Year</th>
                    <th>Budget</th>
                  </tr>
                </thead>

                <tbody>
                  {/* DEFAULT ACCOUNTS */}
                  {defaultAccounts.map(acc => {
                    const obj = storedAccounts[acc.name] || {};
                    return (
                      <tr key={acc.code}>
                        <td>{acc.code}</td>
                        <td>{acc.name}</td>
                        <td>
                          <input
                            value={obj.lastYear || ""}
                            onChange={e =>
                              handleChange(
                                activeFund,
                                category,
                                acc.name,
                                "lastYear",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td>
                          <input
                            value={obj.budget || ""}
                            onChange={e =>
                              handleChange(
                                activeFund,
                                category,
                                acc.name,
                                "budget",
                                e.target.value
                              )
                            }
                          />
                        </td>
                      </tr>
                    );
                  })}

                  {/* USER ADDED ROWS */}
                  {Object.entries(storedAccounts)
                    .filter(
                      ([key]) =>
                        !defaultAccounts.find(a => a.name === key)
                    )
                    .map(([key, obj]) => (
                      <tr key={key}>
                        <td>
                          <input
                            value={obj.code}
                            onChange={e =>
                              handleChange(
                                activeFund,
                                category,
                                key,
                                "code",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td>{key}</td>
                        <td>
                          <input
                            value={obj.lastYear}
                            onChange={e =>
                              handleChange(
                                activeFund,
                                category,
                                key,
                                "lastYear",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td>
                          <input
                            value={obj.budget}
                            onChange={e =>
                              handleChange(
                                activeFund,
                                category,
                                key,
                                "budget",
                                e.target.value
                              )
                            }
                          />
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>

              {/* ➕ ADD BUTTON */}
              <button
                style={{ marginTop: 10 }}
                onClick={() => addRow(activeFund, category)}
              >
                + Add Row
              </button>
            </div>
          );
        }
      )}

      <button onClick={saveDraft}>Save</button>
    </div>
  );
};

export default BudgetEntry;
