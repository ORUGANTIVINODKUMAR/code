import { PDFDocument, StandardFonts } from "pdf-lib";

/* ================= HELPERS ================= */

function getFiscalDates(fiscalYear) {
  if (!fiscalYear) {
    return { startDate: "__________", endDate: "__________" };
  }

  // Custom FY
  const customMatch = fiscalYear.match(
    /Custom FY\s*\((\d{4}-\d{2}-\d{2})\s*[–-]\s*(\d{4}-\d{2}-\d{2})\)/
  );
  if (customMatch) {
    return {
      startDate: customMatch[1],
      endDate: customMatch[2]
    };
  }

  // Township FY
  const years = fiscalYear.match(/\d{4}/g);
  if (years && years.length >= 2) {
    return {
      startDate: `April 1, ${years[0]}`,
      endDate: `March 31, ${years[1]}`
    };
  }

  // Calendar year
  if (/^\d{4}$/.test(fiscalYear)) {
    return {
      startDate: `January 1, ${fiscalYear}`,
      endDate: `December 31, ${fiscalYear}`
    };
  }

  return { startDate: "__________", endDate: "__________" };
}
function numberToWords(num) {
  const a = [
    "", "One", "Two", "Three", "Four", "Five", "Six",
    "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve",
    "Thirteen", "Fourteen", "Fifteen", "Sixteen",
    "Seventeen", "Eighteen", "Nineteen"
  ];

  const b = [
    "", "", "Twenty", "Thirty", "Forty",
    "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"
  ];

  const inWords = (n) => {
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n / 10)] + (n % 10 ? " " + a[n % 10] : "");
    if (n < 1000)
      return (
        a[Math.floor(n / 100)] +
        " Hundred" +
        (n % 100 ? " " + inWords(n % 100) : "")
      );
    if (n < 1000000)
      return (
        inWords(Math.floor(n / 1000)) +
        " Thousand" +
        (n % 1000 ? " " + inWords(n % 1000) : "")
      );
    if (n < 1000000000)
      return (
        inWords(Math.floor(n / 1000000)) +
        " Million" +
        (n % 1000000 ? " " + inWords(n % 1000000) : "")
      );
    return "";
  };

  return inWords(num).trim();
}

function calculateFundTotal(fundData) {
  let total = 0;
  if (!fundData) return 0;

  Object.entries(fundData).forEach(([sectionKey, sectionVal]) => {
    if (sectionKey === "Revenues" || sectionKey === "__meta") return;

    Object.values(sectionVal || {}).forEach(category => {
      Object.values(category || {}).forEach(acc => {
        total += Number(acc?.budget || 0);
      });
    });
  });

  return total;
}

/* ================= PAGE ================= */

