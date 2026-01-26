import { PDFDocument, StandardFonts } from "pdf-lib";
import { getPriorAndCurrentYearLabels } from "../utils/fiscalYearLabels";

/* ================= HELPERS ================= */

function calculateTotalExpenditures(fundData) {
  let prior = 0;
  let current = 0;

  if (!fundData) return { prior: 0, current: 0 };

  Object.entries(fundData).forEach(([sectionKey, sectionVal]) => {
    if (sectionKey === "Revenues" || sectionKey === "__meta") return;

    Object.values(sectionVal || {}).forEach(category => {
      Object.values(category || {}).forEach(acc => {
        prior += Number(acc?.lastYear || 0);
        current += Number(acc?.budget || 0);
      });
    });
  });

  return { prior, current };
}
function getFiscalDates(fiscalYear) {
  if (!fiscalYear) {
    return {
      startDate: "__________",
      endDate: "__________"
    };
  }

  // CASE 1: Custom FY (YYYY-MM-DD – YYYY-MM-DD)
  const customMatch = fiscalYear.match(
    /Custom FY\s*\((\d{4}-\d{2}-\d{2})\s*[–-]\s*(\d{4}-\d{2}-\d{2})\)/
  );

  if (customMatch) {
    return {
      startDate: customMatch[1],
      endDate: customMatch[2]
    };
  }

  // CASE 2: Township FY (YYYY-YYYY)
  const years = fiscalYear.match(/\d{4}/g);
  if (years && years.length >= 2) {
    return {
      startDate: `April 1, ${years[0]}`,
      endDate: `March 31, ${years[1]}`
    };
  }

  // CASE 3: Current Year (YYYY)
  if (/^\d{4}$/.test(fiscalYear)) {
    return {
      startDate: `January 1, ${fiscalYear}`,
      endDate: `December 31, ${fiscalYear}`
    };
  }

  return {
    startDate: "__________",
    endDate: "__________"
  };
}
/* ================= PAGE ================= */

