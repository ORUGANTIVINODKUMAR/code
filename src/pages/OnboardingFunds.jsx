import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import chartOfAccounts from "../data/chartOfAccounts";

import { PDFDocument } from "pdf-lib";
import { createOrdinancePage } from "../reports/createOrdinancePage";
import { createGeneralTownPage } from "../reports/createGeneralTownPage";
import { createAdministrationPage } from "../reports/createAdministrationPage";
import { createAssessorPage } from "../reports/createAssessorPage";
import { createGeneralAssistancePage } from "../reports/createGeneralAssistancePage";
import { createGeneralAssistanceAdministrationPage } 
  from "../reports/createGeneralAssistanceAdministrationPage";
import { createGeneralAssistanceHomeReliefPage }
  from "../reports/createGeneralAssistanceHomeReliefPage";
import { createIMRFPage } from "../reports/createIMRFPage";
import { createAppropriationsSummaryPage } 
  from "../reports/createAppropriationsSummaryPage";
import { createSections6And7Page } from "../reports/createSections6And7Page";
import { createCertificationPage } from "../reports/createCertificationPage";
import { createCertifiedEstimateOfRevenuesPage } 
  from "../reports/createCertifiedEstimateOfRevenuesPage";

/* ================= HELPERS ================= */

const money = (v) => {
  const num = Number(v) || 0;

  if (num === 0) return "$ 0";

  if (num < 0) {
    return `($${Math.abs(num).toLocaleString()})`;
  }

  return `$ ${num.toLocaleString()}`;
};

const hasValue = (prior, current) => {
  return Number(prior) !== 0 || Number(current) !== 0;
};
/* ================= HELPERS ================= */

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
}
/* ================= COMPONENT ================= */

const Reports = () => {
  const navigate = useNavigate();
  const budgetId = localStorage.getItem("activeBudgetId");
  const [budget, setBudget] = useState(null);

  useEffect(() => {
    if (!budgetId) return;

    fetch(`http://localhost:5000/api/budgets/${budgetId}`)
      .then((res) => res.json())
      .then((data) => {

        console.log("========================================");
        console.log("BUDGET FROM API:", data); // 👈 ADD THIS
        console.log("========================================");        
        console.log(
          "GENERAL TOWN KEYS:",
          Object.keys(data.entries?.generalTown || {})
        );
        console.log(
        "IMRF KEYS:",
        Object.keys(data.entries?.illinoisMunicipalRetirement || {})
        );

        console.log(
          "IMRF → REVENUES KEYS:",
          Object.keys(data.entries?.illinoisMunicipalRetirement?.Revenues || {})
        );

        console.log(
          "IMRF → EXPENDITURES KEYS:",
          Object.keys(data.entries?.illinoisMunicipalRetirement?.Expenditures || {})
        );
        console.log(
          "ENTRIES ROOT KEYS:",
          Object.keys(data.entries || {})
        );

        setBudget(data);
      })
      .catch(console.error);
  }, [budgetId]);


  if (!budget) return <div>Loading report…</div>;

  const meta = budget.entries?.__meta || {};
  const beginPrior = Number(meta.beginningBalanceLastYear || 0);
  const beginCurrent = Number(meta.beginningBalance || 0);

  /* ================= PDF EXPORT ================= */


  const handleDownloadPDF = async () => {
    try {
      /* ================= PAGE GENERATION ================= */

      // Page 1 — Ordinance (ALWAYS)
      const ordinanceBytes = await createOrdinancePage(budget);

    // Page 2 — General Town (optional)
      let generalTownBytes = null;
      if (fundHasAnyValue(budget.entries?.generalTown)) {
        generalTownBytes = await createGeneralTownPage(budget);
      }

      // Page 3 — Administration (only if General Town has values)
      let adminBytes = null;
      if (fundHasAnyValue(budget.entries?.generalTown)) {
        adminBytes = await createAdministrationPage(budget);
      }

    // Page 4 — Assessor (only if General Town has values)
      let assessorBytes = null;
      if (fundHasAnyValue(budget.entries?.generalTown)) {
        assessorBytes = await createAssessorPage(budget);
      }

    // Page 5–7 — General Assistance (ONLY if selected + has values)
      let gaBytes = null;
      let gaAdminBytes = null;
      let homeReliefBytes = null;

      if (
        budget.funds.includes("generalAssistance") &&
        fundHasAnyValue(budget.entries?.generalAssistance)
      ) {
        gaBytes = await createGeneralAssistancePage(budget);
        gaAdminBytes = await createGeneralAssistanceAdministrationPage(budget);
        homeReliefBytes = await createGeneralAssistanceHomeReliefPage(budget);
      }

    // Page 8 — IMRF (ONLY if selected + has values)
      let imrfBytes = null;
      if (
        budget.funds.includes("illinoisMunicipalRetirement") &&
        fundHasAnyValue(budget.entries?.illinoisMunicipalRetirement)
      ) {
        imrfBytes = await createIMRFPage(budget);
      }

      // Page 9 — Appropriations Summary (always, but internally filtered)
      const appropriationsBytes =
        await createAppropriationsSummaryPage(budget);

      // Page 10 — Sections 6 & 7
      const sec67Bytes = await createSections6And7Page();

      // Page 11 — Certification
      const certBytes = await createCertificationPage();

      // Page 12 — Certified Estimate of Revenues
      const revenueCertBytes =
        await createCertifiedEstimateOfRevenuesPage();

      /* ================= PDF MERGE ================= */

      const finalPdf = await PDFDocument.create();

      const addPdf = async (bytes) => {
        if (!bytes) return;
        const doc = await PDFDocument.load(bytes);
        const pages = await finalPdf.copyPages(
          doc,
          doc.getPageIndices()
        );
        pages.forEach(p => finalPdf.addPage(p));
      };

      // Correct order
      await addPdf(ordinanceBytes);        // Page 1
      await addPdf(generalTownBytes);      // Page 2
      await addPdf(adminBytes);            // Page 3
      await addPdf(assessorBytes);         // Page 4
      await addPdf(gaBytes);               // Page 5
      await addPdf(gaAdminBytes);          // Page 6
      await addPdf(homeReliefBytes);       // Page 7
      await addPdf(imrfBytes);             // Page 8
      await addPdf(appropriationsBytes);   // Page 9
      await addPdf(sec67Bytes);            // Page 10
      await addPdf(certBytes);             // Page 11
      await addPdf(revenueCertBytes);      // Page 12

      /* ================= DOWNLOAD ================= */

      const finalBytes = await finalPdf.save();
      const blob = new Blob([finalBytes], { type: "application/pdf" });
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
                      <td><b>TOTAL REVENUES</b></td>
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
                          <td><b>TOTAL {coaFund[deptKey]?.meta?.label}</b></td>
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
