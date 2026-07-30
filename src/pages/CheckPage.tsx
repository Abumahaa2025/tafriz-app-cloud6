import * as React from "react";
import { CheckSquare, Plus, Trash2, Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loadLocal, saveLocal } from "@/lib/storage";

interface ChecklistItem {
  id: string;
  text: string;
  done: boolean;
}

export default function CheckPage({ onBack }: { onBack?: () => void }) {
  const [items, setItems] = React.useState<ChecklistItem[]>(() => loadLocal("checklist", []));
  const [text, setText] = React.useState("");

  function persist(next: ChecklistItem[]) {
    setItems(next);
    saveLocal("checklist", next);
  }

  function addItem() {
    if (!text.trim()) return;
    persist([{ id: crypto.randomUUID(), text: text.trim(), done: false }, ...items]);
    setText("");
  }

  return (
    <div className="mx-auto flex max-w-md flex-col gap-4 px-4 pb-28 pt-4">
      <header className="flex items-center gap-2 py-2">
        {onBack && (
          <button onClick={onBack} className="text-muted-foreground">
            <ArrowRight className="h-5 w-5" />
          </button>
        )}
        <CheckSquare className="h-5 w-5 text-primary" />
        <h1 className="text-lg font-black">التشيك</h1>
      </header>

      <div className="flex gap-2">
        <Input
          placeholder="أضف عنصر تشييك جديد..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addItem()}
          className="text-right"
        />
        <Button size="icon" onClick={addItem}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex flex-col gap-2">
        {items.length === 0 && (
          <p className="text-center text-sm text-muted-foreground">لا توجد عناصر بعد</p>
        )}
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between rounded-xl border border-border px-3 py-2"
          >
            <button
              onClick={() => persist(items.filter((i) => i.id !== item.id))}
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </button>
            <span className={`flex-1 px-2 text-right text-sm ${item.done ? "text-muted-foreground line-through" : ""}`}>
              {item.text}
            </span>
            <button
              onClick={() =>
                persist(items.map((i) => (i.id === item.id ? { ...i, done: !i.done } : i)))
              }
              className={`flex h-6 w-6 items-center justify-center rounded-full border ${
                item.done ? "border-primary bg-primary text-primary-foreground" : "border-border"
              }`}
            >
              {item.done && <Check className="h-3.5 w-3.5" />}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