export async function createAppropriationsSummaryPage(budget) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]);
  const { startDate, endDate } = getFiscalDates(budget?.fiscalYear);
  const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const bold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  const { priorLabel, currentLabel } =
    getPriorAndCurrentYearLabels(budget?.fiscalYear);
  const LEFT = 70;
  const RIGHT = 525;
  const LABEL_X = LEFT + 25;
  const PRIOR_X = RIGHT - 160;
  const CURRENT_X = RIGHT - 60;
  const OFFSET = 18;

  let y = 740;

  /* ================= SECTION 3 ================= */

  page.drawText(
    "SECTION 3: That the amount appropriated for town purposes for the fiscal year beginning",
    { x: LEFT, y, size: 11, font }
  );

  y -= 18;

  page.drawText(
    `   ${startDate}    and ending    ${endDate}     and ending by fund shall be as follows:`,
    { x: LEFT, y, size: 11, font }
  );

  // underline date sentence
  page.drawLine({
    start: { x: LEFT + 1, y: y - 5 },
    end: { x: LEFT + 58, y: y - 5 },

    thickness: 0.8
  });
  page.drawLine({
    start: { x: LEFT + 120, y: y - 5 },
    end: { x: LEFT + 183, y: y - 5 },

    thickness: 0.8
  });

  y -= 40;

  /* ================= COLUMN HEADERS ================= */

  page.drawText(priorLabel, {
    x: PRIOR_X - -10,
    y: y + 12,
    size: 9,
    font: bold
  });

  page.drawText("Budgeted", {
    x: PRIOR_X - -10,
    y,
    size: 9,
    font
  });

  page.drawLine({
    start: { x: PRIOR_X - -10, y: y - 2 },
    end: { x: PRIOR_X + 45, y: y - 2 },
    thickness: 0.8
  });

  page.drawText(currentLabel, {
    x: CURRENT_X - -10,
    y: y + 12,
    size: 9,
    font: bold
  });

  page.drawText("Budgeted", {
    x: CURRENT_X - -10,
    y,
    size: 9,
    font
  });

  page.drawLine({
    start: { x: CURRENT_X - -10, y: y - 2 },
    end: { x: CURRENT_X + 45, y: y - 2 },
    thickness: 0.8
  });



  y -= 30;

  /* ================= FUND TOTALS ================= */

  const gt = calculateTotalExpenditures(budget.entries?.generalTown);
  const imrf = calculateTotalExpenditures(budget.entries?.retirement);
  const ga = calculateTotalExpenditures(budget.entries?.generalAssistance);

  const rows = [
    { label: "100   General Town Fund", ...gt },
    { label: "300   Illinois Municipal Retirement Fund (IMRF)", ...imrf },
    { label: "200   General Assistance Fund", ...ga }
  ];

  let totalPrior = 0;
  let totalCurrent = 0;

  rows.forEach(r => {
    page.drawText(r.label, { x: LABEL_X, y, size: 10, font });

    page.drawText("$", { x: PRIOR_X, y, size: 10, font });
    page.drawText(r.prior.toLocaleString(), {
      x: PRIOR_X + OFFSET,
      y,
      size: 10,
      font
    });

    page.drawText("$", { x: CURRENT_X, y, size: 10, font });
    page.drawText(r.current.toLocaleString(), {
      x: CURRENT_X + OFFSET,
      y,
      size: 10,
      font
    });

    totalPrior += r.prior;
    totalCurrent += r.current;
    y -= 22;
  });

  /* ================= TOTAL APPROPRIATIONS ================= */

  y -= 10;

  page.drawText("TOTAL APPROPRIATIONS:", {
    x: LABEL_X,
    y,
    size: 11,
    font: bold
  });

  page.drawText("$", { x: PRIOR_X, y, size: 11, font: bold });
  page.drawText(totalPrior.toLocaleString(), {
    x: PRIOR_X + OFFSET,
    y,
    size: 11,
    font: bold
  });

  page.drawText("$", { x: CURRENT_X, y, size: 11, font: bold });
  page.drawText(totalCurrent.toLocaleString(), {
    x: CURRENT_X + OFFSET,
    y,
    size: 11,
    font: bold
  });

  y -= 40;

  /* ================= SECTION 4 ================= */

  page.drawText(
    "SECTION 4: That if any section, subdivision, or sentence of this ordinance shall for any reason",
    { x: LEFT, y, size: 11, font }
  );

  y -= 18;

  page.drawText(
    "be held invalid or to be unconstitutional, such decision shall not affect the validity of the remaining",
    { x: LEFT, y, size: 11, font }
  );

  y -= 18;

  page.drawText(
    "portion of this ordinance.",
    { x: LEFT, y, size: 11, font }
  );

  y -= 40;

  /* ================= SECTION 5 ================= */

  page.drawText(
    "SECTION 5: That each appropriated fund total shall be divided among the several objects and",
    { x: LEFT, y, size: 11, font }
  );

  y -= 18;

  page.drawText(
    "purposes specified, and in the particular amounts stated for each fund respectively in Section 2,",
    { x: LEFT, y, size: 11, font }
  );

  y -= 18;

  page.drawText(
    "constituting the total appropriations in the amount of Three Million Three Hundred",
    { x: LEFT, y, size: 11, font }
  );

  y -= 18;

  page.drawText(
    "Fifteen Thousand Five Hundred Forty Four dollars & 00/100 cents.",
    { x: LEFT, y, size: 11, font }
  );

  // underline words
  page.drawLine({
    start: { x: LEFT + 260, y: y - 2 },
    end: { x: RIGHT, y: y - 2 },
    thickness: 0.8
  });

  y -= 22;

  page.drawText(
    `($3,315,544.00) for the fiscal year beginning ${startDate} and ending ${endDate}.`,
    { x: LEFT, y, size: 11, font }
  );

  // underline amount
  page.drawLine({
    start: { x: LEFT, y: y - 2 },
    end: { x: RIGHT, y: y - 2 },
    thickness: 0.8
  });

  /* ================= FOOTER ================= */

  page.drawText("2-10", {
    x: 295,
    y: 40,
    size: 9,
    font
  });

  return await pdfDoc.save();
}
