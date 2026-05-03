import { Sparkles } from "lucide-react";
import { AppShell } from "@/components/lexo/AppShell";
import { MobileFrame } from "@/components/lexo/MobileFrame";
import { ChatScreen } from "@/components/lexo/ChatScreen";
import { RoomSelectionScreen } from "@/components/lexo/RoomSelectionScreen";
import { RoomDetailsScreen } from "@/components/lexo/RoomDetailsScreen";
import { GlassCard } from "@/components/lexo/GlassCard";
import { GradientButton } from "@/components/lexo/GradientButton";

const Index = () => {
  return (
    <AppShell>
      <header className="mb-12 flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-glass-border/40 bg-secondary/40 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            English Practice Community
          </div>
          <h1 className="text-5xl font-bold tracking-tight md:text-6xl">
            <span className="text-gradient">LEXO</span> Chat
          </h1>
          <p className="mt-3 max-w-xl text-sm text-muted-foreground md:text-base">
            منصة تفاعلية لممارسة اللغة الإنجليزية عبر الشات الصوتي والكتابي مع متعلمين من جميع أنحاء العالم.
          </p>
        </div>
        <GradientButton size="lg">Get Started</GradientButton>
      </header>

      <div className="grid gap-10 lg:grid-cols-[1fr_auto]">
        <GlassCard className="hidden p-8 lg:block">
          <h2 className="mb-6 text-xl font-semibold">المميزات الرئيسية</h2>
          <div className="space-y-4">
            {[
              { t: "غرف محادثة متعددة", d: "اختر الغرفة المناسبة لمستواك وهدفك" },
              { t: "محادثة نصية وصوتية", d: "تواصل بحرية عبر النص أو الصوت" },
              { t: "وضع إنجليزي فقط", d: "بيئة تعليمية تركز على اللغة الإنجليزية" },
              { t: "مواضيع تفاعلية", d: "مواضيع يومية، أسئلة، تحدي الجليد والمزيد" },
            ].map((f) => (
              <div key={f.t} className="flex items-start gap-3 rounded-2xl border border-glass-border/30 bg-secondary/30 p-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-primary shadow-glow">
                  <Sparkles className="h-4 w-4 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold">{f.t}</h3>
                  <p className="text-xs text-muted-foreground">{f.d}</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <div className="flex flex-wrap justify-center gap-10 lg:justify-end">
          <MobileFrame label="2">
            <RoomSelectionScreen />
          </MobileFrame>
          <MobileFrame label="3">
            <RoomDetailsScreen />
          </MobileFrame>
          <MobileFrame label="4">
            <ChatScreen />
          </MobileFrame>
        </div>
      </div>
    </AppShell>
  );
};

export default Index;
