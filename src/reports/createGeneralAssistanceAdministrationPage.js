import { PDFDocument, StandardFonts } from "pdf-lib";
import { getPriorAndCurrentYearLabels } from "../utils/fiscalYearLabels";
export async function createGeneralAssistanceAdministrationPage(budget) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4

  const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const bold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  const { priorLabel, currentLabel } =
    getPriorAndCurrentYearLabels(budget?.fiscalYear);
  /* ===== LAYOUT CONSTANTS ===== */
  const LEFT = 70;
  const RIGHT = 525;
  const TOP = 740;

  const LABEL_X = LEFT + 25;
  const CODE_X = LEFT;
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

  page.drawText("200", {
    x: CODE_X,
    y,
    size: 11,
    font: bold
  });

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
     ADMINISTRATION TITLE
  ===================================================== */

  y -= 50;

  page.drawText("ADMINISTRATION", {
    x: LABEL_X,
    y,
    size: 11,
    font: bold
  });

  page.drawLine({
    start: { x: LABEL_X, y: y - 2 },
    end: { x: LABEL_X + 100, y: y - 2 },
    thickness: 0.8
  });

  y -= 24;

  /* =====================================================
     DATA SOURCE
  ===================================================== */

  const admin =
    budget?.entries?.generalAssistance?.Administration || {};

  let totalPrior = 0;
  let totalCurrent = 0;

  /* =====================================================
     RENDER CATEGORIES
  ===================================================== */

  Object.entries(admin).forEach(([category, accounts]) => {
    // Category title
    page.drawText(category.toUpperCase(), {
      x: LABEL_X,
      y,
      size: 10,
      font: bold
    });


    y -= 18;

    Object.entries(accounts).forEach(([name, acc]) => {
      const prior = Number(acc?.lastYear || 0);
      const current = Number(acc?.budget || 0);

      if (prior === 0 && current === 0) return;

      page.drawText(acc.code || "", {
        x: CODE_X,
        y,
        size: 9,
        font
      });

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

      totalPrior += prior;
      totalCurrent += current;

      y -= 16;
    });

    y -= 12;
  });

  /* =====================================================
     TOTAL ADMINISTRATION
  ===================================================== */

  y -= 16;

  page.drawText("TOTAL ADMINISTRATION", {
    x: LABEL_X,
    y,
    size: 10,
    font: bold
  });

  page.drawText("$", {
    x: DOLLAR_PRIOR_X,
    y,
    size: 10,
    font: bold
  });

  page.drawText(totalPrior.toLocaleString(), {
    x: AMOUNT_PRIOR_X,
    y,
    size: 10,
    font: bold
  });

  page.drawText("$", {
    x: DOLLAR_CURRENT_X,
    y,
    size: 10,
    font: bold
  });

  page.drawText(totalCurrent.toLocaleString(), {
    x: AMOUNT_CURRENT_X,
    y,
    size: 10,
    font: bold
  });

  /* =====================================================
     FOOTER
  ===================================================== */


  return await pdfDoc.save();
}
