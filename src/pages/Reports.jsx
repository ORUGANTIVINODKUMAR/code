import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import chartOfAccounts from "../data/chartOfAccounts";
import { PDFDocument } from "pdf-lib";

/* ===== GENERAL TOWN REPORTS ===== */
import { createOrdinancePage } from "../reports/createOrdinancePage";
import { createGeneralTownPage } from "../reports/createGeneralTownPage";
import { createAdministrationPage } from "../reports/createAdministrationPage";
import { createAssessorPage } from "../reports/createAssessorPage";
import { createGeneralAssistancePage } from "../reports/createGeneralAssistancePage";
import { createGeneralAssistanceAdministrationPage } from "../reports/createGeneralAssistanceAdministrationPage";
import { createGeneralAssistanceHomeReliefPage } from "../reports/createGeneralAssistanceHomeReliefPage";
import { createIMRFPage } from "../reports/createIMRFPage";
import { createAppropriationsSummaryPage } from "../reports/createAppropriationsSummaryPage";
import { createSections6And7Page } from "../reports/createSections6And7Page";
import { createCertificationPage } from "../reports/createCertificationPage";
import { createCertifiedEstimateOfRevenuesPage } from "../reports/createCertifiedEstimateOfRevenuesPage";
/* ===== ROAD & BDIDGE REPORTS ===== */
import { createRoadBridgeOrdinancePage } 
  from "../reports/createRoadBridgeOrdinancePage";
import { createRoadBridgeSections6And7Page }
  from "../reports/createRoadBridgeSections6And7Page";
import { createRoadBridgePage }
  from "../reports/createRoadBridgePage";
/* ===== ROAD & BRIDGE FINAL BUDGET PAGES ===== */
import { createRBTortJudgmentPage } 
  from "../reports/createRBTortJudgmentPage";

import { createRBSpecialRoadImprovementPage } 
  from "../reports/createRBSpecialRoadImprovementPage";


/* ================= HELPERS ================= */

const money = (v) => {
  const num = Number(v) || 0;
  if (num === 0) return "$ 0";
  if (num < 0) return `($${Math.abs(num).toLocaleString()})`;
  return `$ ${num.toLocaleString()}`;
};

const hasValue = (prior, current) =>
  Number(prior) !== 0 || Number(current) !== 0;

const fundHasAnyValue = (fundData) => {
  if (!fundData) return false;

  return Object.entries(fundData).some(([key, section]) => {
    if (key === "__meta" || key === "Revenues") return false;

    return Object.values(section || {}).some(category =>
      Object.values(category || {}).some(acc =>
        Number(acc?.lastYear || 0) !== 0 ||
        Number(acc?.budget || 0) !== 0
      )
    );
  });
};

/* ================= COMPONENT ================= */

