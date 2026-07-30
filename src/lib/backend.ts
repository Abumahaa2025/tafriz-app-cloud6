import { localBackend } from "./backend-local";
import type { Backend } from "./backend-types";

// كل صفحات التطبيق تتكلم مع "backend" فقط ولا تعرف تفاصيل التخزين — بهذا
// الشكل، لو ربطت لاحقًا Supabase أو أي خادم حقيقي، تستبدل السطر التالي فقط
// بدون ما تلمس أي صفحة أو مكوّن آخر في المشروع.
export const backend: Backend = localBackend;
