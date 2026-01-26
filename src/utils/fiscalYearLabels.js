export function getPriorAndCurrentYearLabels(fiscalYear) {
  if (!fiscalYear) {
    return { priorLabel: "", currentLabel: "" };
  }

  // CASE 1: Current Year (YYYY)
  if (/^\d{4}$/.test(fiscalYear)) {
    const year = Number(fiscalYear);
    return {
      currentLabel: `${year}`,
      priorLabel: `${year - 1}`
    };
  }

  // CASE 2: Township FY (YYYY-YYYY)
  const rangeMatch = fiscalYear.match(/(\d{4})\s*-\s*(\d{4})/);
  if (rangeMatch) {
    const start = Number(rangeMatch[1]);
    const end = Number(rangeMatch[2]);
    return {
      currentLabel: `${start}-${end}`,
      priorLabel: `${start - 1}-${end - 1}`
    };
  }

  // CASE 3: Custom FY (YYYY-MM-DD – YYYY-MM-DD)
  const customMatch = fiscalYear.match(
    /(\d{4})-\d{2}-\d{2}\s*[–-]\s*(\d{4})-\d{2}-\d{2}/
  );

  if (customMatch) {
    const startYear = Number(customMatch[1]);
    const endYear = Number(customMatch[2]);
    return {
      currentLabel: `${startYear}-${endYear}`,
      priorLabel: `${startYear - 1}-${endYear - 1}`
    };
  }

  return { priorLabel: "", currentLabel: "" };
}
