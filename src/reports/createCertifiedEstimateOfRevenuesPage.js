import { PDFDocument, StandardFonts } from "pdf-lib";
import { getPriorAndCurrentYearLabels } from "../utils/fiscalYearLabels";

export async function createCertifiedEstimateOfRevenuesPage(budget) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4

  const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const bold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

  // SAFE: budget is now passed correctly
  getPriorAndCurrentYearLabels(budget?.fiscalYear);

  const LEFT = 70;
  let y = 740;

  /* ================= TITLE ================= */

  page.drawText("CERTIFIED ESTIMATE OF REVENUES BY SOURCE", {
    x: LEFT + 40,
    y,
    size: 12,
    font: bold
  });

  y -= 40;

  /* ================= TOWNSHIP HEADER ================= */

  page.drawText("TOWNSHIP", {
    x: LEFT,
    y,
    size: 11,
    font: bold
  });

  y -= 30;

  /* ================= BODY ================= */

  page.drawText(
    "The undersigned, Supervisor, Chief Fiscal Officer, of",
    { x: LEFT, y, size: 11, font }
  );

  page.drawText("Elgin", { x: LEFT + 405, y, size: 11, font });
  page.drawLine({
    start: { x: LEFT + 380, y: y - 2 },
    end: { x: LEFT + 460, y: y - 2 },
    thickness: 0.8
  });

  y -= 22;

  page.drawText("Township,", { x: LEFT, y, size: 11, font });

  page.drawText("Kane", { x: LEFT + 115, y, size: 11, font });
  page.drawLine({
    start: { x: LEFT + 95, y: y - 2 },
    end: { x: LEFT + 155, y: y - 2 },
    thickness: 0.8
  });

  page.drawText(
    "County, Illinois, does hereby certify that the",
    { x: LEFT + 165, y, size: 11, font }
  );

  y -= 22;

  page.drawText(
    "estimate of revenues by source or anticipated to be received by said taxing district, is either set",
    { x: LEFT, y, size: 11, font }
  );

  y -= 22;

  page.drawText(
    "forth in said ordinance as \"Revenues\" or attached hereto by separate document, is a true",
    { x: LEFT, y, size: 11, font }
  );

  y -= 22;

  page.drawText(
    "statement of said estimate.",
    { x: LEFT, y, size: 11, font }
  );

  y -= 30;

  page.drawText(
    "This certification is made and filed pursuant to the requirements of (35 ILCS 200/18-50) and on",
    { x: LEFT, y, size: 11, font }
  );

  y -= 22;

  page.drawText("behalf of", { x: LEFT, y, size: 11, font });

  page.drawText("Elgin", { x: LEFT + 70, y, size: 11, font });
  page.drawLine({
    start: { x: LEFT + 60, y: y - 2 },
    end: { x: LEFT + 120, y: y - 2 },
    thickness: 0.8
  });

  page.drawText("Township,", { x: LEFT + 130, y, size: 11, font });

  page.drawText("Kane", { x: LEFT + 235, y, size: 11, font });
  page.drawLine({
    start: { x: LEFT + 225, y: y - 2 },
    end: { x: LEFT + 285, y: y - 2 },
    thickness: 0.8
  });

  page.drawText("County,", { x: LEFT + 295, y, size: 11, font });
  page.drawText("Illinois.", { x: LEFT + 360, y, size: 11, font });

  y -= 22;

  page.drawText(
    "This certification must be filed within 30 days after the adoption of the Budget &",
    { x: LEFT, y, size: 11, font }
  );

  y -= 22;

  page.drawText(
    "Appropriation Ordinance.",
    { x: LEFT, y, size: 11, font }
  );

  y -= 50;

  /* ================= SIGNATURES ================= */

  page.drawText(
    "Dated this _____ day of ____________________, 20__",
    { x: LEFT + 100, y, size: 11, font }
  );

  y -= 40;

  page.drawLine({
    start: { x: LEFT + 140, y },
    end: { x: LEFT + 360, y },
    thickness: 0.8
  });

  y -= 14;

  page.drawText("Supervisor - Chief Fiscal Officer", {
    x: LEFT + 170,
    y,
    size: 10,
    font
  });

  y -= 50;

  page.drawText(
    "Filed this _____ day of ____________________, 20__",
    { x: LEFT + 100, y, size: 11, font }
  );

  y -= 40;

  page.drawLine({
    start: { x: LEFT + 140, y },
    end: { x: LEFT + 360, y },
    thickness: 0.8
  });

  y -= 14;

  page.drawText("County Clerk", {
    x: LEFT + 215,
    y,
    size: 10,
    font
  });

  /* ================= FOOTER ================= */

  page.drawText("2-13", {
    x: 295,
    y: 40,
    size: 9,
    font
  });

  return await pdfDoc.save();
}
