import { PDFDocument, StandardFonts } from "pdf-lib";
import { getPriorAndCurrentYearLabels } from "../utils/fiscalYearLabels";

function getTownshipFYDates(fiscalYear) {
  const years = fiscalYear?.match(/\d{4}/g);

  if (!years || years.length < 2) {
    return {
      beginDate: "",
      endDate: ""
    };
  }

  return {
    beginDate: `April 1, ${years[0]}`,
    endDate: `March 31, ${years[1]}`
  };
}

export async function createGeneralTownPage(budget) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4

  const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const { beginDate, endDate } = getTownshipFYDates(budget?.fiscalYear);
  const { priorLabel, currentLabel } =
    getPriorAndCurrentYearLabels(budget?.fiscalYear);

  const bold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  const drawAmountRightAligned = (page, value, xRight, y, size, font) => {
    const text = value.toLocaleString();
    const width = font.widthOfTextAtSize(text, size);

    page.drawText(text, {
      x: xRight - width,
      y,
      size,
      font
    });
  };

  /* ===== LAYOUT CONSTANTS ===== */
  const LEFT = 70;
  const RIGHT = 525;
  const TOP = 740;

  // Column X positions (LOCK THESE)
  const LABEL_X = LEFT + 25;
  const DATE_X = LEFT + 185;
  const PRIOR_X = RIGHT - 160;
  const CURRENT_X = RIGHT - 60;
  // Dollar alignment
  const DOLLAR_PRIOR_X = PRIOR_X;
  const AMOUNT_PRIOR_X = PRIOR_X + 18;

  const DOLLAR_CURRENT_X = CURRENT_X;
  const AMOUNT_CURRENT_X = CURRENT_X + 18;

  let y = TOP;
  const TOTAL_LABEL_X = LABEL_X + 40;
  /* =====================================================
     STEP 1 — HEADER (UNCHANGED)
  ===================================================== */

  page.drawText("10", {
    x: LEFT,
    y,
    size: 11,
    font: bold
  });

  page.drawText("GENERAL TOWN FUND", {
    x: LABEL_X,
    y,
    size: 11,
    font: bold
  });

  // Underline under fund title
  page.drawLine({
    start: { x: LEFT + 25, y: TOP - 2 },
    end: { x: LEFT + 150, y: TOP - 2 },
    thickness: 1
  });

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

  /* =====================================================
     STEP 2 — BEGINNING BALANCE
  ===================================================== */

  y -= 40;

  page.drawText("BEGINNING BALANCE", {
    x: LABEL_X,
    y,
    size: 10,
    font: bold
  });

  page.drawText(beginDate, {
    x: DATE_X,
    y,
    size: 10,
    font
  });


  const meta = budget?.entries?.__meta || {};
  const priorBal = meta.beginningBalanceLastYear ?? 0;
  const currentBal = meta.beginningBalance ?? 0;

  // Prior Year $
  page.drawText("$", {
    x: DOLLAR_PRIOR_X,
    y,
    size: 10,
    font
  });

  // Prior Year amount
  page.drawText(Number(priorBal).toLocaleString(), {
    x: AMOUNT_PRIOR_X,
    y,
    size: 10,
    font
  });

  // Current Year $
  page.drawText("$", {
    x: DOLLAR_CURRENT_X,
    y,
    size: 10,
    font
  });

  // Current Year amount
  page.drawText(Number(currentBal).toLocaleString(), {
    x: AMOUNT_CURRENT_X,
    y,
    size: 10,
    font
  });

  /* =====================================================
     STEP 3 — REVENUES
  ===================================================== */

  y -= 30;

  page.drawText("REVENUES", {
    x: LABEL_X,
    y,
    size: 10,
    font: bold
  });

  y -= 20;

  const revenues =
    budget?.entries?.generalTown?.Revenues?.accounts || {};

  let totalPriorRevenue = 0;
  let totalCurrentRevenue = 0;

  Object.entries(revenues).forEach(([name, acc]) => {
    const prior = Number(acc?.lastYear || 0);
    const current = Number(acc?.budget || 0);

    if (prior === 0 && current === 0) return;

    page.drawText(name.toUpperCase(), {
      x: LABEL_X + 20,
      y,
      size: 9,
      font
    });

    page.drawText("$", { x: DOLLAR_PRIOR_X, y, size: 9, font });
    page.drawText(prior.toLocaleString(), {
      x: AMOUNT_PRIOR_X,
      y,
      size: 9,
      font
    });

    page.drawText("$", { x: DOLLAR_CURRENT_X, y, size: 9, font });
    page.drawText(current.toLocaleString(), {
      x: AMOUNT_CURRENT_X,
      y,
      size: 9,
      font
    });

    totalPriorRevenue += prior;
    totalCurrentRevenue += current;

    y -= 18;
  });

  /* ===== TOTAL REVENUES ===== */

  y -= 6;

  page.drawText("TOTAL REVENUES:", {
    x: TOTAL_LABEL_X,
    y,
    size: 9,
    font: bold
  });

  page.drawText("$", { x: DOLLAR_PRIOR_X, y, size: 9, font: bold });
  page.drawText(totalPriorRevenue.toLocaleString(), {
    x: AMOUNT_PRIOR_X,
    y,
    size: 9,
    font: bold
  });

  page.drawText("$", { x: DOLLAR_CURRENT_X, y, size: 9, font: bold });
  page.drawText(totalCurrentRevenue.toLocaleString(), {
    x: AMOUNT_CURRENT_X,
    y,
    size: 9,
    font: bold
  });

  // Total Funds Available
  const totalFundsPrior =
    Number(priorBal) + Number(totalPriorRevenue);

  const totalFundsCurrent =
    Number(currentBal) + Number(totalCurrentRevenue);
  y -= 22;

  page.drawText("TOTAL FUNDS AVAILABLE:", {
    x: TOTAL_LABEL_X,
    y,
    size: 9,
    font: bold
  });

  // Prior Year $
  page.drawText("$", {
    x: DOLLAR_PRIOR_X,
    y,
    size: 9,
    font: bold
  });

  page.drawText(totalFundsPrior.toLocaleString(), {
    x: AMOUNT_PRIOR_X,
    y,
    size: 9,
    font: bold
  });

  // Current Year $
  page.drawText("$", {
    x: DOLLAR_CURRENT_X,
    y,
    size: 9,
    font: bold
  });

  page.drawText(totalFundsCurrent.toLocaleString(), {
    x: AMOUNT_CURRENT_X,
    y,
    size: 9,
    font: bold
  });


  /* =====================================================
     STEP 4 — EXPENDITURES
  ===================================================== */

  y -= 30;

  page.drawText("EXPENDITURES", {
    x: LABEL_X,
    y,
    size: 10,
    font: bold
  });

  y -= 20;

  const departments = budget?.entries?.generalTown || {};

  let totalPriorExp = 0;
  let totalCurrentExp = 0;

  Object.entries(departments).forEach(([deptKey, deptVal]) => {
    if (deptKey === "Revenues" || deptKey === "__meta") return;

    let deptPrior = 0;
    let deptCurrent = 0;

    // Check if department has any values
    Object.values(deptVal || {}).forEach((category) => {
      Object.values(category || {}).forEach((acc) => {
        deptPrior += Number(acc?.lastYear || 0);
        deptCurrent += Number(acc?.budget || 0);
      });
    });

    if (deptPrior === 0 && deptCurrent === 0) return;

    // Department label
    page.drawText(deptKey.toUpperCase(), {
      x: LABEL_X + 20,
      y,
      size: 9,
      font
    });

    // Prior Year $
    page.drawText("$", {
      x: DOLLAR_PRIOR_X,
      y,
      size: 9,
      font
    });

    page.drawText(deptPrior.toLocaleString(), {
      x: AMOUNT_PRIOR_X,
      y,
      size: 9,
      font
    });

    // Current Year $
    page.drawText("$", {
      x: DOLLAR_CURRENT_X,
      y,
      size: 9,
      font
    });

    page.drawText(deptCurrent.toLocaleString(), {
      x: AMOUNT_CURRENT_X,
      y,
      size: 9,
      font
    });

    totalPriorExp += deptPrior;
    totalCurrentExp += deptCurrent;

    y -= 18;
  });




  /* =====================================================
     STEP 5 — TOTAL EXPENDITURES
  ===================================================== */



  

  y -= 8;

  page.drawText("TOTAL EXPENDITURES:", {
    x: TOTAL_LABEL_X,
    y,
    size: 10,
    font: bold
  });

  // Prior Year $
  page.drawText("$", {
    x: DOLLAR_PRIOR_X,
    y,
    size: 10,
    font: bold
  });

  page.drawText(totalPriorExp.toLocaleString(), {
    x: AMOUNT_PRIOR_X,
    y,
    size: 10,
    font: bold
  });

  // Current Year $
  page.drawText("$", {
    x: DOLLAR_CURRENT_X,
    y,
    size: 10,
    font: bold
  });

  page.drawText(totalCurrentExp.toLocaleString(), {
    x: AMOUNT_CURRENT_X,
    y,
    size: 10,
    font: bold
  });

  y -= 24;
  // Total Appropriations


  page.drawText("TOTAL APPROPRIATIONS:", {
    x: TOTAL_LABEL_X,
    y,
    size: 10,
    font: bold
  });

  // Prior Year $
  page.drawText("$", {
    x: DOLLAR_PRIOR_X,
    y,
    size: 10,
    font: bold
  });

  page.drawText(totalPriorExp.toLocaleString(), {
    x: AMOUNT_PRIOR_X,
    y,
    size: 10,
    font: bold
  });

  // Current Year $
  page.drawText("$", {
    x: DOLLAR_CURRENT_X,
    y,
    size: 10,
    font: bold
  });

  page.drawText(totalCurrentExp.toLocaleString(), {
    x: AMOUNT_CURRENT_X,
    y,
    size: 10,
    font: bold
  });

  /* =====================================================
     STEP 6 — ENDING BALANCE
  ===================================================== */

  const endingPrior =
    Number(priorBal || 0) +
    Number(totalPriorRevenue || 0) -
    Number(totalPriorExp || 0);

  const endingCurrent =
    Number(currentBal || 0) +
    Number(totalCurrentRevenue || 0) -
    Number(totalCurrentExp || 0);

  y -= 10;

  y -= 16;

  page.drawText("ENDING BALANCE", {
    x: LABEL_X,
    y,
    size: 10,
    font: bold
  });
  page.drawText(endDate, {
    x: DATE_X,
    y,
    size: 10,
    font
  });

  // Prior Year $
  page.drawText("$", {
    x: DOLLAR_PRIOR_X,
    y,
    size: 10,
    font: bold
  });

  page.drawText(endingPrior.toLocaleString(), {
    x: AMOUNT_PRIOR_X,
    y,
    size: 10,
    font: bold
  });

  // Current Year $
  page.drawText("$", {
    x: DOLLAR_CURRENT_X,
    y,
    size: 10,
    font: bold
  });

  page.drawText(endingCurrent.toLocaleString(), {
    x: AMOUNT_CURRENT_X,
    y,
    size: 10,
    font: bold
  });

  y -= 26;





  
  /* ===== FOOTER ===== */
  page.drawText("2-2", {
    x: 295,
    y: 40,
    size: 9,
    font
  });

  return await pdfDoc.save();
}
