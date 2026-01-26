import React from "react";

/* ================= HELPERS ================= */

const formatFundName = (key) =>
  ({
    generalTown: "General Town",
    generalAssistance: "General Assistance",
    cemetery: "Cemetery",
    insurance: "Insurance",
    socialSecurity: "Social Security",
    retirement: "Illinois Municipal Retirement Fund",
    roadBridge: "Road & Bridge",
    permanentRoad: "Permanent Road",
    equipmentBuilding: "Equipment & Building",
    motorFuelTax: "Motor Fuel Tax"
  }[key] || key);

/* Underline block (fillable-style) */
const Blank = ({ width = "220px" }) => (
  <span
    style={{
      display: "inline-block",
      width,
      borderBottom: "1px solid #000",
      margin: "0 6px",
      height: "1em",
      verticalAlign: "bottom"
    }}
  />
);

/* ================= COMPONENT ================= */

const PdfReportRenderer = ({ budget }) => {
  if (!budget) return null;

  return (
    <div
      style={{
        width: "210mm",
        height: "297mm",
        padding: "18mm 18mm",
        fontFamily: "Times New Roman",
        fontSize: "14pt",
        lineHeight: "1.9",
        boxSizing: "border-box",
        background: "#fff",
        position: "relative"
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "right", fontSize: "9pt" }}>
        DCEO #2 (Revised 7/03)
      </div>

      <h2 style={{ textAlign: "center", marginTop: 30 }}>
        BUDGET & APPROPRIATION ORDINANCE
      </h2>

      <h4 style={{ textAlign: "center", marginTop: 12 }}>
        TOWNSHIP
      </h4>

      {/* Paragraph 1 */}
      <p style={{ marginTop: 32 }}>
        An ordinance appropriating for all town purposes for
        <Blank width="240px" />
        Township,
        <Blank width="200px" />
        County, Illinois, for the fiscal year
        <Blank width="120px" />.
      </p>

      {/* Paragraph 2 */}
      <p style={{ marginTop: 22 }}>
        BE IT ORDAINED by the Board of Trustees of
        <Blank width="240px" />
        Township,
        <Blank width="200px" />
        County, Illinois.
      </p>

      {/* SECTION 1 */}
      <p style={{ marginTop: 28 }}>
        <b>SECTION 1:</b> That the amounts hereinafter set forth, or so much
        thereof as may be authorized by law, and as may be needed or deemed
        necessary to defray all expenses and liabilities of
        <Blank width="240px" />
        Township, be and the same are hereby appropriated for the town purposes
        of said Township, County, Illinois, as hereinafter specified for the
        fiscal year
        <Blank width="120px" />.
      </p>

      {/* SECTION 2 */}
      <p style={{ marginTop: 28 }}>
        <b>SECTION 2:</b> That the following budget containing an estimate of
        revenues and expenditures is hereby adopted for the following funds:
      </p>

      <ul style={{ marginTop: 14 }}>
        {budget.funds.map((f) => (
          <li key={f} style={{ marginBottom: 6 }}>
            {formatFundName(f)}
          </li>
        ))}
      </ul>

      {/* Footer */}
      <div
        style={{
          position: "absolute",
          bottom: "18mm",
          width: "100%",
          textAlign: "center",
          fontSize: "9pt"
        }}
      >
        2-1
      </div>
    </div>
  );
};

export default PdfReportRenderer;
