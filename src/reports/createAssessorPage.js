import { PDFDocument, StandardFonts } from "pdf-lib";
import { getPriorAndCurrentYearLabels } from "../utils/fiscalYearLabels";
export async function createAssessorPage(budget) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4

  const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const bold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

  /* ===== LAYOUT CONSTANTS ===== */
  const LEFT = 70;
  const RIGHT = 525;
  const TOP = 740;
  const { priorLabel, currentLabel } =
    getPriorAndCurrentYearLabels(budget?.fiscalYear);
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

  page.drawText("101", {
    x: LEFT,
    y,
    size: 11,
    font: bold
  });

  page.drawText("ASSESSOR", {
    x: LABEL_X,
    y,
    size: 11,
    font: bold
  });

  page.drawLine({
    start: { x: LABEL_X, y: y - 2 },
    end: { x: LABEL_X + 58, y: y - 2 },
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
     ASSSESSOR EXPENDITURES
  ===================================================== */

  y -= 40;

  const assessor = budget?.entries?.generalTown?.Assessor || {};

  let totalPrior = 0;
  let totalCurrent = 0;

  Object.entries(assessor).forEach(([category, accounts]) => {
    // Category label
    page.drawText(category.toUpperCase(), {
      x: LABEL_X + 20,
      y,
      size: 9,
      font: bold
    });

    y -= 16;

    Object.entries(accounts || {}).forEach(([name, acc]) => {
      const prior = Number(acc?.lastYear || 0);
      const current = Number(acc?.budget || 0);

      if (prior === 0 && current === 0) return;

      page.drawText(name, {
        x: LABEL_X + 40,
        y,
        size: 9,
        font
      });

      page.drawText("$", {
        x: DOLLAR_PRIOR_X,
        y,
        size: 9,
        font
      });

      page.drawText(prior.toLocaleString(), {
        x: AMOUNT_PRIOR_X,
        y,
        size: 9,
        font
      });

      page.drawText("$", {
        x: DOLLAR_CURRENT_X,
        y,
        size: 9,
        font
      });

      page.drawText(current.toLocaleString(), {
        x: AMOUNT_CURRENT_X,
        y,
        size: 9,
        font
      });

      totalPrior += prior;
      totalCurrent += current;

      y -= 14;
    });

    y -= 10;
  });

  /* =====================================================
     TOTAL ASSESSOR
  ===================================================== */



  y -= 16;

  page.drawText("TOTAL ASSESSOR", {
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



  return await pdfDoc.save();
}
