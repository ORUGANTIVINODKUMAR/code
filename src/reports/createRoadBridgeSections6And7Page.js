import { PDFDocument, StandardFonts } from "pdf-lib";

/* ================= HELPERS ================= */

function getFiscalDates(fiscalYear) {
  if (!fiscalYear) {
    return { startDate: "__________", endDate: "__________" };
  }

  // Custom FY
  const customMatch = fiscalYear.match(
    /Custom FY\s*\((\d{4}-\d{2}-\d{2})\s*[–-]\s*(\d{4}-\d{2}-\d{2})\)/
  );
  if (customMatch) {
    return {
      startDate: customMatch[1],
      endDate: customMatch[2]
    };
  }

  // Township FY
  const years = fiscalYear.match(/\d{4}/g);
  if (years && years.length >= 2) {
    return {
      startDate: `March 1, ${years[0]}`,
      endDate: `February 28, ${years[1]}`
    };
  }

  // Calendar year
  if (/^\d{4}$/.test(fiscalYear)) {
    return {
      startDate: `January 1, ${fiscalYear}`,
      endDate: `December 31, ${fiscalYear}`
    };
  }

  return { startDate: "__________", endDate: "__________" };
}

function calculateTotals(entries, funds) {
  let revenues = 0;
  let expenditures = 0;

  funds.forEach(fundKey => {
    const fund = entries?.[fundKey];
    if (!fund) return;

    // Revenues
    Object.values(fund.Revenues?.accounts || {}).forEach(acc => {
      revenues += Number(acc?.budget || 0);
    });

    // Expenditures
    Object.entries(fund).forEach(([sectionKey, sectionVal]) => {
      if (sectionKey === "Revenues" || sectionKey === "__meta") return;

      Object.values(sectionVal || {}).forEach(category => {
        Object.values(category || {}).forEach(acc => {
          expenditures += Number(acc?.budget || 0);
        });
      });
    });
  });

  return { revenues, expenditures };
}

/* ================= PAGE ================= */

export async function createRoadBridgeSections6And7Page(budget) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]);

  const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const bold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

  const LEFT = 70;
  const RIGHT = 520;
  let y = 740;

  const township = budget.townshipId?.townshipName || "________";
  const county = budget.townshipId?.county || "________";
  const { startDate, endDate } = getFiscalDates(budget.fiscalYear);

  const beginningBalance =
    Number(budget.entries?.__meta?.beginningBalance || 0);

  const { revenues, expenditures } = calculateTotals(
    budget.entries,
    budget.funds
  );

  const endingBalance =
    beginningBalance + revenues - expenditures;

  /* ================= SECTION 6 ================= */

  page.drawText(
    "SECTION 6: That Section 3 shall be and is a summary of the annual Appropriation Ordinance",
    { x: LEFT, y, size: 11, font }
  );
  y -= 18;

  page.drawText(
    `of this Road District, passed by the Board of Trustees as required by law and shall be in full`,
    { x: LEFT, y, size: 11, font }
  );
  y -= 18;

  page.drawText(
    "force and effect from and after this date.",
    { x: LEFT, y, size: 11, font }
  );

  y -= 40;

  /* ================= SECTION 7 ================= */

  page.drawText(
    "SECTION 7: That a certified copy of the Budget and Appropriation Ordinance shall be filed with",
    { x: LEFT, y, size: 11, font }
  );
  y -= 18;

  page.drawText(
    "the County Clerk within 30 days after adoption.",
    { x: LEFT, y, size: 11, font }
  );

  y -= 50;

  /* ================= BALANCE TABLE ================= */

  page.drawText("BEGINNING BALANCE", {
    x: LEFT + 180,
    y,
    size: 10,
    font: bold
  });

  page.drawText("ENDING BALANCE", {
    x: LEFT + 340,
    y,
    size: 10,
    font: bold
  });

  y -= 14;

  page.drawText(startDate, {
    x: LEFT + 180,
    y,
    size: 9,
    font
  });

  page.drawText(endDate, {
    x: LEFT + 340,
    y,
    size: 9,
    font
  });

  y -= 30;

  budget.funds.forEach(fundKey => {
    const fundLabelMap = {
      roadBridge: "Warren Township Road and Bridge",
      permanentRoad: "Special Road Improvement",
      equipmentBuilding: "Building & Equipment",
      motorFuelTax: "Tort Judgment & Liability Insurance"
    };

    page.drawText(fundLabelMap[fundKey] || fundKey, {
      x: LEFT,
      y,
      size: 11,
      font
    });

    page.drawText(`$${beginningBalance.toLocaleString()}`, {
      x: LEFT + 190,
      y,
      size: 11,
      font
    });

    page.drawText(`$${endingBalance.toLocaleString()}`, {
      x: LEFT + 350,
      y,
      size: 11,
      font
    });

    y -= 22;
  });

  y -= 40;

  /* ================= SIGNATURES ================= */

  page.drawText(
    `ADOPTED this _____ day of ____________, pursuant to a roll call vote by the Board of Trustees of`,
    { x: LEFT, y, size: 11, font }
  );
  y -= 18;

  page.drawText(
    `${township} Township, ${county} County, Illinois.`,
    { x: LEFT, y, size: 11, font }
  );

  y -= 50;

  /* ================= VOTING TABLE (NO NAMES) ================= */

  page.drawText("BOARD OF TRUSTEES", { x: LEFT, y, size: 10, font: bold });
  page.drawText("AYE", { x: LEFT + 240, y, size: 10, font: bold });
  page.drawText("NAY", { x: LEFT + 310, y, size: 10, font: bold });
  page.drawText("ABSENT", { x: LEFT + 380, y, size: 10, font: bold });

  y -= 20;

  for (let i = 0; i < 5; i++) {
    page.drawLine({ start: { x: LEFT + 220, y }, end: { x: LEFT + 260, y }, thickness: 0.8 });
    page.drawLine({ start: { x: LEFT + 290, y }, end: { x: LEFT + 330, y }, thickness: 0.8 });
    page.drawLine({ start: { x: LEFT + 360, y }, end: { x: LEFT + 400, y }, thickness: 0.8 });
    y -= 18;
  }

  y -= 40;

  /* ================= SIGNATURES ================= */

  page.drawLine({
    start: { x: LEFT, y },
    end: { x: LEFT + 200, y },
    thickness: 0.8
  });

  page.drawLine({
    start: { x: LEFT + 260, y },
    end: { x: LEFT + 460, y },
    thickness: 0.8
  });

  y -= 14;

  page.drawText("Town Clerk", { x: LEFT + 60, y, size: 10, font });
  page.drawText("Chairman, Board of Trustees", {
    x: LEFT + 280,
    y,
    size: 10,
    font
  });

  /* ================= FOOTER ================= */

  page.drawText("RD-2", { x: 295, y: 40, size: 9, font });

  return await pdfDoc.save();
}
