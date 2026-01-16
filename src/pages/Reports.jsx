import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Reports = () => {
  const navigate = useNavigate();
  const budgetId = localStorage.getItem("activeBudgetId");

  const [budget, setBudget] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/budgets/${budgetId}`)
      .then(res => res.json())
      .then(data => setBudget(data));
  }, [budgetId]);

  if (!budget) return null;

  return (
    <div style={{ padding: 40 }}>
      <h2>{budget.name}</h2>
      <p>{budget.fiscalYear}</p>

      {Object.entries(budget.entries || {}).map(([fund, categories]) => (
        <div key={fund}>
          <h3>{fund.toUpperCase()}</h3>

          {Object.entries(categories).map(([category, accounts]) => (
            <div key={category}>
              <h4>{category}</h4>

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
                  {Object.entries(accounts).map(([name, obj]) => (
                    <tr key={name}>
                      <td>{obj.code}</td>
                      <td>{name}</td>
                      <td>{obj.lastYear?.toLocaleString()}</td>
                      <td>{obj.budget?.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      ))}

      <button onClick={() => navigate("/townships/dashboard")}>
        Back
      </button>
    </div>
  );
};



export default Reports;


