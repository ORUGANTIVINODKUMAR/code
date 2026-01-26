import React from "react";
import chartOfAccounts from "../data/chartOfAccounts";

/* ================= HELPERS ================= */

const formatMoney = (value, isPdf) => {
  const num = Number(value || 0);

  if (isPdf && num < 0) {
    return `($${Math.abs(num).toLocaleString()})`;
  }

  return `$ ${num.toLocaleString()}`;
};

// ✅ Hide zero rows ONLY in PDF
const shouldRenderRow = (prior, current, isPdf) => {
  if (!isPdf) return true;
  return Number(prior) !== 0 || Number(current) !== 0;
};

/* ================= COMPONENT ================= */

const RoadBridgeReport = ({ budget, isPdf = false }) => {
  if (!budget) return null;

  const meta = budget.entries?.__meta || {};
  const beginPrior = Number(meta.beginningBalanceLastYear || 0);
  const beginCurrent = Number(meta.beginningBalance || 0);

  return (
    <div>
      <p>
        <b>Fiscal Year:</b> {budget.fiscalYear}
      </p>

      {budget.funds.map((fundKey) => {
        const coaFund = chartOfAccounts[fundKey];
        const fundData = budget.entries?.[fundKey];

        if (!coaFund || !fundData) return null;

        /* ================= REVENUES ================= */

        const revenues = fundData.Revenues?.accounts || {};
        let revenuePrior = 0;
        let revenueCurrent = 0;

        Object.values(revenues).forEach((a) => {
          revenuePrior += Number(a.lastYear || 0);
          revenueCurrent += Number(a.budget || 0);
        });

        /* ================= EXPENDITURES ================= */

        let totalExpPrior = 0;
        let totalExpCurrent = 0;

        return (
          <div
            key={fundKey}
            style={{
              marginTop: 40,
              pageBreakBefore: isPdf ? "always" : "auto"
            }}
          >
            <h3>
              {coaFund.meta.code} {coaFund.meta.label}
            </h3>

            <table
              width="100%"
              cellPadding="4"
              cellSpacing="0"
              style={{ borderCollapse: "collapse" }}
            >
              <thead>
                <tr>
                  <th align="left">Code</th>
                  <th align="left">Account</th>
                  <th align="right">Prior Year</th>
                  <th align="right">Current Year</th>
                </tr>
              </thead>

              <tbody>
                {/* BEGINNING BALANCE */}
                <tr>
                  <td colSpan="4"><b>BEGINNING BALANCE</b></td>
                </tr>
                <tr>
                  <td />
                  <td>April 1</td>
                  <td align="right">{formatMoney(beginPrior, isPdf)}</td>
                  <td align="right">{formatMoney(beginCurrent, isPdf)}</td>
                </tr>

                {/* REVENUES */}
                <tr><td colSpan="4"><br /><b>REVENUES</b></td></tr>

                {Object.entries(revenues).map(([name, acc]) => {
                  if (!shouldRenderRow(acc.lastYear, acc.budget, isPdf)) {
                    return null;
                  }

                  return (
                    <tr key={name}>
                      <td style={{ paddingLeft: 40 }}>{acc.code}</td>
                      <td>{name}</td>
                      <td align="right">{formatMoney(acc.lastYear, isPdf)}</td>
                      <td align="right">{formatMoney(acc.budget, isPdf)}</td>
                    </tr>
                  );
                })}

                <tr>
                  <td />
                  <td><b>TOTAL REVENUES</b></td>
                  <td align="right"><b>{formatMoney(revenuePrior, isPdf)}</b></td>
                  <td align="right"><b>{formatMoney(revenueCurrent, isPdf)}</b></td>
                </tr>

                <tr>
                  <td />
                  <td><b>TOTAL FUNDS AVAILABLE</b></td>
                  <td align="right">
                    <b>{formatMoney(beginPrior + revenuePrior, isPdf)}</b>
                  </td>
                  <td align="right">
                    <b>{formatMoney(beginCurrent + revenueCurrent, isPdf)}</b>
                  </td>
                </tr>

                {/* EXPENDITURES */}
                <tr><td colSpan="4"><br /><b>EXPENDITURES</b></td></tr>

                {Object.entries(fundData).map(([deptKey, deptVal]) => {
                  if (deptKey === "Revenues") return null;

                  let deptPrior = 0;
                  let deptCurrent = 0;

                  return (
                    <React.Fragment key={deptKey}>
                      <tr>
                        <td colSpan="4" style={{ paddingLeft: 20, fontWeight: "bold" }}>
                          {coaFund[deptKey]?.meta?.code}{" "}
                          {coaFund[deptKey]?.meta?.label}
                        </td>
                      </tr>

                      {Object.entries(deptVal).map(([catKey, catVal]) => {
                        let catPrior = 0;
                        let catCurrent = 0;

                        return (
                          <React.Fragment key={catKey}>
                            <tr>
                              <td colSpan="4" style={{ paddingLeft: 40, fontStyle: "italic" }}>
                                {catKey.toUpperCase()}
                              </td>
                            </tr>

                            {Object.entries(catVal).map(([accName, acc]) => {
                              const p = Number(acc.lastYear || 0);
                              const c = Number(acc.budget || 0);

                              if (!shouldRenderRow(p, c, isPdf)) return null;

                              catPrior += p;
                              catCurrent += c;
                              deptPrior += p;
                              deptCurrent += c;

                              return (
                                <tr key={accName}>
                                  <td style={{ paddingLeft: 60 }}>{acc.code}</td>
                                  <td>{accName}</td>
                                  <td align="right">{formatMoney(p, isPdf)}</td>
                                  <td align="right">{formatMoney(c, isPdf)}</td>
                                </tr>
                              );
                            })}

                            {shouldRenderRow(catPrior, catCurrent, isPdf) && (
                              <tr>
                                <td />
                                <td><b>Subtotal</b></td>
                                <td align="right"><b>{formatMoney(catPrior, isPdf)}</b></td>
                                <td align="right"><b>{formatMoney(catCurrent, isPdf)}</b></td>
                              </tr>
                            )}
                          </React.Fragment>
                        );
                      })}

                      {shouldRenderRow(deptPrior, deptCurrent, isPdf) && (
                        <tr>
                          <td />
                          <td><b>TOTAL {coaFund[deptKey]?.meta?.label}</b></td>
                          <td align="right"><b>{formatMoney(deptPrior, isPdf)}</b></td>
                          <td align="right"><b>{formatMoney(deptCurrent, isPdf)}</b></td>
                        </tr>
                      )}

                      {(() => {
                        totalExpPrior += deptPrior;
                        totalExpCurrent += deptCurrent;
                      })()}
                    </React.Fragment>
                  );
                })}

                {/* ENDING BALANCE */}
                <tr><td colSpan="4"><br /><b>ENDING BALANCE</b></td></tr>
                <tr>
                  <td />
                  <td>March 31</td>
                  <td align="right">
                    <b>{formatMoney(beginPrior + revenuePrior - totalExpPrior, isPdf)}</b>
                  </td>
                  <td align="right">
                    <b>{formatMoney(beginCurrent + revenueCurrent - totalExpCurrent, isPdf)}</b>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
};

export default RoadBridgeReport;
