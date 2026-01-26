import { PDFDocument, StandardFonts } from "pdf-lib";
import { getPriorAndCurrentYearLabels } from "../utils/fiscalYearLabels";
export async function createCertificationPage(budget) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4
  const { priorLabel, currentLabel } =
    getPriorAndCurrentYearLabels(budget?.fiscalYear);
  const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const bold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

  const LEFT = 70;
  const RIGHT = 525;
  let y = 740;

  /* ================= TITLE ================= */

  page.drawText("CERTIFICATION OF BUDGET & APPROPRIATION ORDINANCE", {
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

  /* ================= BODY TEXT ================= */

  page.drawText(
    "The undersigned, duly elected, qualified and acting Clerk of",
    { x: LEFT, y, size: 11, font }
  );

  page.drawText("Elgin", { x: LEFT + 385, y, size: 11, font });
  page.drawLine({
    start: { x: LEFT + 360, y: y - 2 },
    end: { x: LEFT + 440, y: y - 2 },
    thickness: 0.8
  });

  y -= 22;

  page.drawText(
    "Township,",
    { x: LEFT, y, size: 11, font }
  );

  page.drawText("Kane", { x: LEFT + 110, y, size: 11, font });
  page.drawLine({
    start: { x: LEFT + 90, y: y - 2 },
    end: { x: LEFT + 150, y: y - 2 },
    thickness: 0.8
  });

  page.drawText(
    "County, Illinois, does hereby certify that attached",
    { x: LEFT + 160, y, size: 11, font }
  );

  y -= 22;

  page.drawText(
    "hereto is a true and correct copy of the Budget & Appropriation Ordinance of said Township for",
    { x: LEFT, y, size: 11, font }
  );

  y -= 22;

  page.drawText(
    "the fiscal year beginning ____________________, 20__ and ending ____________________,",
    { x: LEFT, y, size: 11, font }
  );

  y -= 22;

  page.drawText(
    "20__ as adopted this _____ day of ____________________, 20__.",
    { x: LEFT, y, size: 11, font }
  );

  y -= 30;

  page.drawText(
    "This certification is made and filed pursuant to the requirements of (35 ILCS 200/18-50) and on",
    { x: LEFT, y, size: 11, font }
  );

  y -= 22;

  page.drawText(
    "behalf of",
    { x: LEFT, y, size: 11, font }
  );

  page.drawText("Elgin", { x: LEFT + 70, y, size: 11, font });
  page.drawLine({
    start: { x: LEFT + 60, y: y - 2 },
    end: { x: LEFT + 120, y: y - 2 },
    thickness: 0.8
  });

  page.drawText(
    "Township,",
    { x: LEFT + 130, y, size: 11, font }
  );

  page.drawText("Kane", { x: LEFT + 230, y, size: 11, font });
  page.drawLine({
    start: { x: LEFT + 220, y: y - 2 },
    end: { x: LEFT + 280, y: y - 2 },
    thickness: 0.8
  });

  page.drawText(
    "County, Illinois.",
    { x: LEFT + 290, y, size: 11, font }
  );

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
    end: { x: LEFT + 320, y },
    thickness: 0.8
  });

  y -= 14;

  page.drawText("Town Clerk", {
    x: LEFT + 200,
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
    end: { x: LEFT + 320, y },
    thickness: 0.8
  });

  y -= 14;

  page.drawText("County Clerk", {
    x: LEFT + 195,
    y,
    size: 10,
    font
  });

  /* ================= FOOTER ================= */

  page.drawText("2-12", {
    x: 295,
    y: 40,
    size: 9,
    font
  });

  return await pdfDoc.save();
}
