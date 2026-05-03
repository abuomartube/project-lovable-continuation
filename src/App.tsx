import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import { GamificationProvider } from "@/hooks/useGamification";
import { XPToasts } from "@/components/lexo/XPToasts";
import { useDailyStreakPing } from "@/hooks/useStreak";

const queryClient = new QueryClient();

const StreakBootstrap = () => { useDailyStreakPing(); return null; };

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <GamificationProvider>
        <Toaster />
        <Sonner />
        <XPToasts />
        <StreakBootstrap />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </GamificationProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
