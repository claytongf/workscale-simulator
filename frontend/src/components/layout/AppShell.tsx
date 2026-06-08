import React from "react";
import AppHeader from "./AppHeader";

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative z-10 select-none">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0 opacity-30">
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-gradient-to-br from-teal-500/15 to-emerald-500/0 blur-[100px]" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-gradient-to-br from-indigo-500/15 to-purple-500/0 blur-[100px]" />
      </div>

      <AppHeader />

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {children}
      </main>

      <footer className="relative z-10 w-full border-t border-slate-900/60 py-6 text-center text-xs text-slate-500 mt-auto">
        <p>© 2026 WorkScale Simulator. Open Source under the MIT License.</p>
        <p className="mt-2 text-slate-600 max-w-2xl mx-auto px-4">
          Este simulador é educacional e experimental. Os resultados dependem das premissas escolhidas e não substituem orientação jurídica, trabalhista, contábil, médica, psicológica ou econômica.
        </p>
      </footer>
    </div>
  );
}
