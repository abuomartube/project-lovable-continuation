import { ChevronLeft, Bell, MessageCircle, Sparkles, BookOpen, GraduationCap, ChevronLeft as Chev, Layers, User } from "lucide-react";
import { IconButton } from "./IconButton";

const englishCourses = [
  { title: "A1 → B1", desc: "ابدأ من الأساس وتحدث بثقة", tag: "Beginner", tint: "from-purple-500 to-indigo-600" },
  { title: "B1+ → C1", desc: "ارتقِ إلى الطلاقة المتقدمة", tag: "Intermediate+", tint: "from-blue-500 to-cyan-500" },
  { title: "A1 → C1", desc: "رحلة كاملة من البداية للاحتراف", tag: "Complete", tint: "from-amber-500 to-orange-500" },
];

const ieltsCourses = [
  { title: "Lexo for Intro", level: "4.5 → 6" },
  { title: "Lexo for Advanced", level: "6 → 8" },
  { title: "Lexo for All-in-one", level: "4.5 → 8", best: true },
];

export const CourseSelectionScreen = () => {
  return (
    <div dir="rtl" className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-glass-border/40 bg-card/60 px-4 pb-3 pt-10 backdrop-blur-xl">
        <IconButton variant="ghost" size="sm">
          <Bell className="h-4 w-4" />
        </IconButton>
        <div className="flex flex-col items-center">
          <h2 className="text-sm font-semibold">اختر دورتك</h2>
          <p className="text-[10px] text-muted-foreground">اختر الباقة المناسبة لمستواك وهدفك</p>
        </div>
        <span className="h-8 w-8" />
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto px-3 py-4">
        <div>
          <h3 className="mb-2 px-1 text-[10px] font-bold tracking-wider text-primary-glow">LEXO FOR ENGLISH</h3>
          <div className="space-y-2.5">
            {englishCourses.map((c) => (
              <div key={c.title} className="glass flex items-center gap-3 rounded-2xl p-3 transition-all hover:border-primary/40 hover:shadow-glow">
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-bold">{c.title}</h4>
                  <p className="mt-0.5 text-[10px] text-muted-foreground">{c.desc}</p>
                  <span className="mt-1.5 inline-block rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[9px] font-medium text-primary-glow">
                    {c.tag}
                  </span>
                </div>
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-glow ${c.tint}`}>
                  <MessageCircle className="h-5 w-5" />
                </div>
                <Chev className="h-4 w-4 rotate-180 text-primary-glow" />
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-2 px-1 text-[10px] font-bold tracking-wider text-primary-glow">LEXO FOR IELTS</h3>
          <div className="space-y-2.5">
            {ieltsCourses.map((c) => (
              <div key={c.title} className="glass flex items-center gap-3 rounded-2xl p-3">
                <div className="flex-1">
                  <h4 className="text-sm font-bold">{c.title}</h4>
                  <p className="mt-0.5 text-[10px] text-muted-foreground">{c.level}</p>
                  {c.best && (
                    <span className="mt-1 inline-block rounded-full bg-gradient-primary px-2 py-0.5 text-[9px] font-bold text-white">
                      Best Value
                    </span>
                  )}
                </div>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-glow">
                  <GraduationCap className="h-5 w-5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom nav */}
      <div className="flex items-center justify-around border-t border-glass-border/40 bg-card/60 px-3 py-2.5 backdrop-blur-xl">
        <button className="flex flex-col items-center gap-0.5 text-[9px] text-primary-glow">
          <BookOpen className="h-4 w-4" /> الدورات
        </button>
        <button className="flex flex-col items-center gap-0.5 text-[9px] text-muted-foreground">
          <Layers className="h-4 w-4" /> الشات
        </button>
        <button className="flex flex-col items-center gap-0.5 text-[9px] text-muted-foreground">
          <User className="h-4 w-4" /> الملف الشخصي
        </button>
      </div>
    </div>
  );
};

export default CourseSelectionScreen;