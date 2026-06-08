import React from "react";
import Link from "next/link";

export default function AppHeader() {
  return (
    <header className="relative z-10 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-teal-400 to-emerald-400 flex items-center justify-center font-bold text-slate-950 shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform">
              W
            </div>
            <span className="font-bold tracking-tight text-xl bg-clip-text text-transparent bg-gradient-to-r from-teal-300 to-emerald-300">
              WorkScale
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
            <Link href="/simulator" className="hover:text-teal-300 transition-colors">
              Simulador
            </Link>
            <Link href="/compare" className="hover:text-teal-300 transition-colors">
              Comparar Cenários
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <span className="bg-slate-900 border border-slate-800 px-2.5 py-0.5 rounded-full text-xs font-medium text-emerald-400">
            v0.2.0 (FastAPI API)
          </span>
        </div>
      </div>
    </header>
  );
}
