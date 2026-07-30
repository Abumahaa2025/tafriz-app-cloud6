import * as React from "react";
import { ArrowRight, Search, Database } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { listHistory, searchHistory, SearchHit } from "@/lib/sort-history";

export default function DatabasePage({ onBack }: { onBack: () => void }) {
  const [query, setQuery] = React.useState("");
  const history = React.useMemo(() => listHistory(), []);
  const results: SearchHit[] = React.useMemo(() => searchHistory(query), [query]);

  return (
    <div className="mx-auto flex max-w-md flex-col gap-4 px-4 pb-28 pt-4">
      <header className="flex items-center gap-2 py-2">
        <button onClick={onBack} className="text-muted-foreground">
          <ArrowRight className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-black">قاعدة البيانات</h1>
      </header>

      <div className="relative">
        <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="بحث متقدم برقم اللوحة أو اسم الشارع..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pr-10 text-right"
        />
      </div>

      {query.trim() ? (
        <div className="flex flex-col gap-2">
          <p className="text-xs text-muted-foreground">{results.length} نتيجة</p>
          {results.map((hit, i) => (
            <Card key={i}>
              <CardContent className="flex items-center justify-between pt-4">
                <span className="text-xs text-muted-foreground">
                  {new Date(hit.entry.createdAt).toLocaleDateString("ar-SA")}
                </span>
                <div className="text-right">
                  <p className="text-sm font-bold">{hit.row.plate}</p>
                  <p className="text-xs text-muted-foreground">{hit.row.street}</p>
                </div>
              </CardContent>
            </Card>
          ))}
          {results.length === 0 && (
            <p className="text-center text-sm text-muted-foreground">لا توجد نتائج مطابقة</p>
          )}
        </div>
      ) : (
        <>
          <p className="text-xs text-muted-foreground">
            كل عمليات الفرز التي أكملتها محفوظة هنا — استخدم البحث أعلاه للوصول
            لأي لوحة أو شارع فورًا من أي عملية سابقة.
          </p>
          <div className="flex flex-col gap-2">
            {history.length === 0 && (
              <p className="text-center text-sm text-muted-foreground">لا توجد عمليات فرز محفوظة بعد</p>
            )}
            {history.map((entry) => (
              <Card key={entry.id}>
                <CardContent className="flex flex-col gap-1 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Database className="h-3 w-3" />
                      {new Date(entry.createdAt).toLocaleString("ar-SA")}
                    </span>
                    <span className="text-sm font-bold">{entry.matchedRows.length} لوحة مفرزة</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {entry.dataFileName} ← {entry.referralFileName}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
