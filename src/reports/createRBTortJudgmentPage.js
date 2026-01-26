import { PDFDocument, StandardFonts } from "pdf-lib";

/* ================= HELPERS ================= */
function formatMoney(value) {
  const num = Number(value) || 0;
  if (num < 0) {
    return `(${Math.abs(num).toLocaleString()})`;
  }
  return num.toLocaleString();
}

export async function createRBTortJudgmentPage(budget) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]);

  const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const bold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

  const LEFT = 95;
  const RIGHT = 480;
  let y = 760;

  const FUND_KEY = "rbTortJudgment";
  const fundData = budget.entries?.[FUND_KEY];

  if (!fundData) {
    return await pdfDoc.save();
  }

  /* ================= HEADER ================= */

  page.drawText("Warren Road District", { x: 200, y, size: 11, font: bold });
  y -= 16;

  page.drawText("Final Budget", { x: 240, y, size: 10, font });
  y -= 16;

  page.drawText("For the Year Ended February 28, 2026", {
    x: 170,
    y,
    size: 9,
    font
  });

  y -= 30;
  page.drawText("R&B Tort Judgment & Liability Insurance", {
    x: LEFT,
    y,
    size: 10,
    font: bold
  });

  /* ================= NON DEPARTMENTAL ================= */

  y -= 20;
  page.drawText("Non Departmental", {
    x: LEFT,
    y,
    size: 9,
    font: bold
  });

  y -= 14;
  page.drawText("Revenue", {
    x: LEFT + 20,
    y,
    size: 9,
    font
  });

  /* ================= REVENUES ================= */

  const revenues = fundData.Revenues?.accounts || {};
  let totalRevenue = 0;

  Object.values(revenues).forEach(acc => {
    const value = Number(acc.budget || 0);
    if (!value) return;

    y -= 14;
    page.drawText(acc.name, {
      x: LEFT + 40,
      y,
      size: 9,
      font
    });

    page.drawText(formatMoney(value), {
      x: RIGHT,
      y,
      size: 9,
      font
    });

    totalRevenue += value;
  });

  /* ================= EXPENDITURES ================= */

  const expenditures = fundData.Expenditure?.accounts || {};
  let totalExpenditures = 0;

  Object.values(expenditures).forEach(acc => {
    totalExpenditures += Number(acc.budget || 0);
  });

  /* ================= NON DEPARTMENTAL TOTAL ================= */

  y -= 10;
  page.drawText("Non Departmental Totals:", {
    x: LEFT + 40,
    y,
    size: 9,
    font: bold
  });

  page.drawText(
    formatMoney(totalRevenue - totalExpenditures),
    {
      x: RIGHT,
      y,
      size: 9,
      font: bold
    }
  );

  /* ================= FUND SUMMARY ================= */

  const beginningBalance =
    Number(fundData.__meta?.beginningBalance || 0);

  const endingBalance =
    beginningBalance + totalRevenue - totalExpenditures;

  y -= 30;
  page.drawText("Fund Beginning Balance", {
    x: LEFT,
    y,
    size: 9,
    font
  });

  page.drawText(formatMoney(beginningBalance), {
    x: RIGHT,
    y,
    size: 9,
    font
  });

  y -= 14;
  page.drawText("Total Fund Revenues", {
    x: LEFT,
    y,
    size: 9,
    font
  });

  page.drawText(formatMoney(totalRevenue), {
    x: RIGHT,
    y,
    size: 9,
    font
  });

  y -= 14;
  page.drawText("Total Fund Expenditures", {
    x: LEFT,
    y,
    size: 9,
    font
  });

  page.drawText(formatMoney(totalExpenditures), {
    x: RIGHT,
    y,
    size: 9,
    font
  });

  y -= 18;
  page.drawText("Fund Ending Balance", {
    x: LEFT,
    y,
    size: 9,
    font: bold
  });

  page.drawText(formatMoney(endingBalance), {
    x: RIGHT,
    y,
    size: 9,
    font: bold
  });

  return await pdfDoc.save();
}
