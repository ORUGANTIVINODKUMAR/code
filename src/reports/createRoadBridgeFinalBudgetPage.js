import { PDFDocument, StandardFonts } from "pdf-lib";

/* ================= HELPERS ================= */

function getFiscalDates(fiscalYear) {
  if (!fiscalYear) {
    return { startDate: "__________", endDate: "__________" };
  }

  // Custom FY (YYYY-MM-DD – YYYY-MM-DD)
  const custom = fiscalYear.match(
    /Custom FY\s*\((\d{4}-\d{2}-\d{2})\s*[–-]\s*(\d{4}-\d{2}-\d{2})\)/
  );
  if (custom) {
    return {
      startDate: custom[1],
      endDate: custom[2]
    };
  }

  // Township FY
  const years = fiscalYear.match(/\d{4}/g);
  if (years && years.length >= 2) {
    return {
      startDate: `April 1, ${years[0]}`,
      endDate: `March 31, ${years[1]}`
    };
  }

  // Calendar Year
  if (/^\d{4}$/.test(fiscalYear)) {
    return {
      startDate: `January 1, ${fiscalYear}`,
      endDate: `December 31, ${fiscalYear}`
    };
  }

  return { startDate: "__________", endDate: "__________" };
}

function sumRevenues(entries, funds) {
  let total = 0;

  funds.forEach(fundKey => {
    const revenues = entries?.[fundKey]?.Revenues?.accounts || {};
    Object.values(revenues).forEach(acc => {
      total += Number(acc?.budget || 0);
    });
  });

  return total;
}

function sumExpenditures(entries, funds) {
  let total = 0;

  funds.forEach(fundKey => {
    const fundData = entries?.[fundKey];
    if (!fundData) return;

    Object.entries(fundData).forEach(([sectionKey, sectionVal]) => {
      if (sectionKey === "Revenues" || sectionKey === "__meta") return;

      Object.values(sectionVal || {}).forEach(category => {
        Object.values(category || {}).forEach(acc => {
          total += Number(acc?.budget || 0);
        });
      });
    });
  });

  return total;
}

function formatMoney(v) {
  return `$${Number(v || 0).toLocaleString()}`;
}

/* ================= PAGE ================= */

export async function createRoadBridgeFinalBudgetPage(budget) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4

  const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const bold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

  const LEFT = 70;
  const RIGHT = 525;
  let y = 760;

  const township = budget.townshipId?.townshipName || "________";
  const county = budget.townshipId?.county || "________";
  const { startDate, endDate } = getFiscalDates(budget.fiscalYear);

  /* ================= CALCULATIONS ================= */

  const beginningBalance = Number(
    budget.entries?.__meta?.beginningBalance || 0
  );

  const totalRevenues = sumRevenues(budget.entries, budget.funds);
  const totalExpenditures = sumExpenditures(budget.entries, budget.funds);

  const endingBalance =
    beginningBalance + totalRevenues - totalExpenditures;

  /* ================= HEADER ================= */

  page.drawText(`${township} Road District`, {
    x: LEFT,
    y,
    size: 13,
    font: bold
  });

  y -= 20;

  page.drawText("Final Budget", {
    x: LEFT,
    y,
    size: 12,
    font: bold
  });

  y -= 20;

  page.drawText(`For the Year Ended ${endDate}`, {
    x: LEFT,
    y,
    size: 11,
    font
  });

  y -= 40;

  /* ================= SUMMARY TABLE ================= */

  page.drawText("Fund Beginning Balance", {
    x: LEFT,
    y,
    size: 11,
    font
  });

  page.drawText(formatMoney(beginningBalance), {
    x: RIGHT,
    y,
    size: 11,
    font,
    align: "right"
  });

  y -= 20;

  page.drawText("Total Fund Revenues", {
    x: LEFT,
    y,
    size: 11,
    font
  });

  page.drawText(formatMoney(totalRevenues), {
    x: RIGHT,
    y,
    size: 11,
    font,
    align: "right"
  });

  y -= 20;

  page.drawText("Total Fund Expenditures", {
    x: LEFT,
    y,
    size: 11,
    font
  });

  page.drawText(formatMoney(totalExpenditures), {
    x: RIGHT,
    y,
    size: 11,
    font,
    align: "right"
  });

  y -= 25;

  // underline
  page.drawLine({
    start: { x: LEFT, y: y + 8 },
    end: { x: RIGHT, y: y + 8 },
    thickness: 0.8
  });

  page.drawText("Fund Ending Balance", {
    x: LEFT,
    y,
    size: 11,
    font: bold
  });

  page.drawText(formatMoney(endingBalance), {
    x: RIGHT,
    y,
    size: 11,
    font: bold,
    align: "right"
  });

  y -= 50;

  /* ================= SECTIONS 6 & 7 ================= */

  page.drawText(
    "SECTION 6: That Section 3 shall be and is a summary of the annual Appropriation Ordinance of this Road District, passed by the Board of Trustees as required by law and shall be in full force and effect from and after this date.",
    {
      x: LEFT,
      y,
      size: 11,
      font,
      maxWidth: 455,
      lineHeight: 14
    }
  );

  y -= 60;

  page.drawText(
    "SECTION 7: That a certified copy of the Budget and Appropriation Ordinance shall be filed with the County Clerk within 30 days after adoption.",
    {
      x: LEFT,
      y,
      size: 11,
      font,
      maxWidth: 455,
      lineHeight: 14
    }
  );

  /* ================= FOOTER ================= */

  page.drawText("RD-FINAL", {
    x: 295,
    y: 40,
    size: 9,
    font
  });

  return await pdfDoc.save();
}