export async function createRoadBridgeOrdinancePage(budget) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4

  const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const bold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

  const LEFT = 70;
  const RIGHT = 525;
  let y = 760;

  const { startDate, endDate } = getFiscalDates(budget?.fiscalYear);

  const township = budget?.townshipId?.townshipName || "________";
  const county = budget?.townshipId?.county || "________";

  /* ================= TITLE ================= */

  page.drawText("BUDGET & APPROPRIATION ORDINANCE", {
    x: LEFT + 60,
    y,
    size: 12,
    font: bold
  });

  y -= 28;

  page.drawText("ROAD DISTRICT", {
    x: LEFT + 175,
    y,
    size: 11,
    font: bold
  });

  y -= 28;

  page.drawText("ORDINANCE NO. __________", {
    x: LEFT + 135,
    y,
    size: 11,
    font: bold
  });

  y -= 40;

  /* ================= INTRO ================= */

  page.drawText(
    `An ordinance appropriating for all road purposes for ${township} Township Road District,`,
    { x: LEFT, y, size: 11, font }
  );

  y -= 18;

  page.drawText(
    `${county} County, Illinois, for the fiscal year beginning ${startDate} and ending ${endDate}.`,
    { x: LEFT, y, size: 11, font }
  );

  y -= 30;

  page.drawText(
    `BE IT ORDAINED by the Board of Trustees of ${township} Township, ${county} County, Illinois.`,
    { x: LEFT, y, size: 11, font }
  );

  y -= 30;

  /* ================= SECTION 1 ================= */



  page.drawText(
    `SECTION 1:That the amounts hereinafter set forth, or so much thereof as may be authorized by law, and as may be needed or deemed necessary to defray all expenses and liabilities of ${township} Township Road District, be and the same are hereby appropriated for road purposes of said Township Road District for the fiscal year beginning ${startDate} and ending ${endDate}.`,
    {
      x: LEFT,
      y,
      size: 11,
      font,
      maxWidth: RIGHT - LEFT,
      lineHeight: 14
    }
  );

  y -= 60;

  /* ================= SECTION 2 ================= */



  page.drawText(
    "SECTION 2:That the following budget containing an estimate of revenues and expenditures is hereby adopted for the following funds:",
    { x: LEFT, y, size: 11, font, maxWidth: RIGHT - LEFT,lineHeight: 14 }
  );

  y -= 30;

  const fundLabelMap = {
    roadBridge: "Warren Township Road and Bridge",
    permanentRoad: "Special Road Improvement",
    equipmentBuilding: "Building & Equipment",
    motorFuelTax: "Tort Judgment & Liability Insurance"
  };

  budget.funds.forEach(fundKey => {
    page.drawText(fundLabelMap[fundKey] || fundKey, {
      x: LEFT + 120,
      y,
      size: 11,
      font
    });
    y -= 15;
  });

  y -= 15;

  /* ================= SECTION 3 ================= */


  page.drawText(
    `SECTION 3:That the amount appropriated for road purposes for the fiscal year beginning ${startDate} and ending ${endDate} by fund shall be as follows:`,
    { x: LEFT, y, size: 11, font, maxWidth: RIGHT - LEFT,lineHeight: 14 }
  );

  y -= 50;

  let totalAppropriations = 0;

  budget.funds.forEach(fundKey => {
    const fundTotal = calculateFundTotal(budget.entries?.[fundKey]);
    totalAppropriations += fundTotal;

    page.drawText(fundLabelMap[fundKey] || fundKey, {
      x: LEFT + 20,
      y,
      size: 11,
      font
    });

    page.drawText(`$${fundTotal.toLocaleString()}`, {
      x: RIGHT - 100,
      y,
      size: 11,
      font
    });

    y -= 18;
  });

  y -= 10;

  page.drawText("TOTAL APPROPRIATIONS:", {
    x: LEFT + 20,
    y,
    size: 11,
    font: bold
  });

  page.drawText(`$${totalAppropriations.toLocaleString()}`, {
    x: RIGHT - 100,
    y,
    size: 11,
    font: bold
  });

  y -= 40;

  /* ================= SECTION 4 ================= */


  page.drawText(
    "SECTION 4:That if any section, subdivision, sentence, clause, or provision of this ordinance shall be held invalid or unconstitutional, such decision shall not affect the validity of the remaining portions of this ordinance.",
    {
      x: LEFT,
      y,
      size: 11,
      font,
      maxWidth: RIGHT - LEFT,
      lineHeight: 14
    }
  );

  y -= 20;

  /* ================= SECTION 5 ================= */

  y -= 40;

  const totalAmountFormatted = `$${totalAppropriations.toLocaleString()}.00`;
  const totalAmountWords = numberToWords(totalAppropriations);


  y -= 18;

  page.drawText(
    "SECTION 5:That each appropriated fund total shall be divided among the several objects and purposes,",
    { x: LEFT, y, size: 11, font,lineHeight: 14 }
  );

  y -= 18;

  page.drawText(
    "specified and in the particular amounts stated for each fund respectively in Section 2, constituting the total",
    { x: LEFT, y, size: 11, font,lineHeight: 14 }
  );

  y -= 18;

  page.drawText(
    ` appropriations in the amount of ${totalAmountWords} Dollars `,
    {
      x: LEFT,
      y,
      size: 11,
      font,
      maxWidth: 455,
      lineHeight: 14
    }
  );



  y -= 30;

  page.drawText(
    `(${totalAmountFormatted}) for the fiscal year beginning ${startDate} and ending ${endDate}.`,
    { x: LEFT, y, size: 11, font,lineHeight: 14 }
  );



  /* ================= FOOTER ================= */

  page.drawText("RD-1", {
    x: 290,
    y: 40,
    size: 9,
    font
  });

  return await pdfDoc.save();
}