const Reports = () => {
  const navigate = useNavigate();
  const budgetId = localStorage.getItem("activeBudgetId");
  const [budget, setBudget] = useState(null);

  /* ================= LOAD BUDGET ================= */

  useEffect(() => {
    if (!budgetId) return;

    fetch(`http://localhost:5000/api/budgets/${budgetId}`)
      .then(res => res.json())
      .then(data => {
        console.log("BUDGET FROM API:", data);
        setBudget(data);
      })
      .catch(console.error);
  }, [budgetId]);

  /* 🔒 NULL GUARD */
  if (!budget) return <div>Loading report…</div>;

  /* ✅ SAFE AFTER GUARD */
  const isGeneralTown = budget.budgetType === "GENERAL_TOWN";
  const isRoadBridge = budget.budgetType === "ROAD_BRIDGE";


  const meta = budget.entries?.__meta || {};
  const beginPrior = Number(meta.beginningBalanceLastYear || 0);
  const beginCurrent = Number(meta.beginningBalance || 0);

  /* ================= PDF EXPORT ================= */

  const handleDownloadPDF = async () => {
    try {
      const finalPdf = await PDFDocument.create();
      console.log("BUDGET TYPE:", budget.budgetType);
      console.log("IS GENERAL:", isGeneralTown);
      console.log("IS ROAD:", isRoadBridge);
      console.log("========== ROAD & BRIDGE DEBUG ==========");
      console.log("budget.funds:", budget.funds);
      console.log("entries keys:", Object.keys(budget.entries || {}));

      console.log(
        "roadBridge keys:",
        Object.keys(budget.entries?.roadBridge || {})
      );

      console.log(
        "motorFuelTax keys:",
        Object.keys(budget.entries?.motorFuelTax || {})
      );

      console.log(
        "Is Motor Fuel inside roadBridge?",
        !!budget.entries?.roadBridge?.motorFuelTax
      );

      console.log("========================================");

      const addPdf = async (bytes) => {
        if (!bytes) return;
        const doc = await PDFDocument.load(bytes);
        const pages = await finalPdf.copyPages(doc, doc.getPageIndices());
        pages.forEach(p => finalPdf.addPage(p));
      };

      /* =================================================
         GENERAL TOWN PDF FLOW
      ================================================= */
      if (isGeneralTown) {
        await addPdf(await createOrdinancePage(budget));

        if (fundHasAnyValue(budget.entries?.generalTown)) {
          await addPdf(await createGeneralTownPage(budget));
          await addPdf(await createAdministrationPage(budget));
          await addPdf(await createAssessorPage(budget));
        }

        if (
          budget.funds.includes("generalAssistance") &&
          fundHasAnyValue(budget.entries?.generalAssistance)
        ) {
          await addPdf(await createGeneralAssistancePage(budget));
          await addPdf(await createGeneralAssistanceAdministrationPage(budget));
          await addPdf(await createGeneralAssistanceHomeReliefPage(budget));
        }

        if (
          budget.funds.includes("retirement") &&
          fundHasAnyValue(budget.entries?.retirement)
        ) {
          await addPdf(await createIMRFPage(budget));
        }

        await addPdf(await createAppropriationsSummaryPage(budget));
        await addPdf(await createSections6And7Page());
        await addPdf(await createCertificationPage(budget));
        await addPdf(await createCertifiedEstimateOfRevenuesPage(budget));
      }

      /* =================================================
         ROAD & BRIDGE PDF FLOW (NO GENERAL TOWN PAGES)
      ================================================= */


      if (isRoadBridge) {
        // Always print ordinance & sections
        await addPdf(await createRoadBridgeOrdinancePage(budget));
        await addPdf(await createRoadBridgeSections6And7Page(budget));

        // EXACTLY like UI: loop selected funds
        for (const fundKey of budget.funds) {
          const fundData = budget.entries?.[fundKey];
          if (!fundData) continue;

          await addPdf(await createRoadBridgePage(budget, fundKey));
        }
      }




      /* ================= DOWNLOAD ================= */

      const bytes = await finalPdf.save();
      const blob = new Blob([bytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "Township_Report.pdf";
      a.click();

      URL.revokeObjectURL(url);

    } catch (err) {
      console.error("PDF ERROR:", err);
      alert("PDF generation failed");
    }
  };

  /* ================= UI ================= */

  return (
    <div style={{ padding: 40, fontFamily: "Times New Roman" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <p>
          <b>Fiscal Year:</b> {budget.fiscalYear}
        </p>

        {budget.funds.map((fundKey) => {
          const coaFund = chartOfAccounts[fundKey];
          const fundData = budget.entries?.[fundKey];
          if (!coaFund || !fundData) return null;

          const revenues = fundData.Revenues?.accounts || {};
          let revenuePrior = 0;
          let revenueCurrent = 0;

          Object.values(revenues).forEach((a) => {
            revenuePrior += Number(a.lastYear || 0);
            revenueCurrent += Number(a.budget || 0);
          });

          let totalExpPrior = 0;
          let totalExpCurrent = 0;
          let fundRevenueCurrent = revenueCurrent;
          let fundRevenuePrior = revenuePrior;

          return (
            <div key={fundKey} style={{ marginTop: 40 }}>
              <h3>{coaFund.meta.code} {coaFund.meta.label}</h3>

              <table width="100%" cellPadding="4" style={{ borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th align="left">Code</th>
                    <th align="left">Account</th>
                    <th align="right">Prior Year</th>
                    <th align="right">Current Year</th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td colSpan="4"><b>BEGINNING BALANCE</b></td>
                  </tr>

                  {hasValue(beginPrior, beginCurrent) && (
                    <tr>
                      <td />
                      <td>April 1</td>
                      <td align="right">{money(beginPrior)}</td>
                      <td align="right">{money(beginCurrent)}</td>
                    </tr>
                  )}

                  <tr><td colSpan="4"><br /><b>REVENUES</b></td></tr>

                  {Object.entries(revenues).map(([name, acc]) => {
                    if (!hasValue(acc.lastYear, acc.budget)) return null;

                    return (
                      <tr key={name}>
                        <td style={{ paddingLeft: 40 }}>{acc.code}</td>
                        <td>{name}</td>
                        <td align="right">{money(acc.lastYear)}</td>
                        <td align="right">{money(acc.budget)}</td>
                      </tr>
                    );
                  })}

                  {hasValue(revenuePrior, revenueCurrent) && (
                    <tr>
                      <td />
                      <td>
                        <b>
                          {isRoadBridge ? "Non Departmental Totals:" : "TOTAL REVENUES"}
                        </b>
                      </td>
                      <td align="right"><b>{money(revenuePrior)}</b></td>
                      <td align="right"><b>{money(revenueCurrent)}</b></td>
                    </tr>
                  )}



                  <tr><td colSpan="4"><br /><b>EXPENDITURES</b></td></tr>

                  {Object.entries(fundData).map(([deptKey, deptVal]) => {
                    if (deptKey === "Revenues") return null;

                    let deptPrior = 0;
                    let deptCurrent = 0;

                    const hasDeptValues = Object.values(deptVal).some(cat =>
                      Object.values(cat).some(acc =>
                        hasValue(acc.lastYear, acc.budget)
                      )
                    );

                    if (!hasDeptValues) return null;

                    return (
                      <React.Fragment key={deptKey}>
                        <tr>
                          <td colSpan="4" style={{ fontWeight: "bold", paddingLeft: 20 }}>
                            {coaFund[deptKey]?.meta?.label}
                          </td>
                        </tr>

                        {Object.entries(deptVal).map(([catKey, catVal]) => {
                          const hasCategoryValues = Object.values(catVal).some(acc =>
                            hasValue(acc.lastYear, acc.budget)
                          );

                          if (!hasCategoryValues) return null;

                          return (
                            <React.Fragment key={catKey}>
                              <tr>
                                <td colSpan="4" style={{ fontStyle: "italic", paddingLeft: 40 }}>
                                  {catKey.toUpperCase()}
                                </td>
                              </tr>

                              {Object.entries(catVal).map(([accName, acc]) => {
                                const p = Number(acc.lastYear || 0);
                                const c = Number(acc.budget || 0);

                                if (!hasValue(p, c)) return null;

                                deptPrior += p;
                                deptCurrent += c;

                                return (
                                  <tr key={accName}>
                                    <td style={{ paddingLeft: 60 }}>{acc.code}</td>
                                    <td>{accName}</td>
                                    <td align="right">{money(p)}</td>
                                    <td align="right">{money(c)}</td>
                                  </tr>
                                );
                              })}
                            </React.Fragment>
                          );
                        })}

                        <tr>
                          <td />
                          <td>
                            <b>
                              {isRoadBridge
                                ? `${coaFund[deptKey]?.meta?.label} Totals:`
                                : `TOTAL ${coaFund[deptKey]?.meta?.label}`}
                            </b>
                          </td>
                            <td align="right"><b>{money(deptPrior)}</b></td>
                            <td align="right"><b>{money(deptCurrent)}</b></td>
                        </tr>



                        {(() => {
                          totalExpPrior += deptPrior;
                          totalExpCurrent += deptCurrent;
                        })()}
                      </React.Fragment>
                    );
                  })}

                  <tr><td colSpan="4"><br /><b>ENDING BALANCE</b></td></tr>

                  {hasValue(
                    beginPrior + revenuePrior - totalExpPrior,
                    beginCurrent + revenueCurrent - totalExpCurrent
                  ) && (
                    <tr>
                      <td />
                      <td>March 31</td>
                      <td align="right">
                        <b>{money(beginPrior + revenuePrior - totalExpPrior)}</b>
                      </td>
                      <td align="right">
                        <b>{money(beginCurrent + revenueCurrent - totalExpCurrent)}</b>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              {/* ================= FUND SUMMARY (ROAD & BRIDGE ONLY) ================= */}
              {isRoadBridge && (
                <div style={{ marginTop: 30 }}>
                  <table width="100%" cellPadding="4">
                    <tbody>
                      <tr>
                        <td>Fund Beginning Balance</td>
                        <td align="right">{money(beginCurrent)}</td>
                      </tr>
                      <tr>
                        <td>Total Fund Revenues</td>
                        <td align="right">{money(fundRevenueCurrent)}</td>
                      </tr>
                      <tr>
                        <td>Total Fund Expenditures</td>
                        <td align="right">{money(totalExpCurrent)}</td>
                      </tr>
                      <tr>
                        <td><b>Fund Ending Balance</b></td>
                        <td align="right">
                          <b>{money(beginCurrent + fundRevenueCurrent - totalExpCurrent)}</b>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  </div>
              )}

            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 30 }}>
        <button onClick={() => navigate("/townships/dashboard")}>Back</button>
        <button style={{ marginLeft: 20 }} onClick={handleDownloadPDF}>
          Process & Download as PDF
        </button>
      </div>
    </div>
  );
};

export default Reports;
