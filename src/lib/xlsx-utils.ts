import * as XLSX from "xlsx";

export interface ParsedSheet {
  headers: string[];
  rows: Record<string, string | number>[];
}

/** Reads the first sheet of an xlsx/xls/csv file into headers + row objects. */
export async function parseSpreadsheet(file: File): Promise<ParsedSheet> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });
  const firstSheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[firstSheetName];

  const rows = XLSX.utils.sheet_to_json<Record<string, string | number>>(sheet, {
    defval: "",
  });

  const headers =
    rows.length > 0
      ? Object.keys(rows[0])
      : (XLSX.utils.sheet_to_json(sheet, { header: 1 })[0] as string[]) || [];

  return { headers, rows };
}

/** Finds the header that best matches a keyword (e.g. "لوحة" for plate number columns). */
export function guessColumn(headers: string[], keywords: string[]): string | null {
  for (const keyword of keywords) {
    const match = headers.find((h) => h.includes(keyword));
    if (match) return match;
  }
  return headers[0] ?? null;
}
