import { PDFDocument, StandardFonts } from "pdf-lib";
import { getPriorAndCurrentYearLabels } from "../utils/fiscalYearLabels";

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


export async function createOrdinancePage(budget) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4
  const { priorLabel, currentLabel } =
    getPriorAndCurrentYearLabels(budget?.fiscalYear);
  const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const bold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

  const { startDate, endDate } = getFiscalDates(budget?.fiscalYear);

  /* ===== LAYOUT CONSTANTS ===== */
  const LEFT = 70;
  const WIDTH = 455;
  const BODY = 15;
  const LINE = 25;

  let y = 810;

  /* ===== HEADER ===== */
  page.drawText("DCEO #2 (Revised 7/03)", { x: 430, y, size: 9, font });

  y -= 100;

  page.drawText("BUDGET & APPROPRIATION ORDINANCE", {
    x: 95,
    y,
    size: 20,
    font: bold
  });

  y -= 30;

  page.drawText("TOWNSHIP", {
    x: 255,
    y,
    size: 13,
    font: bold
  });

  y -= 40;

  /* ===== PARAGRAPH 1 ===== */
  page.drawText(
    `An ordinance appropriating for all town purposes for _______________ Township, __________ County, Illinois, for the fiscal year beginning ${startDate} and ending ${endDate}.`,
    {
      x: LEFT,
      y,
      size: BODY,
      font,
      maxWidth: WIDTH,
      lineHeight: LINE
    }
  );

  y -= LINE * 3.4;

  page.drawText(
    "BE IT ORDAINED by the Board of Trustees of ______________ Township, __________ County, Illinois.",
    {
      x: LEFT,
      y,
      size: BODY,
      font,
      maxWidth: WIDTH,
      lineHeight: LINE
    }
  );

  y -= LINE * 2.8;

  /* ===== SECTION 1 ===== */
  page.drawText("SECTION 1:", {
    x: LEFT,
    y,
    size: BODY,
    font: bold
  });

  y -= LINE * 1.4;

  page.drawText(
    `That the amounts hereinafter set forth, or so much thereof as may be authorized by law, and as may be needed or deemed necessary to defray all expenses and liabilities of __________ Township, be and the same are hereby appropriated for the town purposes of said Township, County, Illinois, as hereinafter specified for the fiscal year beginning ${startDate} and ending ${endDate}.`,
    {
      x: LEFT,
      y,
      size: BODY,
      font,
      maxWidth: WIDTH,
      lineHeight: LINE
    }
  );

  y -= LINE * 6.5;

  /* ===== SECTION 2 ===== */
  page.drawText("SECTION 2:", {
    x: LEFT,
    y,
    size: BODY,
    font: bold
  });

  y -= LINE * 1.4;

  page.drawText(
    "That the following budget containing an estimate of revenues and expenditures is hereby adopted for the following funds:",
    {
      x: LEFT,
      y,
      size: BODY,
      font,
      maxWidth: WIDTH,
      lineHeight: LINE
    }
  );

  y -= LINE * 2;

  (budget?.funds || []).forEach((f) => {
    page.drawText(`• ${f}`, {
      x: LEFT + 25,
      y,
      size: BODY,
      font
    });
    y -= LINE * 1.4;
  });

  /* ===== FOOTER ===== */
  page.drawText("2-1", {
    x: 295,
    y: 40,
    size: 9,
    font
  });
  console.log("Fiscal year raw:", budget.fiscalYear);
  console.log("Parsed dates:", startDate, endDate);

  return await pdfDoc.save();
}
