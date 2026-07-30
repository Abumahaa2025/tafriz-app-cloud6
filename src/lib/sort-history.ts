import { loadLocal, saveLocal } from "./storage";
import { SortResultRow } from "./sort-logic";

export interface SortHistoryEntry {
  id: string;
  createdAt: string;
  dataFileName: string;
  referralFileName: string;
  unsortedCount: number;
  distinctMatchedPlates: number;
  matchedRows: SortResultRow[];
}

const KEY = "sort_history";
const MAX_ENTRIES = 30; // يمنع تضخّم التخزين المحلي بمرور الوقت

export function addHistoryEntry(entry: Omit<SortHistoryEntry, "id" | "createdAt">) {
  const history = loadLocal<SortHistoryEntry[]>(KEY, []);
  const full: SortHistoryEntry = {
    ...entry,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  saveLocal(KEY, [full, ...history].slice(0, MAX_ENTRIES));
}

export function listHistory(): SortHistoryEntry[] {
  return loadLocal<SortHistoryEntry[]>(KEY, []);
}

export interface SearchHit {
  entry: SortHistoryEntry;
  row: SortResultRow;
}

/** بحث متقدّم عبر كل عمليات الفرز المحفوظة، برقم اللوحة أو اسم الشارع. */
export function searchHistory(query: string): SearchHit[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const hits: SearchHit[] = [];
  for (const entry of listHistory()) {
    for (const row of entry.matchedRows) {
      if (row.plate.toLowerCase().includes(q) || row.street.toLowerCase().includes(q)) {
        hits.push({ entry, row });
      }
    }
  }
  return hits;
}
