import { PDFDocument, StandardFonts } from "pdf-lib";
import { getPriorAndCurrentYearLabels } from "../utils/fiscalYearLabels";
function formatMoney(value) {
  const n = Number(value || 0);
  if (n < 0) return `(${Math.abs(n).toLocaleString()})`;
  return n.toLocaleString();
}
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
export async function createGeneralAssistancePage(budget) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]);
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

  /* =====================================================
     HEADER
  ===================================================== */

  page.drawText("200", { x: LEFT, y, size: 11, font: bold });
  page.drawText("GENERAL ASSISTANCE FUND", {
    x: LABEL_X,
    y,
    size: 11,
    font: bold
  });

  page.drawLine({
    start: { x: LABEL_X, y: y - 2 },
    end: { x: LABEL_X + 160, y: y - 2 },
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
     BEGINNING BALANCE
  ===================================================== */

  y -= 40;

  const meta = budget?.entries?.__meta || {};
  const priorBegin = meta.beginningBalanceLastYear || 0;
  const currentBegin = meta.beginningBalance || 0;

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

  page.drawText("$", { x: DOLLAR_PRIOR_X, y, size: 9, font });
  page.drawText(formatMoney(priorBegin), {
    x: AMOUNT_PRIOR_X,
    y,
    size: 9,
    font
  });

  page.drawText("$", { x: DOLLAR_CURRENT_X, y, size: 9, font });
  page.drawText(formatMoney(currentBegin), {
    x: AMOUNT_CURRENT_X,
    y,
    size: 9,
    font
  });

  /* =====================================================
     REVENUES
  ===================================================== */

  y -= 30;
  page.drawText("REVENUES", { x: LABEL_X, y, size: 10, font: bold });
  y -= 20;

  const revenues =
    budget?.entries?.generalAssistance?.Revenues?.accounts || {};

  let totalPriorRev = 0;
  let totalCurrentRev = 0;

  Object.entries(revenues).forEach(([name, acc]) => {
    const p = Number(acc?.lastYear || 0);
    const c = Number(acc?.budget || 0);
    if (p === 0 && c === 0) return;

    page.drawText(name, { x: LABEL_X + 20, y, size: 9, font });

    page.drawText("$", { x: DOLLAR_PRIOR_X, y, size: 9, font });
    page.drawText(formatMoney(p), { x: AMOUNT_PRIOR_X, y, size: 9, font });

    page.drawText("$", { x: DOLLAR_CURRENT_X, y, size: 9, font });
    page.drawText(formatMoney(c), {
      x: AMOUNT_CURRENT_X,
      y,
      size: 9,
      font
    });

    totalPriorRev += p;
    totalCurrentRev += c;
    y -= 16;
  });

  /* TOTAL REVENUES */
  y -= 8;
  page.drawText("TOTAL REVENUES", {
    x: LABEL_X + 20,
    y,
    size: 9,
    font: bold
  });

  page.drawText("$", { x: DOLLAR_PRIOR_X, y, size: 9, font: bold });
  page.drawText(formatMoney(totalPriorRev), {
    x: AMOUNT_PRIOR_X,
    y,
    size: 9,
    font: bold
  });

  page.drawText("$", { x: DOLLAR_CURRENT_X, y, size: 9, font: bold });
  page.drawText(formatMoney(totalCurrentRev), {
    x: AMOUNT_CURRENT_X,
    y,
    size: 9,
    font: bold
  });

  /* TOTAL FUNDS AVAILABLE */
  y -= 24;
  const totalFundsPrior = priorBegin + totalPriorRev;
  const totalFundsCurrent = currentBegin + totalCurrentRev;

  page.drawText("TOTAL FUNDS AVAILABLE", {
    x: LABEL_X + 20,
    y,
    size: 9,
    font: bold
  });

  page.drawText("$", { x: DOLLAR_PRIOR_X, y, size: 9, font: bold });
  page.drawText(formatMoney(totalFundsPrior), {
    x: AMOUNT_PRIOR_X,
    y,
    size: 9,
    font: bold
  });

  page.drawText("$", { x: DOLLAR_CURRENT_X, y, size: 9, font: bold });
  page.drawText(formatMoney(totalFundsCurrent), {
    x: AMOUNT_CURRENT_X,
    y,
    size: 9,
    font: bold
  });

  /* =====================================================
     EXPENDITURES
  ===================================================== */

  y -= 30;
  page.drawText("EXPENDITURES", { x: LABEL_X, y, size: 10, font: bold });
  y -= 20;

  const exp = budget?.entries?.generalAssistance || {};
  let totalPriorExp = 0;
  let totalCurrentExp = 0;

  Object.entries(exp).forEach(([key, data]) => {
    if (key === "Revenues" || key === "__meta") return;

    let p = 0;
    let c = 0;

    Object.values(data || {}).forEach(cat =>
      Object.values(cat || {}).forEach(acc => {
        p += Number(acc?.lastYear || 0);
        c += Number(acc?.budget || 0);
      })
    );

    if (p === 0 && c === 0) return;

    page.drawText(key, { x: LABEL_X + 20, y, size: 9, font });

    page.drawText("$", { x: DOLLAR_PRIOR_X, y, size: 9, font });
    page.drawText(formatMoney(p), { x: AMOUNT_PRIOR_X, y, size: 9, font });

    page.drawText("$", { x: DOLLAR_CURRENT_X, y, size: 9, font });
    page.drawText(formatMoney(c), {
      x: AMOUNT_CURRENT_X,
      y,
      size: 9,
      font
    });

    totalPriorExp += p;
    totalCurrentExp += c;
    y -= 16;
  });

  /* TOTAL EXPENDITURES */
  y -= 10;
  page.drawText("TOTAL EXPENDITURES", {
    x: LABEL_X,
    y,
    size: 10,
    font: bold
  });

  page.drawText("$", { x: DOLLAR_PRIOR_X, y, size: 10, font: bold });
  page.drawText(formatMoney(totalPriorExp), {
    x: AMOUNT_PRIOR_X,
    y,
    size: 10,
    font: bold
  });

  page.drawText("$", { x: DOLLAR_CURRENT_X, y, size: 10, font: bold });
  page.drawText(formatMoney(totalCurrentExp), {
    x: AMOUNT_CURRENT_X,
    y,
    size: 10,
    font: bold
  });

  /* TOTAL APPROPRIATIONS */
  y -= 24;
  page.drawText("TOTAL APPROPRIATIONS", {
    x: LABEL_X,
    y,
    size: 10,
    font: bold
  });

  page.drawText("$", { x: DOLLAR_PRIOR_X, y, size: 10, font: bold });
  page.drawText(formatMoney(totalPriorExp), {
    x: AMOUNT_PRIOR_X,
    y,
    size: 10,
    font: bold
  });

  page.drawText("$", { x: DOLLAR_CURRENT_X, y, size: 10, font: bold });
  page.drawText(formatMoney(totalCurrentExp), {
    x: AMOUNT_CURRENT_X,
    y,
    size: 10,
    font: bold
  });

  /* ENDING BALANCE */
  y -= 26;
  const endingPrior = totalFundsPrior - totalPriorExp;
  const endingCurrent = totalFundsCurrent - totalCurrentExp;

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


  page.drawText("$", { x: DOLLAR_PRIOR_X, y, size: 9, font });
  page.drawText(formatMoney(endingPrior), {
    x: AMOUNT_PRIOR_X,
    y,
    size: 9,
    font
  });

  page.drawText("$", { x: DOLLAR_CURRENT_X, y, size: 9, font });
  page.drawText(formatMoney(endingCurrent), {
    x: AMOUNT_CURRENT_X,
    y,
    size: 9,
    font
  });

  /* FOOTER */
  page.drawText("2-6", { x: 295, y: 40, size: 9, font });

  return await pdfDoc.save();
}
