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
export async function createIMRFPage(budget) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4
  const { priorLabel, currentLabel } =
    getPriorAndCurrentYearLabels(budget?.fiscalYear);
  const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const bold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  const { beginDate, endDate } = getTownshipFYDates(budget?.fiscalYear);
  /* ===== LAYOUT ===== */
  const LEFT = 70;
  const RIGHT = 525;
  const TOP = 740;

  const LABEL_X = LEFT + 25;
  const DATE_X = LEFT + 185;

  const PRIOR_X = RIGHT - 160;
  const CURRENT_X = RIGHT - 60;

  const DOLLAR_PRIOR_X = PRIOR_X;
  const AMOUNT_PRIOR_X = PRIOR_X + 18;

  const DOLLAR_CURRENT_X = CURRENT_X;
  const AMOUNT_CURRENT_X = CURRENT_X + 18;

  let y = TOP;

  /* ================= HEADER ================= */

  page.drawText("300", {
    x: LEFT,
    y,
    size: 11,
    font: bold
  });

  page.drawText("ILLINOIS MUNICIPAL RETIREMENT FUND", {
    x: LABEL_X,
    y,
    size: 11,
    font: bold
  });

  page.drawLine({
    start: { x: LABEL_X, y: y - 2 },
    end: { x: LABEL_X + 230, y: y - 2 },
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


  /* ================= BEGINNING BALANCE ================= */

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
  const priorBal = Number(meta.beginningBalanceLastYear || 0);
  const currentBal = Number(meta.beginningBalance || 0);

  page.drawText("$", { x: DOLLAR_PRIOR_X, y, size: 10, font });
  page.drawText(priorBal.toLocaleString(), {
    x: AMOUNT_PRIOR_X,
    y,
    size: 10,
    font
  });

  page.drawText("$", { x: DOLLAR_CURRENT_X, y, size: 10, font });
  page.drawText(currentBal.toLocaleString(), {
    x: AMOUNT_CURRENT_X,
    y,
    size: 10,
    font
  });

  /* ================= REVENUES ================= */

  y -= 30;

  page.drawText("REVENUES", {
    x: LABEL_X,
    y,
    size: 10,
    font: bold
  });

  y -= 20;

  const revenues =
    budget?.entries?.retirement?.Revenues?.accounts || {};

  let totalPriorRevenue = 0;
  let totalCurrentRevenue = 0;

  Object.entries(revenues).forEach(([name, acc]) => {
    const prior = Number(acc?.lastYear || 0);
    const current = Number(acc?.budget || 0);

    if (prior === 0 && current === 0) return;

    page.drawText(name, {
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
    x: LABEL_X + 20,
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

  /* ================= EXPENDITURES ================= */

  y -= 30;

  page.drawText("EXPENDITURES", {
    x: LABEL_X,
    y,
    size: 10,
    font: bold
  });

  y -= 20;

  const personnel =
    budget?.entries?.retirement?.Expenditures?.Personnel || {};

  let totalPriorExp = 0;
  let totalCurrentExp = 0;

  Object.entries(personnel).forEach(([name, acc]) => {
    const prior = Number(acc?.lastYear || 0);
    const current = Number(acc?.budget || 0);

    if (prior === 0 && current === 0) return;

    page.drawText(name, {
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

    totalPriorExp += prior;
    totalCurrentExp += current;

    y -= 18;
  });

  /* ================= ENDING BALANCE ================= */

  const endingPrior =
    priorBal + totalPriorRevenue - totalPriorExp;

  const endingCurrent =
    currentBal + totalCurrentRevenue - totalCurrentExp;

  y -= 20;

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


  page.drawText("$", { x: DOLLAR_PRIOR_X, y, size: 10, font });
  page.drawText(endingPrior.toLocaleString(), {
    x: AMOUNT_PRIOR_X,
    y,
    size: 10,
    font
  });

  page.drawText("$", { x: DOLLAR_CURRENT_X, y, size: 10, font });
  page.drawText(endingCurrent.toLocaleString(), {
    x: AMOUNT_CURRENT_X,
    y,
    size: 10,
    font
  });

  /* ================= FOOTER ================= */



  return await pdfDoc.save();
}
