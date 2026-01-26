import React from "react";

/**
 * PAGE 1 – ORDINANCE PAGE (TEXT ONLY)
 * No tables
 * No amounts
 */
const GeneralTownOrdinancePage = ({
  townshipName,
  county,
  state,
  fiscalYearLabel,
  selectedFunds
}) => {
  return (
    <div
      style={{
        padding: "60px 40px",
        fontFamily: "Times New Roman",
        lineHeight: 1.8
      }}
    >
      <p style={{ fontSize: 12 }}>DCEO #2 (Revised)</p>

      <h2 style={{ textAlign: "center", marginTop: 40 }}>
        BUDGET & APPROPRIATION ORDINANCE
      </h2>

      <h3 style={{ textAlign: "center", marginTop: 20 }}>
        TOWNSHIP
      </h3>

      <h4 style={{ textAlign: "center", marginTop: 10 }}>
        ORDINANCE NO. ______
      </h4>

      <p style={{ marginTop: 40 }}>
        An ordinance appropriating for all town purposes for{" "}
        <b>{townshipName || "_________________"}</b>{" "}
        Township, <b>{county || "__________"}</b> County,{" "}
        <b>{state || "Illinois"}</b>, for the fiscal year beginning{" "}
        <b>{fiscalYearLabel}</b>.
      </p>

      <p style={{ marginTop: 20 }}>
        BE IT ORDAINED by the Board of Trustees of{" "}
        <b>{townshipName || "_________________"}</b> Township,{" "}
        <b>{county || "__________"}</b> County, Illinois.
      </p>

      <p style={{ marginTop: 30 }}>
        <b>SECTION 1:</b> That the amounts hereinafter set forth, or so much
        thereof as may be authorized by law, and as may be needed or deemed
        necessary to defray all expenses and liabilities of{" "}
        <b>{townshipName || "_________________"}</b> Township, be and the same
        are hereby appropriated for the town purposes of said township for the
        fiscal year stated above.
      </p>

      <p style={{ marginTop: 30 }}>
        <b>SECTION 2:</b> That the following budget containing an estimate of
        revenues and expenditures is hereby adopted for the following funds:
      </p>

      <ul>
        {(selectedFunds || []).map((fund) => (
          <li key={fund}>{fund}</li>
        ))}
      </ul>

      {/* Force next page */}
      <div style={{ pageBreakAfter: "always" }} />
    </div>
  );
};


export default GeneralTownOrdinancePage;
