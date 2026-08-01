-- 1. جدول المستخدمين وأكواد التفعيل
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user',
    activation_code TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. جدول تتبع السيارات
CREATE TABLE IF NOT EXISTS public.cars (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plate_number TEXT NOT NULL,
    street TEXT,
    notes TEXT,
    status TEXT DEFAULT 'untracked', -- (untracked / tracked / sorted)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. جدول سجل عمليات الفرز
CREATE TABLE IF NOT EXISTS public.sorting_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id),
    file_name TEXT,
    total_records INTEGER,
    sorted_type TEXT, -- (full / new / single)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. جدول الملاحظات والإعلانات وتقارير الأخطاء
CREATE TABLE IF NOT EXISTS public.system_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL, -- (feedback / announcement / error_report)
    title TEXT,
    content TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- تفعيل صلاحيات القراءة والكتابة العامة (Anon Access) للتطبيق
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sorting_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anon read/write for users" ON public.users FOR ALL USING (true);
CREATE POLICY "Allow anon read/write for cars" ON public.cars FOR ALL USING (true);
CREATE POLICY "Allow anon read/write for sorting_logs" ON public.sorting_logs FOR ALL USING (true);
CREATE POLICY "Allow anon read/write for system_logs" ON public.system_logs FOR ALL USING (true);
