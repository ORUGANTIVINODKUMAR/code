import { PDFDocument, StandardFonts } from "pdf-lib";
import { getPriorAndCurrentYearLabels } from "../utils/fiscalYearLabels";

/* ================= HELPERS ================= */

function getTownshipFYDates(fiscalYear) {
  const years = fiscalYear?.match(/\d{4}/g);
  if (!years || years.length < 2) {
    return { beginDate: "", endDate: "" };
  }

  return {
    beginDate: `April 1, ${years[0]}`,
    endDate: `March 31, ${years[1]}`
  };
}
function formatMoney(value) {
  const num = Number(value) || 0;
  const abs = Math.abs(num).toLocaleString();
  return num < 0 ? `(${abs})` : abs;
}

/* ================= PAGE ================= */

export async function createRoadBridgePage(budget, fundKey) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]);

  const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const bold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

  const { beginDate, endDate } = getTownshipFYDates(budget.fiscalYear);
  const { priorLabel, currentLabel } =
    getPriorAndCurrentYearLabels(budget.fiscalYear);

  /* ===== LAYOUT ===== */
  const LEFT = 70;
  const RIGHT = 525;
  const LABEL_X = LEFT + 25;
  const DATE_X = LEFT + 185;
  const PRIOR_X = RIGHT - 160;
  const CURRENT_X = RIGHT - 60;

  const DOLLAR_PRIOR_X = PRIOR_X;
  const AMOUNT_PRIOR_X = PRIOR_X + 18;
  const DOLLAR_CURRENT_X = CURRENT_X;
  const AMOUNT_CURRENT_X = CURRENT_X + 18;

  const TOTAL_LABEL_X = LABEL_X + 40;
  let y = 740;

  /* ================= HEADER ================= */

  page.drawText("20", { x: LEFT, y, size: 11, font: bold });
  page.drawText("ROAD & BRIDGE FUND", {
    x: LABEL_X,
    y,
    size: 11,
    font: bold
  });

  page.drawLine({
    start: { x: LABEL_X, y: y - 2 },
    end: { x: LABEL_X + 124, y: y - 2 },
    thickness: 1
  });

  /* ================= COLUMN HEADERS ================= */

  page.drawText(priorLabel, {
    x: PRIOR_X + 10,
    y: y + 12,
    size: 9,
    font: bold
  });
  page.drawText("Budgeted", {
    x: PRIOR_X + 10,
    y,
    size: 9,
    font
  });

  page.drawText(currentLabel, {
    x: CURRENT_X + 10,
    y: y + 12,
    size: 9,
    font: bold
  });
  page.drawText("Budgeted", {
    x: CURRENT_X + 10,
    y,
    size: 9,
    font
  });

  /* ================= BEGINNING BALANCE ================= */


  page.drawText(beginDate, { x: DATE_X, y, size: 10, font });

  const meta = budget.entries.__meta || {};
  const priorBal = Number(meta.beginningBalanceLastYear || 0);
  const currentBal = Number(meta.beginningBalance || 0);




  /* ================= REVENUES ================= */

  y -= 30;
  page.drawText("REVENUES", { x: LABEL_X, y, size: 10, font: bold });
  y -= 20;

  const revenues =
    budget.entries?.[fundKey]?.Revenues?.accounts || {};

  let totalPriorRevenue = 0;
  let totalCurrentRevenue = 0;

  Object.entries(revenues).forEach(([name, acc]) => {
    const prior = Number(acc.lastYear || 0);
    const current = Number(acc.budget || 0);
    if (!prior && !current) return;

    page.drawText(name.toUpperCase(), {
      x: LABEL_X + 20,
      y,
      size: 9,
      font
    });

    page.drawText("$", { x: DOLLAR_PRIOR_X, y, size: 9, font });
    page.drawText(formatMoney(prior), {
      x: AMOUNT_PRIOR_X,
      y,
      size: 9,
      font
    });

    page.drawText("$", { x: DOLLAR_CURRENT_X, y, size: 9, font });
    page.drawText(formatMoney(current), {
      x: AMOUNT_CURRENT_X,
      y,
      size: 9,
      font
    });

    totalPriorRevenue += prior;
    totalCurrentRevenue += current;
    y -= 15;
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
  page.drawText(formatMoney(totalPriorRevenue), {
    x: AMOUNT_PRIOR_X,
    y,
    size: 9,
    font: bold
  });

  page.drawText("$", { x: DOLLAR_CURRENT_X, y, size: 9, font: bold });
  page.drawText(formatMoney(totalCurrentRevenue), {
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

  const departments = budget.entries?.[fundKey] || {};
  let totalPriorExp = 0;
  let totalCurrentExp = 0;

  Object.entries(departments).forEach(([deptKey, deptVal]) => {
    if (deptKey === "Revenues" || deptKey === "__meta") return;

    let deptPrior = 0;
    let deptCurrent = 0;

    page.drawText(deptKey.toUpperCase(), {
      x: LABEL_X + 20,
      y,
      size: 9,
      font
    });

    y -= 16;

    Object.entries(deptVal || {}).forEach(([catKey, catVal]) => {
      Object.entries(catVal || {}).forEach(([accName, acc]) => {
        const prior = Number(acc.lastYear || 0);
        const current = Number(acc.budget || 0);
        if (!prior && !current) return;

        // Account name
        page.drawText(accName, {
          x: LABEL_X + 40,
          y,
          size: 9,
          font
        });

        // Prior year
        page.drawText("$", { x: DOLLAR_PRIOR_X, y, size: 9, font });
        page.drawText(formatMoney(prior), {
          x: AMOUNT_PRIOR_X,
          y,
          size: 9,
          font
        });

        // Current year
        page.drawText("$", { x: DOLLAR_CURRENT_X, y, size: 9, font });
        page.drawText(formatMoney(current), {
          x: AMOUNT_CURRENT_X,
          y,
          size: 9,
          font
        });

        deptPrior += prior;
        deptCurrent += current;
        y -= 16;
      });
    });


    if (!deptPrior && !deptCurrent) return;

    page.drawText(deptKey.toUpperCase(), {
      x: LABEL_X + 20,
      y,
      size: 9,
      font
    });

    page.drawText("$", { x: DOLLAR_PRIOR_X, y, size: 9, font });
    page.drawText(formatMoney(currentBal), {


      x: AMOUNT_PRIOR_X,
      y,
      size: 9,
      font
    });

    page.drawText("$", { x: DOLLAR_CURRENT_X, y, size: 9, font });
    page.drawText(formatMoney(deptCurrent), {
      x: AMOUNT_CURRENT_X,
      y,
      size: 9,
      font
    });

    totalPriorExp += deptPrior;
    totalCurrentExp += deptCurrent;
    y -= 15;
  });

  /* ================= TOTAL EXPENDITURES ================= */

  y -= 8;
  page.drawText("TOTAL EXPENDITURES:", {
    x: TOTAL_LABEL_X,
    y,
    size: 9,
    font: bold
  });

  page.drawText("$", { x: DOLLAR_PRIOR_X, y, size: 9, font: bold });
  page.drawText(formatMoney(totalCurrentExp), {
    x: AMOUNT_PRIOR_X,
    y,
    size: 9,
    font: bold
  });

  page.drawText("$", { x: DOLLAR_CURRENT_X, y, size: 9, font: bold });
  page.drawText(formatMoney(totalCurrentRevenue), {
    x: AMOUNT_CURRENT_X,
    y,
    size: 9,
    font: bold
  });

  /* ================= ENDING BALANCE ================= */

  const endingPrior =
    priorBal + totalPriorRevenue - totalPriorExp;

  const endingCurrent =
    currentBal + totalCurrentRevenue - totalCurrentExp;


    /* ================= FUND SUMMARY ================= */

    y -= 30;

    // Fund Beginning Balance
    page.drawText("Fund Beginning Balance", {
      x: LABEL_X,
      y,
      size: 9,
      font
    });

    page.drawText(formatMoney(currentBal), {
      x: AMOUNT_CURRENT_X,
      y,
      size: 9,
      font
    });

    y -= 16;

    // Total Fund Revenues
    page.drawText("Total Fund Revenues", {
      x: LABEL_X+30,
      y,
      size: 9,
      font
    });

    page.drawText(formatMoney(totalCurrentRevenue), {
      x: AMOUNT_CURRENT_X,
      y,
      size: 9,
      font
    });

    y -= 16;

    // Total Fund Expenditures
    page.drawText("Total Fund Expenditures", {
      x: LABEL_X+30,
      y,
      size: 9,
      font
    });

    page.drawText(formatMoney(totalCurrentExp), {

      x: AMOUNT_CURRENT_X,
      y,
      size: 9,
      font
    });

    y -= 20;


    // Fund Ending Balance (summary)
    page.drawText("Fund Ending Balance", {
      x: LABEL_X,
      y,
      size: 9,
      font: bold
    });

    page.drawText(
      formatMoney(currentBal + totalCurrentRevenue - totalCurrentExp),
      {
        x: AMOUNT_CURRENT_X,
        y,
        size: 9,
        font: bold
      }
    );

  y -= 30;

    /* ================= FUND SUMMARY ================= */



  return await pdfDoc.save();
}
