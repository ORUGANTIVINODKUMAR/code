import { PDFDocument, StandardFonts } from "pdf-lib";
import { getPriorAndCurrentYearLabels } from "../utils/fiscalYearLabels";

export async function createSections6And7Page() {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4

  const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const bold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

  const LEFT = 70;
  const RIGHT = 525;
  let y = 740;

  /* ================= SECTION 6 ================= */

  page.drawText(
    "SECTION 6: That Section 3 shall be and is a summary of the annual Appropriation Ordinance",
    { x: LEFT, y, size: 11, font }
  );

  y -= 20;

  page.drawText(
    "of this Township, passed by the Board of Trustees as required by law and shall be in full force",
    { x: LEFT, y, size: 11, font }
  );

  y -= 20;

  page.drawText(
    "and effect from and after this date.",
    { x: LEFT, y, size: 11, font }
  );

  y -= 40;

  /* ================= SECTION 7 ================= */

  page.drawText(
    "SECTION 7: That a certified copy of the Budget & Appropriation Ordinance shall be filed with",
    { x: LEFT, y, size: 11, font }
  );

  y -= 20;

  page.drawText(
    "the County Clerk within 30 days after adoption.",
    { x: LEFT, y, size: 11, font }
  );

  y -= 40;

  /* ================= ADOPTION LINE ================= */

  page.drawText(
    "ADOPTED this ______ day of ____________________, year pursuant to a roll call vote by the",
    { x: LEFT, y, size: 11, font }
  );

  y -= 20;

  page.drawText(
    "Board of Trustees of ________ Township, Kane County, Illinois.",
    { x: LEFT, y, size: 11, font }
  );

  y -= 60;

  /* ================= BOARD OF TRUSTEES TABLE ================= */

  page.drawText("BOARD OF TRUSTEES", {
    x: LEFT,
    y,
    size: 11,
    font: bold
  });

  // underline header
  page.drawLine({
    start: { x: LEFT, y: y - 2 },
    end: { x: LEFT + 150, y: y - 2 },
    thickness: 1
  });

  page.drawText("AYE", { x: RIGHT - 170, y, size: 10, font: bold });
  page.drawText("NAY", { x: RIGHT - 105, y, size: 10, font: bold });
  page.drawText("ABSENT", { x: RIGHT - 35, y, size: 10, font: bold });

  y -= 30;

  /* ================= BLANK TRUSTEE LINES ================= */

  const ROWS = 5;

  for (let i = 0; i < ROWS; i++) {
    // Name line
    page.drawLine({
      start: { x: LEFT, y },
      end: { x: LEFT + 220, y },
      thickness: 0.8
    });

    // AYE / NAY / ABSENT lines
    page.drawLine({
      start: { x: RIGHT - 175, y },
      end: { x: RIGHT - 145, y },
      thickness: 0.8
    });

    page.drawLine({
      start: { x: RIGHT - 110, y },
      end: { x: RIGHT - 80, y },
      thickness: 0.8
    });

    page.drawLine({
      start: { x: RIGHT - 40, y },
      end: { x: RIGHT - 10, y },
      thickness: 0.8
    });

    y -= 28;
  }

  y -= 20;

  /* ================= TOWN CLERK ================= */

  page.drawLine({
    start: { x: LEFT + 40, y },
    end: { x: LEFT + 180, y },
    thickness: 0.8
  });

  y -= 14;

  page.drawText("Town Clerk", {
    x: LEFT + 85,
    y,
    size: 10,
    font
  });

  /* ================= FOOTER ================= */



  return await pdfDoc.save();
}
