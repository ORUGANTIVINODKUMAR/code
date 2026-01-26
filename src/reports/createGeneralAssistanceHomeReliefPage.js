import { PDFDocument, StandardFonts } from "pdf-lib";
import { getPriorAndCurrentYearLabels } from "../utils/fiscalYearLabels";
export async function createGeneralAssistanceHomeReliefPage(budget) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]);

  const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const bold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  const { priorLabel, currentLabel } =
    getPriorAndCurrentYearLabels(budget?.fiscalYear);
  const LEFT = 70;
  const RIGHT = 525;
  const TOP = 740;

  const CODE_X = LEFT;
  const LABEL_X = LEFT + 25;

  const PRIOR_X = RIGHT - 160;
  const CURRENT_X = RIGHT - 60;

  const DOLLAR_PRIOR_X = PRIOR_X;
  const AMOUNT_PRIOR_X = PRIOR_X + 18;
  const DOLLAR_CURRENT_X = CURRENT_X;
  const AMOUNT_CURRENT_X = CURRENT_X + 18;

  let y = TOP;

  /* ========= HEADER ========= */

  page.drawText("HOME RELIEF", {
    x: LABEL_X,
    y,
    size: 11,
    font: bold
  });

  page.drawLine({
    start: { x: LABEL_X, y: y - 2 },
    end: { x: LABEL_X + 79, y: y - 2 },
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


  y -= 40;

  const homeRelief =
    budget?.entries?.generalAssistance?.["Home Relief"] || {};

  let totalPrior = 0;
  let totalCurrent = 0;

  /* ===== COMMODITIES & CONTRACTUAL SERVICES ===== */

  page.drawText("COMMODITIES & CONTRACTUAL SERVICES", {
    x: LABEL_X,
    y,
    size: 10,
    font: bold
  });

  y -= 20;

  const commodities =
    homeRelief["Commodities & Contractual Services"] || {};

  Object.entries(commodities)
    .sort(([, a], [, b]) => Number(a.code) - Number(b.code))
    .forEach(([name, acc]) => {
      const prior = Number(acc.lastYear || 0);
      const current = Number(acc.budget || 0);
      if (prior === 0 && current === 0) return;

      page.drawText(String(acc.code), { x: CODE_X, y, size: 9, font });
      page.drawText(name, { x: LABEL_X + 10, y, size: 9, font });

      page.drawText("$", { x: DOLLAR_PRIOR_X, y, size: 9, font });
      page.drawText(prior.toLocaleString(), { x: AMOUNT_PRIOR_X, y, size: 9, font });

      page.drawText("$", { x: DOLLAR_CURRENT_X, y, size: 9, font });
      page.drawText(current.toLocaleString(), { x: AMOUNT_CURRENT_X, y, size: 9, font });

      totalPrior += prior;
      totalCurrent += current;
      y -= 16;
    });

  /* ===== OTHER EXPENDITURES ===== */

  y -= 12;

  page.drawText("OTHER EXPENDITURES", {
    x: LABEL_X,
    y,
    size: 10,
    font: bold
  });

  y -= 18;

  const other = homeRelief["Other Expenditures"] || {};

  Object.entries(other)
    .sort(([, a], [, b]) => Number(a.code) - Number(b.code))
    .forEach(([name, acc]) => {
      const prior = Number(acc.lastYear || 0);
      const current = Number(acc.budget || 0);
      if (prior === 0 && current === 0) return;

      page.drawText(String(acc.code), { x: CODE_X, y, size: 9, font });
      page.drawText(name, { x: LABEL_X + 10, y, size: 9, font });

      page.drawText("$", { x: DOLLAR_PRIOR_X, y, size: 9, font });
      page.drawText(prior.toLocaleString(), { x: AMOUNT_PRIOR_X, y, size: 9, font });

      page.drawText("$", { x: DOLLAR_CURRENT_X, y, size: 9, font });
      page.drawText(current.toLocaleString(), { x: AMOUNT_CURRENT_X, y, size: 9, font });

      totalPrior += prior;
      totalCurrent += current;
      y -= 16;
    });

  /* ===== TOTAL ===== */

  y -= 12;

  page.drawText("TOTAL HOME RELIEF:", {
    x: LABEL_X,
    y,
    size: 10,
    font: bold
  });

  page.drawText("$", { x: DOLLAR_PRIOR_X, y, size: 10, font: bold });
  page.drawText(totalPrior.toLocaleString(), { x: AMOUNT_PRIOR_X, y, size: 10, font: bold });

  page.drawText("$", { x: DOLLAR_CURRENT_X, y, size: 10, font: bold });
  page.drawText(totalCurrent.toLocaleString(), { x: AMOUNT_CURRENT_X, y, size: 10, font: bold });

  page.drawText("2-8", { x: 295, y: 40, size: 9, font });

  return await pdfDoc.save();
}
