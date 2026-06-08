import React, { useState } from "react";
import { FileJson, FileText, FileSpreadsheet, Loader2 } from "lucide-react";
import { SimulationInput, CompareSimulationsInput } from "../../types/simulation";
import { reportService } from "../../services/report-service";
import { ReportExportRequest } from "../../types/report";

interface ExportReportButtonsProps {
  simulationInput?: SimulationInput;
  comparisonInput?: CompareSimulationsInput;
  defaultTitle?: string;
}

export default function ExportReportButtons({
  simulationInput,
  comparisonInput,
  defaultTitle = "Relatório WorkScale Simulator",
}: ExportReportButtonsProps) {
  const [exporting, setExporting] = useState<"json" | "csv" | "md" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleExport = async (format: "json" | "csv" | "md") => {
    setExporting(format);
    setError(null);

    const payload: ReportExportRequest = {
      title: defaultTitle,
      simulation: simulationInput,
      comparison: comparisonInput,
      include_daily_results: true,
      include_assumptions: true,
      include_limitations: true,
    };

    try {
      if (format === "json") {
        const res = await reportService.exportJson(payload);
        const blob = new Blob([JSON.stringify(res.data, null, 2)], {
          type: "application/json",
        });
        triggerDownload(blob, res.filename);
      } else if (format === "csv") {
        const res = await reportService.exportCsv(payload);
        const blob = new Blob([res.content], { type: "text/csv;charset=utf-8;" });
        triggerDownload(blob, res.filename);
      } else if (format === "md") {
        const res = await reportService.exportMarkdown(payload);
        const blob = new Blob([res.content], { type: "text/markdown" });
        triggerDownload(blob, res.filename);
      }
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro ao exportar o relatório.");
    } finally {
      setExporting(null);
    }
  };

  const triggerDownload = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
      <div>
        <h4 className="text-sm font-bold text-slate-200">📥 Exportar Dados da Simulação</h4>
        <p className="text-xs text-slate-400 font-light mt-0.5">
          Baixe os resultados e premissas em formatos abertos e estruturados para análise externa.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => handleExport("json")}
          disabled={exporting !== null}
          className="flex items-center space-x-2 px-4 py-2.5 bg-slate-800 border border-slate-700 hover:border-teal-500/50 hover:bg-slate-800/80 disabled:opacity-50 text-slate-200 text-xs font-bold rounded-lg transition-all"
        >
          {exporting === "json" ? (
            <Loader2 className="w-4 h-4 animate-spin text-teal-400" />
          ) : (
            <FileJson className="w-4 h-4 text-teal-400" />
          )}
          <span>Exportar JSON</span>
        </button>

        <button
          onClick={() => handleExport("csv")}
          disabled={exporting !== null}
          className="flex items-center space-x-2 px-4 py-2.5 bg-slate-800 border border-slate-700 hover:border-amber-500/50 hover:bg-slate-800/80 disabled:opacity-50 text-slate-200 text-xs font-bold rounded-lg transition-all"
        >
          {exporting === "csv" ? (
            <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
          ) : (
            <FileSpreadsheet className="w-4 h-4 text-amber-500" />
          )}
          <span>Exportar CSV</span>
        </button>

        <button
          onClick={() => handleExport("md")}
          disabled={exporting !== null}
          className="flex items-center space-x-2 px-4 py-2.5 bg-slate-800 border border-slate-700 hover:border-indigo-500/50 hover:bg-slate-800/80 disabled:opacity-50 text-slate-200 text-xs font-bold rounded-lg transition-all"
        >
          {exporting === "md" ? (
            <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
          ) : (
            <FileText className="w-4 h-4 text-indigo-400" />
          )}
          <span>Exportar Markdown</span>
        </button>
      </div>

      {error && (
        <p className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-lg">
          ⚠️ {error}
        </p>
      )}
    </div>
  );
}
